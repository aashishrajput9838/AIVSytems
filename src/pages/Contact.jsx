import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Mail, Phone, MapPin, Send } from 'lucide-react'

function ContactCard({ icon: Icon, title, description }) {
  return (
    <Card className="group relative overflow-hidden rounded-2xl border bg-background/60 backdrop-blur shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
      <div className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-gradient-to-br from-indigo-500/20 to-fuchsia-500/20 blur-2xl" />
      <CardContent className="p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-500 transition-colors group-hover:bg-indigo-500/20">
            <Icon className="size-5" />
          </div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}

export default function Contact() {
  return (
    <div className="relative min-h-dvh w-full overflow-hidden bg-gradient-to-b from-indigo-950 via-slate-950 to-slate-950">
      <div className="pointer-events-none absolute -left-20 -top-20 size-[36rem] rounded-full bg-gradient-to-br from-indigo-500/30 to-fuchsia-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 size-[36rem] rounded-full bg-gradient-to-br from-fuchsia-500/20 to-indigo-500/20 blur-3xl" />
      
      <main className="mx-auto w-full max-w-6xl px-4 py-16">
        {/* Hero */}
        <section className="relative flex flex-col items-center gap-6 py-16 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs text-indigo-300">
            Get In Touch
          </div>
          <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
            Contact Us
          </h1>
          <p className="max-w-2xl text-balance text-base text-muted-foreground sm:text-lg">
            Have questions about our AI validation system? We'd love to hear from you.
          </p>
        </section>

        {/* Contact Methods */}
        <section className="space-y-8 py-12">
          <h2 className="text-center text-3xl font-bold text-white mb-8">Contact Information</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <ContactCard
              icon={Mail}
              title="Email"
              description="support@aivalidationsystem.com"
            />
            <ContactCard
              icon={Phone}
              title="Phone"
              description="+1 (555) 123-4567"
            />
            <ContactCard
              icon={MapPin}
              title="Location"
              description="San Francisco, CA"
            />
          </div>
        </section>

        {/* Contact Form */}
        <section className="space-y-8 py-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Send us a Message</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Fill out the form below and we'll get back to you as soon as possible.
            </p>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <Card className="group relative overflow-hidden rounded-2xl border bg-background/60 backdrop-blur shadow-sm">
              <div className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-gradient-to-br from-indigo-500/20 to-fuchsia-500/20 blur-2xl" />
              <CardContent className="p-6">
                <form className="grid gap-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-white">Name</label>
                      <Input 
                        placeholder="Your name" 
                        className="bg-background/60 backdrop-blur border-indigo-500/30"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-white">Email</label>
                      <Input 
                        placeholder="Your email" 
                        type="email" 
                        className="bg-background/60 backdrop-blur border-indigo-500/30"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-white">Message</label>
                    <textarea
                      placeholder="Your message"
                      className="min-h-28 w-full rounded-md border bg-background/60 backdrop-blur border-indigo-500/30 px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                  <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                    <Send className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  )
}


