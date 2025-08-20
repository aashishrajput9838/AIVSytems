import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Check, X, Search } from "lucide-react";
import { getLogs, approveLogById, rejectLogById } from "@/lib/api";

export default function Dashboard() {
  const [search, setSearch] = useState("");
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        setIsLoading(true)
        setError("")
        const data = await getLogs()
        setLogs(Array.isArray(data) ? data : [])
      } catch (err) {
        setError(err?.message || "Failed to load logs")
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [])

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

  const approveLog = async (id) => {
    const previous = logs
    setLogs(
      logs.map((log) =>
        log.id === id ? { ...log, notes: "Approved" } : log
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
        log.id === id ? { ...log, notes: "Rejected" } : log
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
