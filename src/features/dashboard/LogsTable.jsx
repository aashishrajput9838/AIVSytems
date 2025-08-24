import { Button } from '@/shared/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table'
import { Check, X, Download } from 'lucide-react'
import { Card, CardContent } from '@/shared/components/ui/card'
import { exportLogsToCsv } from './utils'

export default function LogsTable({ logs, formatTimestamp, approveLog, rejectLog }) {
  return (
    <Card className="group relative overflow-hidden rounded-2xl border-0 bg-white/95 backdrop-blur-sm shadow-xl">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-black">Logs</h2>
          <Button onClick={() => exportLogsToCsv(logs)} variant="outline" className="border-gray-300 text-gray-700 hover:bg-amber-50">
            <Download className="h-4 w-4 mr-2" /> Export Logs CSV
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="border-gray-200">
              <TableHead className="text-black">Timestamp</TableHead>
              <TableHead className="text-black">User Query</TableHead>
              <TableHead className="text-black">Model Response</TableHead>
              <TableHead className="text-black">Score</TableHead>
              <TableHead className="text-black">Entity Type</TableHead>
              <TableHead className="text-black">Verification</TableHead>
              <TableHead className="text-black">Notes</TableHead>
              <TableHead className="text-black">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.id} className="border-gray-100 hover:bg-amber-50/40">
                <TableCell className="text-gray-600">{formatTimestamp(log.timestamp)}</TableCell>
                <TableCell className="text-black">{log.user_query}</TableCell>
                <TableCell className="text-black">{log.model_response}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-white text-sm ${
                      Number(log.validation_score || 0) >= 0.7
                        ? 'bg-green-600'
                        : Number(log.validation_score || 0) >= 0.3
                        ? 'bg-yellow-500'
                        : 'bg-red-600'
                    }`}
                  >
                    {Number(log.validation_score || 0).toFixed(2)}
                  </span>
                </TableCell>
                <TableCell className="text-gray-600">{log.entity_info?.entityType || 'N/A'}</TableCell>
                <TableCell>
                  {log.external_verification_required ? (
                    <span className="text-red-600 font-semibold">Required</span>
                  ) : (
                    <span className="text-green-700 font-semibold">Not Needed</span>
                  )}
                </TableCell>
                <TableCell className="text-gray-600">{log.notes}</TableCell>
                <TableCell className="flex gap-2">
                  <Button size="sm" onClick={() => approveLog(log.id)} className="bg-black text-white hover:bg-amber-600 hover:text-black">
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
  )
}



