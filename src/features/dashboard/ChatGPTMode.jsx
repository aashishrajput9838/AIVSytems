import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Card, CardContent } from '@/shared/components/ui/card'

export default function ChatGPTMode({
  isCapturing,
  startCapturing,
  stopCapturing,
  currentQuestion,
  setCurrentQuestion,
  currentResponse,
  setCurrentResponse,
  isAsking,
  onAskModel,
  onCapture,
  chatHistory
}) {
  return (
    <section className="mb-8">
      <Card className="group relative overflow-hidden rounded-2xl border-0 bg-white/95 backdrop-blur-sm shadow-xl">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-black">ChatGPT Mode - Auto-Capture Conversations</h2>
            <div className="flex gap-2">
              {!isCapturing ? (
                <Button onClick={startCapturing} className="bg-black text-white hover:bg-amber-600 hover:text-black">
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
                  <label className="block text-sm font-medium mb-2 text-black">Your Question</label>
                  <Input
                    placeholder="Type your question here..."
                    value={currentQuestion}
                    onChange={(e) => setCurrentQuestion(e.target.value)}
                    className="bg-white border border-gray-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-black">AI Response</label>
                  <Input
                    placeholder="Will be auto-filled from model… (or edit)"
                    value={currentResponse}
                    onChange={(e) => setCurrentResponse(e.target.value)}
                    className="bg-white border border-gray-200"
                  />
                </div>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <Button 
                  onClick={onAskModel}
                  disabled={!currentQuestion.trim() || isAsking}
                  className="w-full bg-black text-white hover:bg-amber-600 hover:text-black"
                >
                  {isAsking ? 'Asking…' : 'Ask Model & Autofill Answer'}
                </Button>
                <Button 
                  onClick={onCapture}
                  disabled={!currentQuestion.trim() || !currentResponse.trim()}
                  className="w-full bg-black text-white hover:bg-amber-600 hover:text-black"
                >
                  Capture & Validate Conversation
                </Button>
              </div>
              <div className="text-sm text-gray-600">
                💡 <strong>How to use:</strong> Ask ChatGPT a question, copy the response, paste it here, and click "Capture & Validate". 
                The system will automatically validate and log everything!
              </div>
              <div className="text-sm text-amber-700 bg-amber-50 p-3 rounded-lg border border-amber-200">
                ⚠️ <strong>Duplicate Prevention:</strong> The system prevents adding identical logs within 1 minute to avoid spam.
              </div>
            </div>
          )}

          {chatHistory?.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-3 text-black">Captured Conversations</h3>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {chatHistory.map((chat, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-3 bg-white/70 backdrop-blur">
                    <div className="text-sm text-gray-500 mb-1">
                      {chat.timestamp.toLocaleTimeString()}
                    </div>
                    <div className="font-medium text-sm text-black">Q: {chat.question}</div>
                    <div className="text-sm mt-1 text-gray-600">A: {chat.response}</div>
                    <div className="mt-2">
                      <span className={`px-2 py-1 rounded-full text-white text-xs ${
                        chat.validation.validationScore >= 0.7
                          ? 'bg-green-600'
                          : chat.validation.validationScore >= 0.3
                          ? 'bg-yellow-500'
                          : 'bg-red-600'
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
    </section>
  )
}



