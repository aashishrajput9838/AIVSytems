import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Check, X, Search, Plus } from "lucide-react";
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
      // Extract key entities from the question
      const entities = extractEntities(userQuery);
      
      if (entities.length === 0) {
        return 0.8; // Neutral score if no clear entities
      }

      // Search for factual information
      const searchResults = await searchWeb(entities.join(" "));
      
      // Compare AI response with search results
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

  // Extract key entities from question
  const extractEntities = (question) => {
    const lowerQuestion = question.toLowerCase();
    const entities = [];
    
    // Common factual question patterns
    if (lowerQuestion.includes("who is") || lowerQuestion.includes("who was")) {
      entities.push("current", "person", "leader");
    }
    if (lowerQuestion.includes("prime minister") || lowerQuestion.includes("pm")) {
      entities.push("prime minister", "india");
    }
    if (lowerQuestion.includes("capital")) {
      entities.push("capital", "country");
    }
    if (lowerQuestion.includes("president")) {
      entities.push("president", "country");
    }
    if (lowerQuestion.includes("when") || lowerQuestion.includes("date")) {
      entities.push("date", "event");
    }
    if (lowerQuestion.includes("where")) {
      entities.push("location", "place");
    }
    
    // Add specific entities mentioned
    const specificEntities = ["india", "usa", "china", "russia", "uk", "france", "germany"];
    specificEntities.forEach(entity => {
      if (lowerQuestion.includes(entity)) {
        entities.push(entity);
      }
    });
    
    return entities;
  };

  // Simulate web search (replace with actual API)
  const searchWeb = async (query) => {
    // For demo purposes, return mock search results
    // In production, integrate with Google Search API, Wikipedia API, etc.
    
    const mockResults = {
      "prime minister india": "Narendra Modi is the current Prime Minister of India",
      "capital india": "New Delhi is the capital of India",
      "president usa": "Joe Biden is the current President of the United States",
      "capital usa": "Washington D.C. is the capital of the United States"
    };
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return mock result or "No results found"
    return mockResults[query.toLowerCase()] || "No specific information found";
  };

  // Calculate similarity between two strings
  const calculateSimilarity = (str1, str2) => {
    const words1 = str1.split(/\s+/);
    const words2 = str2.split(/\s+/);
    
    const commonWords = words1.filter(word => 
      words2.some(word2 => word2.includes(word) || word.includes(word2))
    );
    
    const totalWords = Math.max(words1.length, words2.length);
    return commonWords.length / totalWords;
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
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          <Plus className="h-4 w-4 mr-2" />
          {showAddForm ? "Cancel" : "Add Log"}
        </Button>
      </div>

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
