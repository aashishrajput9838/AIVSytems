import { Input } from '@/shared/components/ui/input'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent } from '@/shared/components/ui/card'
import { Mail, Phone, MapPin, Send } from 'lucide-react'
<<<<<<< HEAD
import { useState } from 'react'
import emailjs from '@emailjs/browser'
=======
>>>>>>> 7e95df96e768249ff74e07574266072025e4fd20

function ContactCard({ icon: Icon, title, description }) {
  const IconComp = Icon
  return (
    <Card className="group relative overflow-hidden rounded-2xl border-0 bg-white/95 backdrop-blur-sm shadow-xl transition-all hover:-translate-y-1 hover:shadow-2xl">
      <CardContent className="p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
            <IconComp className="size-5" />
          </div>
          <h3 className="text-lg font-semibold text-black">{title}</h3>
        </div>
        <p className="text-sm text-gray-600">{description}</p>
      </CardContent>
    </Card>
  )
}

export default function Contact() {
<<<<<<< HEAD
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus(null)
    
    try {
      // EmailJS configuration - you'll need to set these in your .env file
      const serviceID = import.meta.env.VITE_EMAILJS_SERVICE_ID
      const templateID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      
      // Check if EmailJS credentials are configured
      if (!serviceID || !templateID || !publicKey) {
        throw new Error('EmailJS credentials not configured')
      }
      
      // Prepare template parameters
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        message: formData.message,
        to_email: 'aspirinexar@gmail.com',
        reply_to: formData.email
      }
      
      // Send email using EmailJS
      await emailjs.send(serviceID, templateID, templateParams, publicKey)
      
      setSubmitStatus('success')
      setFormData({ name: '', email: '', message: '' })
    } catch (error) {
      console.error('Email error:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

=======
>>>>>>> 7e95df96e768249ff74e07574266072025e4fd20
  return (
    <div className="relative min-h-dvh w-full overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-amber-900 to-amber-100">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(251,191,36,0.3),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(251,191,36,0.2),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(0,0,0,0.8),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(0,0,0,0.6),transparent_50%)]"></div>
      </div>

      <div className="relative z-10 mx-auto w-[95%] max-w-6xl mt-8 mb-8 bg-white rounded-lg shadow-2xl">
        <main className="p-8">
          <section className="relative flex flex-col items-center gap-6 py-12 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs text-amber-700">
              Get In Touch
            </div>
            <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight text-black sm:text-5xl md:text-6xl">
<<<<<<< HEAD
              Contact Me
            </h1>
            <p className="max-w-2xl text-balance text-base text-gray-600 sm:text-lg">
              Have questions about our AI validation system? I'd love to hear from you.
=======
              Contact Us
            </h1>
            <p className="max-w-2xl text-balance text-base text-gray-600 sm:text-lg">
              Have questions about our AI validation system? We'd love to hear from you.
>>>>>>> 7e95df96e768249ff74e07574266072025e4fd20
            </p>
          </section>

          <section className="space-y-8 py-8">
            <h2 className="text-center text-3xl font-bold text-black mb-8">Contact Information</h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <ContactCard
                icon={Mail}
                title="Email"
<<<<<<< HEAD
                description="aspirinexar@gmail.com"
=======
                description="support@aivalidationsystem.com"
>>>>>>> 7e95df96e768249ff74e07574266072025e4fd20
              />
              <ContactCard
                icon={Phone}
                title="Phone"
<<<<<<< HEAD
                description="+91 9319977285"
=======
                description="+1 (555) 123-4567"
>>>>>>> 7e95df96e768249ff74e07574266072025e4fd20
              />
              <ContactCard
                icon={MapPin}
                title="Location"
<<<<<<< HEAD
                description="Knowledge Park III, Greater Noida, Uttar Pradesh"
=======
                description="San Francisco, CA"
>>>>>>> 7e95df96e768249ff74e07574266072025e4fd20
              />
            </div>
          </section>

          <section className="space-y-8 py-8">
            <div className="text-center">
<<<<<<< HEAD
              <h2 className="text-3xl font-bold text-black mb-4">Send me a Message</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Fill out the form below and I'll get back to you as soon as possible.
=======
              <h2 className="text-3xl font-bold text-black mb-4">Send us a Message</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Fill out the form below and we'll get back to you as soon as possible.
>>>>>>> 7e95df96e768249ff74e07574266072025e4fd20
              </p>
            </div>
            
            <div className="max-w-2xl mx-auto">
              <Card className="group relative overflow-hidden rounded-2xl border-0 bg-white/95 backdrop-blur-sm shadow-xl">
                <CardContent className="p-6">
<<<<<<< HEAD
                  {submitStatus === 'success' && (
                    <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-md">
                      Thank you for your message! I'll get back to you soon.
                    </div>
                  )}
                  {submitStatus === 'error' && (
                    <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
                      There was an error sending your message. Please try again.
                    </div>
                  )}
                  <form onSubmit={handleSubmit} className="grid gap-4">
=======
                  <form className="grid gap-4">
>>>>>>> 7e95df96e768249ff74e07574266072025e4fd20
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium mb-2 text-black">Name</label>
                        <Input 
<<<<<<< HEAD
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Your name" 
                          className="bg-white border border-gray-200"
                          required
=======
                          placeholder="Your name" 
                          className="bg-white border border-gray-200"
>>>>>>> 7e95df96e768249ff74e07574266072025e4fd20
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2 text-black">Email</label>
                        <Input 
<<<<<<< HEAD
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="Your email" 
                          type="email" 
                          className="bg-white border border-gray-200"
                          required
=======
                          placeholder="Your email" 
                          type="email" 
                          className="bg-white border border-gray-200"
>>>>>>> 7e95df96e768249ff74e07574266072025e4fd20
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-black">Message</label>
                      <textarea
<<<<<<< HEAD
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Your message"
                        className="min-h-28 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 disabled:cursor-not-allowed disabled:opacity-50"
                        required
                      />
                    </div>
                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="bg-black text-white hover:bg-amber-600 hover:text-black"
                    >
                      {isSubmitting ? (
                        <span>Sending...</span>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Send Message
                        </>
                      )}
=======
                        placeholder="Your message"
                        className="min-h-28 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>
                    <Button className="bg-black text-white hover:bg-amber-600 hover:text-black">
                      <Send className="h-4 w-4 mr-2" />
                      Send Message
>>>>>>> 7e95df96e768249ff74e07574266072025e4fd20
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
<<<<<<< HEAD
}
=======
}
>>>>>>> 7e95df96e768249ff74e07574266072025e4fd20
