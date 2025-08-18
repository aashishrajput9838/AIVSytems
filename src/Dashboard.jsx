import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Check, X, Search } from "lucide-react";

// Sample demo data (would come from backend / logs in real system)
const sampleLogs = [
  {
    id: 1,
    timestamp: "2025-08-18 12:58:09",
    user_query: "What is 123 * 45?",
    model_response: "123 * 45 = 5535. Because 123*40=4920 and 123*5=615, sum = 5535.",
    validation_score: 0.0,
    external_verification_required: false,
    notes: "Arithmetic: expected 5535.0, model answered 123.0",
  },
  {
    id: 2,
    timestamp: "2025-08-18 12:58:09",
    user_query: "Explain steps to reverse a linked list.",
    model_response: "To reverse a linked list: initialize prev=null, current=head...",
    validation_score: 0.0,
    external_verification_required: false,
    notes: "Procedural check passed partially.",
  },
  {
    id: 3,
    timestamp: "2025-08-18 12:58:09",
    user_query: "Who was the first President of the United States?",
    model_response: "George Washington.",
    validation_score: 0.2,
    external_verification_required: true,
    notes: "External verification recommended.",
  },
];

export default function Dashboard() {
  const [search, setSearch] = useState("");
  const [logs, setLogs] = useState(sampleLogs);

  const filteredLogs = logs.filter(
    (log) =>
      log.user_query.toLowerCase().includes(search.toLowerCase()) ||
      log.model_response.toLowerCase().includes(search.toLowerCase())
  );

  const approveLog = (id) => {
    setLogs(
      logs.map((log) =>
        log.id === id ? { ...log, notes: log.notes + " | Approved" } : log
      )
    );
  };

  const rejectLog = (id) => {
    setLogs(
      logs.map((log) =>
        log.id === id ? { ...log, notes: log.notes + " | Rejected" } : log
      )
    );
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">AI Response Validation Dashboard</h1>

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
                  <TableCell>{log.timestamp}</TableCell>
                  <TableCell>{log.user_query}</TableCell>
                  <TableCell>{log.model_response}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-white text-sm ${
                        log.validation_score >= 0.7
                          ? "bg-green-600"
                          : log.validation_score >= 0.3
                          ? "bg-yellow-500"
                          : "bg-red-600"
                      }`}
                    >
                      {log.validation_score}
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
