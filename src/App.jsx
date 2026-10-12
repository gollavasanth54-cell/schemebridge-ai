import { AuthProvider } from './context/AuthContext'
import { NotificationProvider } from './context/NotificationContext'
import { ApplicationsProvider } from './context/ApplicationsContext'
import { NotificationsProvider } from './context/NotificationsContext'
import { DataProvider } from './context/DataContext'
import AppRoutes from './routes/AppRoutes'

export default function App() {
  return (
    <NotificationProvider>
      <AuthProvider>
        <DataProvider>
          <ApplicationsProvider>
            <NotificationsProvider>
              <AppRoutes />
            </NotificationsProvider>
          </ApplicationsProvider>
        </DataProvider>
      </AuthProvider>
    </NotificationProvider>
  )
}