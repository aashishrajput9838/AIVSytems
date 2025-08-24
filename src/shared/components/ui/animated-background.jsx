import React, { useEffect, useRef } from 'react'

const AnimatedBackground = ({ 
  variant = "particles",
  className = "",
  children 
}) => {
  const canvasRef = useRef(null)
  const particlesRef = useRef([])
  const animationRef = useRef(null)

  useEffect(() => {
    if (variant === "particles" && canvasRef.current) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      let width = canvas.width = window.innerWidth
      let height = canvas.height = window.innerHeight

      // Particle class
      class Particle {
        constructor() {
          this.x = Math.random() * width
          this.y = Math.random() * height
          this.vx = (Math.random() - 0.5) * 0.5
          this.vy = (Math.random() - 0.5) * 0.5
          this.size = Math.random() * 2 + 1
          this.opacity = Math.random() * 0.5 + 0.2
        }

        update() {
          this.x += this.vx
          this.y += this.vy

          if (this.x < 0 || this.x > width) this.vx *= -1
          if (this.y < 0 || this.y > height) this.vy *= -1
        }

        draw() {
          ctx.save()
          ctx.globalAlpha = this.opacity
          ctx.fillStyle = '#f59e0b'
          ctx.beginPath()
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
          ctx.fill()
          ctx.restore()
        }
      }

      // Create particles
      particlesRef.current = Array.from({ length: 50 }, () => new Particle())

      // Animation loop
      const animate = () => {
        ctx.clearRect(0, 0, width, height)
        
        particlesRef.current.forEach(particle => {
          particle.update()
          particle.draw()
        })

        // Draw connections
        particlesRef.current.forEach((particle, i) => {
          particlesRef.current.slice(i + 1).forEach(otherParticle => {
            const dx = particle.x - otherParticle.x
            const dy = particle.y - otherParticle.y
            const distance = Math.sqrt(dx * dx + dy * dy)

            if (distance < 100) {
              ctx.save()
              ctx.globalAlpha = 0.1 * (1 - distance / 100)
              ctx.strokeStyle = '#f59e0b'
              ctx.lineWidth = 1
              ctx.beginPath()
              ctx.moveTo(particle.x, particle.y)
              ctx.lineTo(otherParticle.x, otherParticle.y)
              ctx.stroke()
              ctx.restore()
            }
          })
        })

        animationRef.current = requestAnimationFrame(animate)
      }

      animate()

      // Handle resize
      const handleResize = () => {
        width = canvas.width = window.innerWidth
        height = canvas.height = window.innerHeight
      }

      window.addEventListener('resize', handleResize)

      return () => {
        window.removeEventListener('resize', handleResize)
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current)
        }
      }
    }
  }, [variant])

  if (variant === "particles") {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
        />
        <div className="relative z-10">
          {children}
        </div>
      </div>
    )
  }

  if (variant === "gradient") {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-100 to-yellow-50">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(251,191,36,0.3),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(251,191,36,0.2),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(0,0,0,0.1),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(0,0,0,0.1),transparent_50%)]" />
        </div>
        <div className="relative z-10">
          {children}
        </div>
      </div>
    )
  }

  if (variant === "mesh") {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-amber-900 to-amber-100">
                      <div className="absolute inset-0 opacity-20">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23f59e0b%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]" />
            </div>
        </div>
        <div className="relative z-10">
          {children}
        </div>
      </div>
    )
  }

  return (
    <div className={className}>
      {children}
    </div>
  )
}

export default AnimatedBackground
