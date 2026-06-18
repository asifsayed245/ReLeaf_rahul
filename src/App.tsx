import { Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import MyStoryPage from './pages/MyStoryPage'
import HowIHelpPage from './pages/HowIHelpPage'
import BookPage from './pages/BookPage'
import StoriesPage from './pages/StoriesPage'
import BlogPage from './pages/BlogPage'
import BlogPostPage from './pages/BlogPostPage'
import ConditionPage from './pages/ConditionPage'
import SitemapPage from './pages/SitemapPage'
import ScrollToTop from './components/ScrollToTop'

// Admin CMS
import AdminLogin from './admin/pages/AdminLogin'
import AdminLayout from './admin/components/AdminLayout'
import DashboardPage from './admin/pages/DashboardPage'
import BlogManagerPage from './admin/pages/BlogManagerPage'
import ProfileEditorPage from './admin/pages/ProfileEditorPage'
import SEOMetricsPage from './admin/pages/SEOMetricsPage'
import ContactsPage from './admin/pages/ContactsPage'
import SettingsPage from './admin/pages/SettingsPage'

function App() {
  // Intersection Observer for fade-in sections
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.15 }
    )

    document.querySelectorAll('.fade-section').forEach((el) => {
      observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Public site */}
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="my-story" element={<MyStoryPage />} />
          <Route path="how-i-help" element={<HowIHelpPage />} />
          <Route path="book" element={<BookPage />} />
          <Route path="stories" element={<StoriesPage />} />
          <Route path="blog" element={<BlogPage />} />
          <Route path="blog/:slug" element={<BlogPostPage />} />
          <Route path="what-i-treat/:condition" element={<ConditionPage />} />
          <Route path="sitemap" element={<SitemapPage />} />
        </Route>

        {/* Admin CMS */}
        <Route path="admin" element={<AdminLogin />} />
        <Route path="admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="blogs" element={<BlogManagerPage />} />
          <Route path="profile" element={<ProfileEditorPage />} />
          <Route path="seo" element={<SEOMetricsPage />} />
          <Route path="contacts" element={<ContactsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
