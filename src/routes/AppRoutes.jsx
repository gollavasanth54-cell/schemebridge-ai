import { Routes, Route } from 'react-router-dom'
import AppLayout from '../components/layout/AppLayout'
import ProtectedRoute from './ProtectedRoute'
import AdminRoute from '../components/admin/AdminRoute'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Dashboard from '../pages/Dashboard'
import Profile from '../pages/Profile'
import Categories from '../pages/Categories'
import Schemes from '../pages/Schemes'
import SchemeDetails from '../pages/SchemeDetails'
import CheckEligibility from '../pages/CheckEligibility'
import Assistant from '../pages/Assistant'
import Applications from '../pages/Applications'
import ApplicationDetails from '../pages/ApplicationDetails'
import Notifications from '../pages/Notifications'
import NotFound from '../pages/NotFound'
import AdminDashboard from '../pages/admin/AdminDashboard'
import AdminSchemes from '../pages/admin/AdminSchemes'
import AdminSchemeForm from '../pages/admin/AdminSchemeForm'
import AdminCategories from '../pages/admin/AdminCategories'
import AdminStates from '../pages/admin/AdminStates'

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/schemes" element={<Schemes />} />
        <Route path="/schemes/:id" element={<SchemeDetails />} />
        <Route path="/check-eligibility" element={<CheckEligibility />} />
        <Route path="/assistant" element={<Assistant />} />

        {/* Protected (users) */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/applications" element={<ProtectedRoute><Applications /></ProtectedRoute>} />
        <Route path="/applications/:id" element={<ProtectedRoute><ApplicationDetails /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />

        {/* Admin only */}
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/schemes" element={<AdminRoute><AdminSchemes /></AdminRoute>} />
        <Route path="/admin/schemes/new" element={<AdminRoute><AdminSchemeForm /></AdminRoute>} />
        <Route path="/admin/schemes/:id/edit" element={<AdminRoute><AdminSchemeForm /></AdminRoute>} />
        <Route path="/admin/categories" element={<AdminRoute><AdminCategories /></AdminRoute>} />
        <Route path="/admin/states" element={<AdminRoute><AdminStates /></AdminRoute>} />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}