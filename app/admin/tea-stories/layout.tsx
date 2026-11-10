import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import AdminHeader from '../components/AdminHeader'
import { isAdminAuthenticated } from '@/lib/admin-auth'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Tea Stories admin | Leaf Coaching',
  robots: { index: false, follow: false },
}

export default function AdminSectionLayout({
  children,
}: {
  children: React.ReactNode
}) {
  if (!isAdminAuthenticated()) redirect('/admin/login')

  return (
    <div className="min-h-screen bg-[#F3EEE4]">
      <AdminHeader />
      <main className="container-site py-8 md:py-12">{children}</main>
    </div>
  )
}
