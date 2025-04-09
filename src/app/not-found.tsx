import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '0 1rem', textAlign: 'center' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>404 - Page Not Found</h1>
      <p style={{ fontSize: '1.125rem', marginBottom: '1.5rem' }}>The page you are looking for does not exist.</p>
      <Link
        href="/"
        style={{ padding: '0.5rem 1rem', backgroundColor: '#2563eb', color: 'white', borderRadius: '0.25rem', textDecoration: 'none' }}
      >
        Return to Home
      </Link>
    </div>
  );
}
