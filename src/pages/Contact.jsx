import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Mail, Phone, MapPin, Send } from 'lucide-react'

function ContactCard({ icon: Icon, title, description }) {
  return (
    <Card className="group relative overflow-hidden rounded-2xl border-0 bg-white/95 backdrop-blur-sm shadow-xl transition-all hover:-translate-y-1 hover:shadow-2xl">
      <CardContent className="p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
            <Icon className="size-5" />
          </div>
          <h3 className="text-lg font-semibold text-black">{title}</h3>
        </div>
        <p className="text-sm text-gray-600">{description}</p>
      </CardContent>
    </Card>
  )
}

export default function Contact() {
  return (
    <div className="relative min-h-dvh w-full overflow-hidden">
      {/* Dynamic Background (same as Home) */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-amber-900 to-amber-100">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(251,191,36,0.3),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(251,191,36,0.2),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(0,0,0,0.8),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(0,0,0,0.6),transparent_50%)]"></div>
      </div>

      {/* Main White Content Area */}
      <div className="relative z-10 mx-auto mt-8 mb-8 w-[95%] max-w-6xl bg-white rounded-lg shadow-2xl">
        <main className="p-8">
          {/* Hero */}
          <section className="relative flex flex-col items-center gap-6 py-12 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs text-amber-700">
              Get In Touch
            </div>
            <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight text-black sm:text-5xl md:text-6xl">
              Contact Us
            </h1>
            <p className="max-w-2xl text-balance text-base text-gray-600 sm:text-lg">
              Have questions about our AI validation system? We'd love to hear from you.
            </p>
          </section>

          {/* Contact Methods */}
          <section className="space-y-8 py-8">
            <h2 className="text-center text-3xl font-bold text-black mb-8">Contact Information</h2>
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
          <section className="space-y-8 py-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-black mb-4">Send us a Message</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Fill out the form below and we'll get back to you as soon as possible.
              </p>
            </div>
            
            <div className="max-w-2xl mx-auto">
              <Card className="group relative overflow-hidden rounded-2xl border-0 bg-white/95 backdrop-blur-sm shadow-xl">
                <CardContent className="p-6">
                  <form className="grid gap-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium mb-2 text-black">Name</label>
                        <Input 
                          placeholder="Your name" 
                          className="bg-white border border-gray-200"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2 text-black">Email</label>
                        <Input 
                          placeholder="Your email" 
                          type="email" 
                          className="bg-white border border-gray-200"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-black">Message</label>
        <textarea
                        placeholder="Your message"
                        className="min-h-28 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>
                    <Button className="bg-black text-white hover:bg-amber-600 hover:text-black">
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
    </div>
  )
}


