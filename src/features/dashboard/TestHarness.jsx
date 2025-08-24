import { Card, CardContent } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table'
import { Download } from 'lucide-react'
import { exportResultsToCsv } from './utils'

export default function TestHarness({ sampleTests = [], runAllTests, isRunningTests, testResults }) {
  return (
    <Card className="group relative overflow-hidden rounded-2xl border-0 bg-white/95 backdrop-blur-sm shadow-xl">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-black">Validation Test Harness</h2>
          <div className="flex gap-2">
            <Button onClick={runAllTests} disabled={isRunningTests} className="bg-black text-white hover:bg-amber-600 hover:text-black">
              {isRunningTests ? 'Running…' : 'Run Test Suite'}
            </Button>
            <Button onClick={() => exportResultsToCsv(testResults)} disabled={!testResults.length} variant="outline" className="border-gray-300 text-gray-700 hover:bg-amber-50">
              <Download className="h-4 w-4 mr-2" /> Export CSV
            </Button>
          </div>
        </div>
        <div className="text-sm text-gray-600 mb-3">Runs a set of predefined user queries and model responses against the validator to check thresholds.</div>
        <Table>
          <TableHeader>
            <TableRow className="border-gray-200">
              <TableHead className="text-black">Case</TableHead>
              <TableHead className="text-black">User Query</TableHead>
              <TableHead className="text-black">Model Response</TableHead>
              <TableHead className="text-black">Expected</TableHead>
              <TableHead className="text-black">Score</TableHead>
              <TableHead className="text-black">Result</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(testResults.length ? testResults : sampleTests).map((r) => (
              <TableRow key={r.id} className="border-gray-100">
                <TableCell className="text-black">{r.title}</TableCell>
                <TableCell className="text-gray-700">{r.userQuery}</TableCell>
                <TableCell className="text-gray-700">{r.modelResponse}</TableCell>
                <TableCell className="text-gray-600">
                  {typeof r.expectedMinScore === 'number' ? `≥ ${r.expectedMinScore}` : ''}
                  {typeof r.expectedMaxScore === 'number' ? `${typeof r.expectedMinScore==='number' ? ' & ' : ''}≤ ${r.expectedMaxScore}` : ''}
                </TableCell>
                <TableCell className="text-black">{typeof r.score === 'number' ? r.score.toFixed(2) : '-'}</TableCell>
                <TableCell>
                  {typeof r.pass === 'boolean' ? (
                    <span className={`px-2 py-1 rounded-full text-white text-xs ${r.pass ? 'bg-green-600' : 'bg-red-600'}`}>
                      {r.pass ? 'PASS' : 'FAIL'}
                    </span>
                  ) : (
                    <span className="px-2 py-1 rounded-full text-white text-xs bg-gray-400">PENDING</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
