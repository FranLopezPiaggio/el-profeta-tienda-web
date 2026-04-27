import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Beer, LayoutDashboard, ShoppingCart, BarChart3, LogOut } from 'lucide-react'
import Link from 'next/link'

export default async function CMSLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          } catch {
            // Called from Server Component - can be ignored
          }
        },
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/cms/login')
  }

  // Get user info
  const user = session.user
  const userName = user.user_metadata?.name || user.email?.split('@')[0] || 'Admin'

  // Sign out function
  async function signOut() {
    'use server'
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) => {
                cookieStore.set(name, value, options)
              })
            } catch {
              // Ignore
            }
          },
        },
      }
    )
    await supabase.auth.signOut()
    redirect('/cms/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Beer className="w-8 h-8 text-gray-900" strokeWidth={1.5} />
            <div>
              <span className="font-playfair text-lg font-bold text-gray-900 block">
                El Profeta
              </span>
              <span className="text-xs text-gray-500">Admin CMS</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            <li>
              <Link
                href="/cms"
                className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LayoutDashboard size={20} />
                <span className="font-medium">Dashboard</span>
              </Link>
            </li>
            <li>
              <Link
                href="/cms/orders"
                className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ShoppingCart size={20} />
                <span className="font-medium">Pedidos</span>
              </Link>
            </li>
            <li>
              <Link
                href="/cms/reports"
                className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <BarChart3 size={20} />
                <span className="font-medium">Reportes</span>
              </Link>
            </li>
          </ul>
        </nav>

        {/* User section */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-gray-600 font-medium">
                {userName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {userName}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user.email}
              </p>
            </div>
          </div>
          
          <form action={signOut}>
            <button
              type="submit"
              className="w-full flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors text-sm"
            >
              <LogOut size={16} />
              Cerrar sesión
            </button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}