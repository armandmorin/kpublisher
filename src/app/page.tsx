import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// Define some basic styles for the page
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    minHeight: '100vh',
  },
  header: {
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #e5e7eb',
  },
  headerContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#111827',
  },
  navButtons: {
    display: 'flex',
    gap: '1rem',
  },
  heroSection: {
    background: 'linear-gradient(to right, #2563eb, #4f46e5)',
    padding: '5rem 0',
  },
  heroContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1rem',
  },
  heroContent: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '2rem',
  },
  heroTitle: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: '1.5rem',
    textAlign: 'center' as const,
  },
  heroText: {
    fontSize: '1.25rem',
    color: '#e0e7ff',
    marginBottom: '2rem',
    textAlign: 'center' as const,
    maxWidth: '800px',
  },
  buttonGroup: {
    display: 'flex',
    gap: '1rem',
  },
  sectionTitle: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: '1rem',
    textAlign: 'center' as const,
  },
  sectionText: {
    fontSize: '1.125rem',
    color: '#4b5563',
    marginBottom: '2rem',
    textAlign: 'center' as const,
    maxWidth: '800px',
    margin: '0 auto',
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '2rem',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1rem',
  },
  featureCard: {
    backgroundColor: '#ffffff',
    borderRadius: '0.5rem',
    padding: '1.5rem',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  },
  featureTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '0.5rem',
  },
  featureText: {
    fontSize: '1rem',
    color: '#4b5563',
  },
  footer: {
    backgroundColor: '#111827',
    color: '#ffffff',
    padding: '3rem 0',
    marginTop: 'auto',
  },
  footerContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1rem',
  },
  footerTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
  },
  footerText: {
    color: '#9ca3af',
    maxWidth: '500px',
  },
  footerGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '2rem',
    marginTop: '2rem',
  },
  footerHeading: {
    fontSize: '1.125rem',
    fontWeight: '600',
    marginBottom: '1rem',
  },
  footerLink: {
    color: '#9ca3af',
    textDecoration: 'none',
    ':hover': {
      color: '#ffffff',
    },
  },
  footerBottom: {
    borderTop: '1px solid #374151',
    marginTop: '3rem',
    paddingTop: '2rem',
    textAlign: 'center' as const,
    color: '#9ca3af',
  },
};

export default function LandingPage() {
  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContainer}>
          <div>
            <h1 style={styles.logo}>KPublisher</h1>
          </div>
          <div style={styles.navButtons}>
            <Link href="/auth/login">
              <Button variant="outline">Log In</Button>
            </Link>
            <Link href="/auth/signup">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section style={styles.heroSection}>
        <div style={styles.heroContainer}>
          <div style={styles.heroContent}>
            <div style={{ textAlign: 'center', maxWidth: '800px' }}>
              <h2 style={styles.heroTitle}>
                Create Books with AI
              </h2>
              <p style={styles.heroText}>
                KPublisher helps you create professional books and covers using
                AI. Write, edit, and publish your content with ease.
              </p>
              <div style={styles.buttonGroup}>
                <Link href="/auth/signup">
                  <Button size="lg" style={{ backgroundColor: 'white', color: '#2563eb' }}>
                    Get Started
                  </Button>
                </Link>
                <Link href="#features">
                  <Button size="lg" variant="outline" style={{ borderColor: 'white', color: 'white' }}>
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
            <div style={{ width: '100%', maxWidth: '500px', margin: '0 auto', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '-1rem', left: '-1rem', width: '100%', height: '100%', backgroundColor: '#3b82f6', borderRadius: '0.5rem' }}></div>
              <div style={{ position: 'absolute', bottom: '-1rem', right: '-1rem', width: '100%', height: '100%', backgroundColor: '#4f46e5', borderRadius: '0.5rem' }}></div>
              <div style={{ position: 'relative', backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' }}>
                <div style={{ aspectRatio: '3/4', backgroundColor: '#f3f4f6', borderRadius: '0.375rem', marginBottom: '1rem' }}></div>
                <div style={{ height: '1.5rem', backgroundColor: '#e5e7eb', borderRadius: '0.375rem', width: '75%', marginBottom: '0.5rem' }}></div>
                <div style={{ height: '1rem', backgroundColor: '#e5e7eb', borderRadius: '0.375rem', width: '50%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" style={{ padding: '5rem 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={styles.sectionTitle}>
              Powerful Features for Book Creation
            </h2>
            <p style={styles.sectionText}>
              Everything you need to create, edit, and publish your books
            </p>
          </div>

          <div style={styles.featuresGrid}>
            {/* Feature 1 */}
            <div style={styles.featureCard}>
              <div style={{ width: '3rem', height: '3rem', backgroundColor: '#dbeafe', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 8V4H8"></path>
                  <rect width="16" height="12" x="4" y="8" rx="2"></rect>
                  <path d="M2 14h2"></path>
                  <path d="M20 14h2"></path>
                  <path d="M15 13v2"></path>
                  <path d="M9 13v2"></path>
                </svg>
              </div>
              <h3 style={styles.featureTitle}>
                AI-Powered Content Creation
              </h3>
              <p style={styles.featureText}>
                Use OpenAI's powerful assistants to generate book content, outlines,
                chapters, and more with simple prompts.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-blue-600"
                >
                  <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
                  <circle cx="9" cy="9" r="2"></circle>
                  <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                AI Book Cover Generation
              </h3>
              <p className="text-gray-600">
                Create stunning book covers with AI image generation. Customize
                your covers with simple text prompts.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-blue-600"
                >
                  <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Rich Text Editor
              </h3>
              <p className="text-gray-600">
                Edit your content with a powerful WYSIWYG editor. Format text,
                add images, and more with ease.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-blue-600"
                >
                  <path d="M12 2H2v10h10V2Z"></path>
                  <path d="M12 12H2v10h10V12Z"></path>
                  <path d="M22 2h-10v20h10V2Z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Book Organization
              </h3>
              <p className="text-gray-600">
                Organize your books, chapters, and covers in one place. Easily
                manage your content library.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-blue-600"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" x2="12" y1="15" y2="3"></line>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Export Options
              </h3>
              <p className="text-gray-600">
                Export your books as text or Word documents. Save your work in
                multiple formats.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-blue-600"
                >
                  <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Customization Options
              </h3>
              <p className="text-gray-600">
                Customize your book creation experience with various settings
                and preferences.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ backgroundColor: '#f3f4f6', padding: '5rem 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem', textAlign: 'center' }}>
          <h2 style={styles.sectionTitle}>
            Ready to Start Creating?
          </h2>
          <p style={{ fontSize: '1.25rem', color: '#4b5563', maxWidth: '800px', margin: '0 auto 2rem auto' }}>
            Join KPublisher today and start creating amazing books with AI.
          </p>
          <Link href="/auth/signup">
            <Button size="lg" style={{ backgroundColor: '#2563eb', color: 'white' }}>
              Sign Up Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerContainer}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', '@media (min-width: 768px)': { flexDirection: 'row', justifyContent: 'space-between' } }}>
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={styles.footerTitle}>KPublisher</h3>
              <p style={styles.footerText}>
                AI-powered book creation platform for writers, authors, and
                content creators.
              </p>
            </div>
            <div style={styles.footerGrid}>
              <div>
                <h4 style={styles.footerHeading}>Product</h4>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <li>
                    <a href="#features" style={{ color: '#9ca3af', textDecoration: 'none' }}>
                      Features
                    </a>
                  </li>
                  <li>
                    <a href="#" style={{ color: '#9ca3af', textDecoration: 'none' }}>
                      Pricing
                    </a>
                  </li>
                  <li>
                    <a href="#" style={{ color: '#9ca3af', textDecoration: 'none' }}>
                      FAQ
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 style={styles.footerHeading}>Company</h4>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <li>
                    <a href="#" style={{ color: '#9ca3af', textDecoration: 'none' }}>
                      About
                    </a>
                  </li>
                  <li>
                    <a href="#" style={{ color: '#9ca3af', textDecoration: 'none' }}>
                      Blog
                    </a>
                  </li>
                  <li>
                    <a href="#" style={{ color: '#9ca3af', textDecoration: 'none' }}>
                      Contact
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 style={styles.footerHeading}>Legal</h4>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <li>
                    <a href="#" style={{ color: '#9ca3af', textDecoration: 'none' }}>
                      Terms
                    </a>
                  </li>
                  <li>
                    <a href="#" style={{ color: '#9ca3af', textDecoration: 'none' }}>
                      Privacy
                    </a>
                  </li>
                  <li>
                    <a href="#" style={{ color: '#9ca3af', textDecoration: 'none' }}>
                      Cookies
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div style={styles.footerBottom}>
            <p>&copy; {new Date().getFullYear()} KPublisher. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
