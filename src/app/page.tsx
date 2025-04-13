import Link from 'next/link'

export default function Home() {
  return (
    <div className="text-center mt-10">
      <h1 className="text-3xl font-bold mb-4">Tuition Platform</h1>
      <div className="space-x-4">
        <Link href="/login" className="btn btn-primary">
          Login
        </Link>
        <Link href="/signup" className="btn btn-secondary">
          Sign Up
        </Link>
      </div>
    </div>
  )
}