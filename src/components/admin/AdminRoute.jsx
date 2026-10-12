import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Loader from '../common/Loader'
import Card from '../common/Card'
import Button from '../common/Button'
import { Link } from 'react-router-dom'

export default function AdminRoute({ children }) {
  const { user, isAdmin, loading } = useAuth()

  if (loading) return <Loader label="Checking access…" />

  if (!user) return <Navigate to="/login" replace />

  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-lg py-10">
        <Card className="p-8 text-center">
          <p className="text-4xl">🚫</p>
          <h1 className="mt-3 text-xl font-bold text-slate-900">Access denied</h1>
          <p className="mt-2 text-sm text-slate-500">
            This area is for administrators only.
          </p>
          <Link to="/" className="mt-6 inline-block">
            <Button>Back to Home</Button>
          </Link>
        </Card>
      </div>
    )
  }

  return children
}