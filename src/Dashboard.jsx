import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Check, X, Search, Plus, MessageSquare, FileText } from "lucide-react";
import { getLogs, approveLogById, rejectLogById, addLog } from "@/lib/api";
import { useAuth } from "@/AuthProvider";

export default function Dashboard() {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Add Log form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newLog, setNewLog] = useState({
    user_query: "",
    model_response: "",
    validation_score: 0,
    external_verification_required: false,
    notes: "",
    status: "pending"
  });

  // ChatGPT Mode state
  const [showChatGPTMode, setShowChatGPTMode] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [currentResponse, setCurrentResponse] = useState("");
  const [isCapturing, setIsCapturing] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        setIsLoading(true);
        setError("");
        const data = await getLogs();
        setLogs(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err?.message || "Failed to load logs");
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const filteredLogs = logs.filter(
    (log) =>
      log.user_query.toLowerCase().includes(search.toLowerCase()) ||
      log.model_response.toLowerCase().includes(search.toLowerCase())
  );

  const formatTimestamp = (ts) => {
    if (!ts) return "-"
    if (typeof ts === 'string') return ts
    if (ts?.seconds) {
      return new Date(ts.seconds * 1000).toLocaleString()
    }
    try {
      const d = new Date(ts)
      if (!Number.isNaN(d.getTime())) return d.toLocaleString()
    } catch (_) {}
    return String(ts)
  }

  // Validation logic (same as Cloud Functions would do)
  const validateResponse = async (userQuery, modelResponse) => {
    let validationScore = 0.0;
    let notes = "Validation completed.";
    let externalVerificationRequired = false;
    const validators = [];

    // Validator 1: Check if model_response contains error keywords
    if (modelResponse) {
      const errorKeywords = ["error", "fail", "cannot", "unable", "sorry"];
      const hasErrorKeywords = errorKeywords.some(keyword => 
        modelResponse.toLowerCase().includes(keyword)
      );
      if (hasErrorKeywords) {
        validationScore = Math.max(validationScore, 0.1);
        notes = "Model response contains error keywords.";
        externalVerificationRequired = true;
        validators.push({
          name: "error_keywords",
          pass: false,
          score: 0.1,
          details: "Contains error-related keywords"
        });
      } else {
        validators.push({
          name: "error_keywords",
          pass: true,
          score: 0.8,
          details: "No error keywords detected"
        });
      }
    }

    // Validator 2: Check response length
    if (modelResponse) {
      if (modelResponse.length < 10) {
        validationScore = Math.max(validationScore, 0.3);
        notes = "Model response is too short.";
        validators.push({
          name: "response_length",
          pass: false,
          score: 0.3,
          details: `Response length: ${modelResponse.length} chars (min: 10)`
        });
      } else {
        validators.push({
          name: "response_length",
          pass: true,
          score: 0.9,
          details: `Response length: ${modelResponse.length} chars`
        });
      }
    }

    // Validator 3: Check if user_query contains sensitive keywords
    if (userQuery) {
      const sensitiveKeywords = ["password", "credit card", "ssn", "personal"];
      const hasSensitiveKeywords = sensitiveKeywords.some(keyword => 
        userQuery.toLowerCase().includes(keyword)
      );
      if (hasSensitiveKeywords) {
        validationScore = Math.min(validationScore, 0.5);
        notes += " User query contains sensitive keywords.";
        externalVerificationRequired = true;
        validators.push({
          name: "sensitive_keywords",
          pass: true,
          score: 0.5,
          details: "Contains sensitive keywords"
        });
      } else {
        validators.push({
          name: "sensitive_keywords",
          pass: true,
          score: 0.9,
          details: "No sensitive keywords detected"
        });
      }
    }

    // Validator 4: Web Search Factual Validation
    try {
      const factualScore = await validateFactualAccuracy(userQuery, modelResponse);
      validators.push({
        name: "factual_accuracy",
        pass: factualScore >= 0.7,
        score: factualScore,
        details: factualScore >= 0.7 ? "Factually accurate" : "Factual accuracy concerns"
      });
      
      // If factual score is low, require external verification
      if (factualScore < 0.7) {
        externalVerificationRequired = true;
        notes += " Factual accuracy requires verification.";
      }
    } catch (error) {
      validators.push({
        name: "factual_accuracy",
        pass: false,
        score: 0.5,
        details: "Factual validation failed - manual review needed"
      });
      externalVerificationRequired = true;
    }

    // Calculate final validation score (average of all validators)
    if (validators.length > 0) {
      const totalScore = validators.reduce((sum, validator) => sum + validator.score, 0);
      validationScore = totalScore / validators.length;
    }

    return { validationScore, notes, externalVerificationRequired, validators };
  };

  // Web search validation function
  const validateFactualAccuracy = async (userQuery, modelResponse) => {
    try {
      // Extract search query from the question
      const searchQuery = extractEntities(userQuery);
      
      if (!searchQuery || searchQuery === "General information") {
        return 0.8; // Neutral score if no clear entities
      }

      // Search Wikipedia for factual information
      const searchResults = await searchWeb(searchQuery);
      
      if (searchResults.includes("No specific information found") || searchResults.includes("Search failed")) {
        return 0.6; // Neutral score if search fails
      }
      
      // Compare AI response with Wikipedia results
      const similarity = calculateSimilarity(modelResponse.toLowerCase(), searchResults.toLowerCase());
      
      // Convert similarity to score (0-1)
      if (similarity > 0.8) return 0.9;      // Very similar
      if (similarity > 0.6) return 0.7;      // Somewhat similar  
      if (similarity > 0.4) return 0.5;      // Partially similar
      if (similarity > 0.2) return 0.3;      // Low similarity
      return 0.1;                             // Very different
      
    } catch (error) {
      console.error("Factual validation error:", error);
      return 0.5; // Neutral score on error
    }
  };

  // Extract key entities from question and create Wikipedia search query
  const extractEntities = (question) => {
    const lowerQuestion = question.toLowerCase();
    let searchQuery = "";
    
    // Common factual question patterns
    if (lowerQuestion.includes("who is") || lowerQuestion.includes("who was")) {
      if (lowerQuestion.includes("prime minister") || lowerQuestion.includes("pm")) {
        searchQuery = "Prime Minister of India";
      } else if (lowerQuestion.includes("president")) {
        if (lowerQuestion.includes("india")) {
          searchQuery = "President of India";
        } else if (lowerQuestion.includes("usa") || lowerQuestion.includes("united states")) {
          searchQuery = "President of the United States";
        } else {
          searchQuery = "President";
        }
      } else {
        // Extract the person/entity name
        const whoMatch = lowerQuestion.match(/who is (.+?)(\?|$)/);
        if (whoMatch) {
          searchQuery = whoMatch[1].trim();
        }
      }
    }
    
    if (lowerQuestion.includes("capital")) {
      if (lowerQuestion.includes("india")) {
        searchQuery = "New Delhi";
      } else if (lowerQuestion.includes("usa") || lowerQuestion.includes("united states")) {
        searchQuery = "Washington D.C.";
      } else if (lowerQuestion.includes("china")) {
        searchQuery = "Beijing";
      } else if (lowerQuestion.includes("russia")) {
        searchQuery = "Moscow";
      } else if (lowerQuestion.includes("uk") || lowerQuestion.includes("britain")) {
        searchQuery = "London";
      } else if (lowerQuestion.includes("france")) {
        searchQuery = "Paris";
      } else if (lowerQuestion.includes("germany")) {
        searchQuery = "Berlin";
      } else {
        searchQuery = "Capital city";
      }
    }
    
    if (lowerQuestion.includes("when") || lowerQuestion.includes("date")) {
      if (lowerQuestion.includes("independence")) {
        searchQuery = "Independence Day India";
      } else if (lowerQuestion.includes("republic")) {
        searchQuery = "Republic Day India";
      } else {
        searchQuery = "Historical event";
      }
    }
    
    if (lowerQuestion.includes("where")) {
      if (lowerQuestion.includes("taj mahal")) {
        searchQuery = "Taj Mahal";
      } else if (lowerQuestion.includes("mount everest")) {
        searchQuery = "Mount Everest";
      } else if (lowerQuestion.includes("ganges")) {
        searchQuery = "Ganges River";
      } else {
        searchQuery = "Geographic location";
      }
    }
    
    // If no specific pattern found, try to extract key terms
    if (!searchQuery) {
      const keyTerms = [];
      const specificEntities = ["india", "usa", "china", "russia", "uk", "france", "germany", "delhi", "mumbai", "bangalore"];
      specificEntities.forEach(entity => {
        if (lowerQuestion.includes(entity)) {
          keyTerms.push(entity);
        }
      });
      
      if (keyTerms.length > 0) {
        searchQuery = keyTerms.join(" ");
      }
    }
    
    return searchQuery || "General information";
  };

  // Wikipedia API search function
  const searchWeb = async (query) => {
    try {
      // Wikipedia API endpoint
      const searchUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`;
      
      const response = await fetch(searchUrl);
      
      if (!response.ok) {
        // If direct page not found, try search API
        const searchApiUrl = `https://en.wikipedia.org/w/api.php?action=query&format=json&list=search&srsearch=${encodeURIComponent(query)}&origin=*`;
        const searchResponse = await fetch(searchApiUrl);
        
        if (searchResponse.ok) {
          const searchData = await searchResponse.json();
          if (searchData.query && searchData.query.search && searchData.query.search.length > 0) {
            const firstResult = searchData.query.search[0];
            return firstResult.snippet.replace(/<\/?[^>]+(>|$)/g, ""); // Remove HTML tags
          }
        }
        
        return "No specific information found";
      }
      
      const data = await response.json();
      
      if (data.extract) {
        return data.extract;
      } else if (data.description) {
        return data.description;
      } else {
        return "Information found but no extract available";
      }
      
    } catch (error) {
      console.error("Wikipedia API error:", error);
      return "Search failed - manual review needed";
    }
  };

  // Calculate similarity between two strings (stopword-aware + simple lemmatization)
  const calculateSimilarity = (str1, str2) => {
    const stopwords = new Set([
      'a','an','the','and','or','but','if','then','else','when','while','of','in','on','at','to','for','from','by','with','about','as','into','like','through','after','over','between','out','against','during','without','before','under','around','among',
      'is','am','are','was','were','be','been','being','do','does','did','doing','have','has','had','having','it','its','this','that','these','those','i','you','he','she','they','we','them','his','her','their','our','your','yours','ours',
      'not','no','yes','can','could','should','would','may','might','will','shall','also','too','very','just'
    ])

    const lemma = (w) => {
      // basic lemmatization/stemming for common English endings
      if (w.length <= 3) return w
      // plurals
      if (/ies$/.test(w)) return w.replace(/ies$/, 'y') // cities -> city
      if (/ses$|xes$|zes$|ches$|shes$/.test(w)) return w.replace(/es$/, '') // classes -> class
      if (/s$/.test(w) && !/ss$/.test(w)) return w.replace(/s$/, '') // languages -> language
      // past/gerund
      if (/ing$/.test(w) && w.length > 5) return w.replace(/ing$/, '') // running -> runn (approx)
      if (/ed$/.test(w) && w.length > 4) return w.replace(/ed$/, '') // worked -> work
      return w
    }

    const normalize = (text) =>
      text
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, ' ')
        .split(/\s+/)
        .map(t => t.trim())
        .filter(w => w && !stopwords.has(w) && w.length > 2)
        .map(lemma)

    const words1 = Array.from(new Set(normalize(str1)))
    const words2 = Array.from(new Set(normalize(str2)))

    if (words1.length === 0 || words2.length === 0) return 0

    const common = words1.filter(w1 => words2.some(w2 => w1 === w2 || w1.includes(w2) || w2.includes(w1)))
    const total = Math.max(words1.length, words2.length)
    return common.length / total
  };

  // ChatGPT Mode functions
  const startCapturing = () => {
    setIsCapturing(true);
    setChatHistory([]);
    setCurrentQuestion("");
    setCurrentResponse("");
  };

  const stopCapturing = () => {
    setIsCapturing(false);
    setShowChatGPTMode(false);
  };

  const captureConversation = async (question, response) => {
    if (!isCapturing) return;

    try {
      // Validate the response
      const validation = await validateResponse(question, response);
      
      // Create log entry with validation results
      const logEntry = {
        user_query: question.trim(),
        model_response: response.trim(),
        validation_score: validation.validationScore,
        external_verification_required: validation.externalVerificationRequired,
        notes: validation.notes,
        validators: validation.validators,
        status: "validated",
        created_by: user?.email || "unknown",
        timestamp: new Date().toISOString(),
        source: "chatgpt_mode"
      };

      await addLog(logEntry);
      
      // Add to chat history
      setChatHistory(prev => [...prev, {
        question,
        response,
        validation: validation,
        timestamp: new Date()
      }]);
      
      // Reload logs to show the new entry
      const data = await getLogs();
      setLogs(Array.isArray(data) ? data : []);
      
    } catch (err) {
      console.error("Failed to capture conversation:", err);
    }
  };

  const handleAddLog = async (e) => {
    e.preventDefault();
    if (!newLog.user_query.trim() || !newLog.model_response.trim()) {
      setError("Please fill in both user query and model response");
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      
      // Validate the response
      const validation = await validateResponse(newLog.user_query, newLog.model_response);
      
      // Create log entry with validation results
      const logEntry = {
        user_query: newLog.user_query.trim(),
        model_response: newLog.model_response.trim(),
        validation_score: validation.validationScore,
        external_verification_required: validation.externalVerificationRequired,
        notes: validation.notes,
        validators: validation.validators,
        status: "validated",
        created_by: user?.email || "unknown",
        timestamp: new Date().toISOString()
      };

      await addLog(logEntry);
      
      // Reset form and reload logs
      setNewLog({ user_query: "", model_response: "", validation_score: 0, external_verification_required: false, notes: "", status: "pending" });
      setShowAddForm(false);
      
      // Reload logs to show the new entry
      const data = await getLogs();
      setLogs(Array.isArray(data) ? data : []);
      
    } catch (err) {
      setError(err?.message || "Failed to add log");
    } finally {
      setIsLoading(false);
    }
  };

  const approveLog = async (id) => {
    const previous = logs
    setLogs(
      logs.map((log) =>
        log.id === id ? { ...log, notes: log.notes + " | Approved" } : log
      )
    )
    try {
      await approveLogById(id)
    } catch (e) {
      setLogs(previous)
      setError("Approve failed")
    }
  }

  const rejectLog = async (id) => {
    const previous = logs
    setLogs(
      logs.map((log) =>
        log.id === id ? { ...log, notes: log.notes + " | Rejected" } : log
      )
    )
    try {
      await rejectLogById(id)
    } catch (e) {
      setLogs(previous)
      setError("Reject failed")
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">AI Response Validation Dashboard</h1>
        <div className="flex gap-2">
          <Button onClick={() => setShowChatGPTMode(!showChatGPTMode)} variant="outline">
            <MessageSquare className="h-4 w-4 mr-2" />
            {showChatGPTMode ? "Exit ChatGPT Mode" : "ChatGPT Mode"}
          </Button>
          <Button onClick={() => setShowAddForm(!showAddForm)}>
            <Plus className="h-4 w-4 mr-2" />
            {showAddForm ? "Cancel" : "Add Log"}
          </Button>
        </div>
      </div>

      {/* ChatGPT Mode Interface */}
      {showChatGPTMode && (
        <Card className="shadow-lg rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">ChatGPT Mode - Auto-Capture Conversations</h2>
              <div className="flex gap-2">
                {!isCapturing ? (
                  <Button onClick={startCapturing} className="bg-green-600 hover:bg-green-700">
                    Start Capturing
                  </Button>
                ) : (
                  <Button onClick={stopCapturing} variant="destructive">
                    Stop Capturing
                  </Button>
                )}
              </div>
            </div>
            
            {isCapturing && (
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium mb-2">Your Question</label>
                    <Input
                      placeholder="Type your question here..."
                      value={currentQuestion}
                      onChange={(e) => setCurrentQuestion(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">AI Response</label>
                    <Input
                      placeholder="Paste AI response here..."
                      value={currentResponse}
                      onChange={(e) => setCurrentResponse(e.target.value)}
                    />
                  </div>
                </div>
                <Button 
                  onClick={() => captureConversation(currentQuestion, currentResponse)}
                  disabled={!currentQuestion.trim() || !currentResponse.trim()}
                  className="w-full"
                >
                  Capture & Validate Conversation
                </Button>
                
                <div className="text-sm text-muted-foreground">
                  💡 <strong>How to use:</strong> Ask ChatGPT a question, copy the response, paste it here, and click "Capture & Validate". 
                  The system will automatically validate and log everything!
                </div>
              </div>
            )}

            {/* Chat History */}
            {chatHistory.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-3">Captured Conversations</h3>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {chatHistory.map((chat, index) => (
                    <div key={index} className="border rounded-lg p-3 bg-gray-50">
                      <div className="text-sm text-gray-600 mb-1">
                        {chat.timestamp.toLocaleTimeString()}
                      </div>
                      <div className="font-medium text-sm">Q: {chat.question}</div>
                      <div className="text-sm mt-1">A: {chat.response}</div>
                      <div className="mt-2">
                        <span className={`px-2 py-1 rounded-full text-white text-xs ${
                          chat.validation.validationScore >= 0.7
                            ? "bg-green-600"
                            : chat.validation.validationScore >= 0.3
                            ? "bg-yellow-500"
                            : "bg-red-600"
                        }`}>
                          Score: {chat.validation.validationScore.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Add Log Form */}
      {showAddForm && (
        <Card className="shadow-lg rounded-2xl">
          <CardContent className="p-6">
            <form onSubmit={handleAddLog} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium mb-2">User Query</label>
                  <Input
                    placeholder="Enter the user's question/prompt..."
                    value={newLog.user_query}
                    onChange={(e) => setNewLog({...newLog, user_query: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Model Response</label>
                  <Input
                    placeholder="Enter the AI model's response..."
                    value={newLog.model_response}
                    onChange={(e) => setNewLog({...newLog, model_response: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Adding..." : "Add & Validate"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Search Bar */}
      <div className="flex gap-2 items-center">
        <Input
          placeholder="Search queries or responses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button variant="outline">
          <Search className="h-4 w-4" />
        </Button>
      </div>

      {isLoading && (
        <div className="text-sm text-muted-foreground">Loading logs…</div>
      )}
      {error && (
        <div className="text-sm text-red-600">{error}</div>
      )}

      {/* Logs Table */}
      <Card className="shadow-lg rounded-2xl">
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>User Query</TableHead>
                <TableHead>Model Response</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Verification</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>{formatTimestamp(log.timestamp)}</TableCell>
                  <TableCell>{log.user_query}</TableCell>
                  <TableCell>{log.model_response}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-white text-sm ${
                        Number(log.validation_score || 0) >= 0.7
                          ? "bg-green-600"
                          : Number(log.validation_score || 0) >= 0.3
                          ? "bg-yellow-500"
                          : "bg-red-600"
                      }`}
                    >
                      {Number(log.validation_score || 0).toFixed(2)}
                    </span>
                  </TableCell>
                  <TableCell>
                    {log.external_verification_required ? (
                      <span className="text-red-500 font-semibold">Required</span>
                    ) : (
                      <span className="text-green-600 font-semibold">Not Needed</span>
                    )}
                  </TableCell>
                  <TableCell>{log.notes}</TableCell>
                  <TableCell className="flex gap-2">
                    <Button size="sm" onClick={() => approveLog(log.id)}>
                      <Check className="h-4 w-4 mr-1" /> Approve
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => rejectLog(log.id)}>
                      <X className="h-4 w-4 mr-1" /> Reject
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
