import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function Contact() {
  return (
    <div className="mx-auto max-w-4xl p-6">
      <h1 className="mb-4 text-3xl font-bold">Contact</h1>
      <form className="grid gap-4 md:max-w-lg">
        <Input placeholder="Your name" />
        <Input placeholder="Your email" type="email" />
        <textarea
          placeholder="Message"
          className="min-h-28 rounded-md border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
        />
        <Button>Send</Button>
      </form>
    </div>
  )
}


