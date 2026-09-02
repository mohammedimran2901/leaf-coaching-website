import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-forest-deep text-sand">
      <div className="container-site py-16 md:py-20">
        <div className="grid md:grid-cols-12 gap-10">
          <div className="md:col-span-5">
            <div className="flex items-center gap-2.5 mb-5">
              <span className="w-8 h-8 rounded-full bg-sand flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-4 h-4 text-forest" fill="currentColor">
                  <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z" />
                </svg>
              </span>
              <span className="font-serif text-xl">Leaf Coaching</span>
            </div>
            <p className="text-sand/60 leading-relaxed max-w-sm text-[15px]">
              A Community Interest Company providing culturally sensitive
              coaching, advocacy and support — helping you improve your
              relationship with yourself and others.
            </p>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-xs uppercase tracking-widest2 text-sand/40 mb-5 font-sans">
              Explore
            </h4>
            <ul className="space-y-3 text-[15px]">
              <li><Link href="/about" className="text-sand/75 hover:text-sand transition-colors">About</Link></li>
              <li><Link href="/services" className="text-sand/75 hover:text-sand transition-colors">Services</Link></li>
              <li><Link href="/contact" className="text-sand/75 hover:text-sand transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-xs uppercase tracking-widest2 text-sand/40 mb-5 font-sans">
              Connect
            </h4>
            <ul className="space-y-3 text-[15px]">
              <li>
                <a
                  href="https://instagram.com/leaf_coaching"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sand/75 hover:text-sand transition-colors"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a href="mailto:hello@leafcoaching.com" className="text-sand/75 hover:text-sand transition-colors">
                  hello@leafcoaching.com
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <h4 className="text-xs uppercase tracking-widest2 text-sand/40 mb-5 font-sans">
              Legal
            </h4>
            <ul className="space-y-3 text-[15px]">
              <li><span className="text-sand/40">Privacy Policy</span></li>
              <li><span className="text-sand/40">Terms of Service</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-sand/10 mt-14 pt-8 flex flex-col md:flex-row justify-between gap-3 text-sm text-sand/40">
          <p>© {new Date().getFullYear()} Leaf Coaching CIC. All rights reserved.</p>
          <p>UK-based · Community Interest Company</p>
        </div>
      </div>
    </footer>
  )
}