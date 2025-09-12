import { Button } from '@/shared/components/ui/button'
import { ConfirmDialog } from '@/shared/components/ui'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table'
import { Check, X, Download, Trash2 } from 'lucide-react'
import { Card, CardContent } from '@/shared/components/ui/card'
import { TableSkeleton } from '@/shared/components/ui'
import { exportLogsToCsv } from './utils'

import { useState } from 'react'

export default function LogsTable({ logs = [], formatTimestamp, approveLog, rejectLog, onDelete }) {
  const [dialogState, setDialogState] = useState({ open: false, targetId: null })
  // Safety check for formatTimestamp function
  const safeFormatTimestamp = formatTimestamp || ((ts) => {
    if (!ts) return '-'
    if (typeof ts === 'string') return ts
    if (ts?.seconds) return new Date(ts.seconds * 1000).toLocaleString()
    const d = new Date(ts)
    return Number.isNaN(d.getTime()) ? String(ts) : d.toLocaleString()
  })

  // Safety check for logs array
  const safeLogs = Array.isArray(logs) ? logs : []

  return (
    <Card className="group relative overflow-hidden rounded-2xl border-0 bg-white/95 backdrop-blur-sm shadow-xl">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-4">
          <h2 
            id="logs-table-title"
            className="text-lg sm:text-xl font-semibold text-black"
          >
            Logs
          </h2>
          <Button 
            onClick={() => exportLogsToCsv(safeLogs)} 
            variant="outline" 
            className="border-gray-300 text-gray-700 hover:bg-amber-50 w-full sm:w-auto text-sm"
            aria-label="Export logs to CSV file"
            aria-describedby="export-description"
          >
            <Download className="h-4 w-4 mr-2" aria-hidden="true" /> 
            Export Logs CSV
          </Button>
          <span id="export-description" className="sr-only">
            Download all logs as a CSV file for analysis
          </span>
        </div>
        
        {safeLogs.length === 0 ? (
          <div 
            className="text-center py-6 sm:py-8"
            aria-live="polite"
            aria-label="No logs available"
          >
            <p className="text-gray-500 mb-4 text-sm sm:text-base">No logs available</p>
            <TableSkeleton rows={5} columns={8} />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table 
              aria-labelledby="logs-table-title"
              aria-describedby="logs-table-description"
              role="table"
            >
              <caption id="logs-table-description" className="sr-only">
                Table displaying validation logs with user queries, AI responses, validation scores, and actions
              </caption>
              <TableHeader>
                <TableRow className="border-gray-200" role="row">
                  <TableHead className="text-black" scope="col">Timestamp</TableHead>
                  <TableHead className="text-black" scope="col">User Query</TableHead>
                  <TableHead className="text-black" scope="col">Model Response</TableHead>
                  <TableHead className="text-black" scope="col">Score</TableHead>
                  <TableHead className="text-black" scope="col">Entity Type</TableHead>
                  <TableHead className="text-black" scope="col">Verification</TableHead>
                  <TableHead className="text-black" scope="col">Notes</TableHead>
                  <TableHead className="text-black" scope="col">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {safeLogs.map((log, index) => (
                  <TableRow 
                    key={log.id || index} 
                    className="border-gray-100 hover:bg-amber-50/40"
                    role="row"
                    aria-label={`Log entry ${index + 1} from ${safeFormatTimestamp(log.timestamp)}`}
                  >
                    <TableCell className="text-gray-600" role="cell">
                      <time dateTime={log.timestamp} aria-label={`Timestamp: ${safeFormatTimestamp(log.timestamp)}`}>
                        {safeFormatTimestamp(log.timestamp)}
                      </time>
                    </TableCell>
                    <TableCell className="text-black" role="cell">
                      <span aria-label={`User query: ${log.user_query}`}>
                        {log.user_query}
                      </span>
                    </TableCell>
                    <TableCell className="text-black" role="cell">
                      <span aria-label={`AI model response: ${log.model_response}`}>
                        {log.model_response}
                      </span>
                    </TableCell>
                    <TableCell role="cell">
                      <span
                        className={`px-2 py-1 rounded-full text-white text-sm ${
                          Number(log.validation_score || 0) >= 0.7
                            ? 'bg-green-600'
                            : Number(log.validation_score || 0) >= 0.3
                            ? 'bg-yellow-500'
                            : 'bg-red-600'
                        }`}
                        aria-label={`Validation score: ${Number(log.validation_score || 0).toFixed(2)}`}
                        role="status"
                      >
                        {Number(log.validation_score || 0).toFixed(2)}
                      </span>
                    </TableCell>
                    <TableCell className="text-gray-600" role="cell">
                      <span aria-label={`Entity type: ${log.entity_info?.entityType || 'Not available'}`}>
                        {log.entity_info?.entityType || 'N/A'}
                      </span>
                    </TableCell>
                    <TableCell role="cell">
                      {log.external_verification_required ? (
                        <span 
                          className="text-red-600 font-semibold"
                          aria-label="External verification required"
                          role="status"
                        >
                          Required
                        </span>
                      ) : (
                        <span 
                          className="text-green-700 font-semibold"
                          aria-label="External verification not needed"
                          role="status"
                        >
                          Not Needed
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-gray-600" role="cell">
                      <span aria-label={`Notes: ${log.notes || 'No notes'}`}>
                        {log.notes}
                      </span>
                    </TableCell>
                    <TableCell className="flex gap-2" role="cell">
                      <Button 
                        size="sm" 
                        onClick={() => approveLog && approveLog(log.id)} 
                        className="bg-black text-white hover:bg-amber-600 hover:text-black"
                        aria-label={`Approve log entry ${index + 1}`}
                        aria-describedby="approve-help"
                        disabled={!approveLog}
                      >
                        <Check className="h-4 w-4 mr-1" aria-hidden="true" /> 
                        Approve
                      </Button>
                      <span id="approve-help" className="sr-only">
                        Approve this log entry as valid
                      </span>
                      
                      <Button 
                        size="sm" 
                        variant="destructive" 
                        onClick={() => rejectLog && rejectLog(log.id)}
                        aria-label={`Reject log entry ${index + 1}`}
                        aria-describedby="reject-help"
                        disabled={!rejectLog}
                      >
                        <X className="h-4 w-4 mr-1" aria-hidden="true" /> 
                        Reject
                      </Button>
                      <span id="reject-help" className="sr-only">
                        Reject this log entry as invalid
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onDelete && setDialogState({ open: true, targetId: log.id })}
                        aria-label={`Delete log entry ${index + 1}`}
                        aria-describedby="delete-help"
                        disabled={!onDelete}
                        className="border-gray-300 text-gray-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4 mr-1" aria-hidden="true" />
                        Delete
                      </Button>
                      <span id="delete-help" className="sr-only">
                        Permanently delete this log entry
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
      <ConfirmDialog
        open={dialogState.open}
        title="Delete Log"
        description="Delete this log permanently? This cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onCancel={() => setDialogState({ open: false, targetId: null })}
        onConfirm={async () => {
          if (onDelete && dialogState.targetId) {
            await onDelete(dialogState.targetId)
          }
          setDialogState({ open: false, targetId: null })
        }}
      />
    </Card>
  )
}




