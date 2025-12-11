import { useAuthStore } from '@/store/authStore';
import PatientDashboard from './PatientDashboard';
import MedecinDashboard from './MedecinDashboard';
import AdminDashboard from './AdminDashboard';

export default function Dashboard() {
  const user = useAuthStore((state) => state.user);

  if (!user) return null;

  switch (user.role) {
    case 'admin':
      return <AdminDashboard />;
    case 'medecin':
      return <MedecinDashboard />;
    case 'patient':
      return <PatientDashboard />;
    default:
      return <PatientDashboard />;
  }
}
