import { Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { 
  LayoutDashboard, Users, Calendar, FileText, 
  Pill, FlaskConical, LogOut, Menu, X 
} from 'lucide-react';
import { useState } from 'react';

export default function MainLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = {
    admin: [
      { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
      { icon: Users, label: 'Utilisateurs', path: '/admin/users' },
      { icon: Users, label: 'Patients', path: '/admin/patients' },
      { icon: Calendar, label: 'Rendez-vous', path: '/admin/appointments' },
    ],
    medecin: [
      { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
      { icon: Users, label: 'Patients', path: '/medical/patients' },
      { icon: Calendar, label: 'Calendrier', path: '/medical/calendar' },
      { icon: FileText, label: 'Consultations', path: '/medical/consultations' },
      { icon: Pill, label: 'Prescriptions', path: '/medical/prescriptions' },
      { icon: FlaskConical, label: 'Laboratoire', path: '/medical/lab-orders' },
    ],
    patient: [
      { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
      { icon: Calendar, label: 'Rendez-vous', path: '/patient/appointments' },
      { icon: FileText, label: 'Dossier médical', path: '/patient/medical-records' },
      { icon: Pill, label: 'Ordonnances', path: '/patient/prescriptions' },
      { icon: FlaskConical, label: 'Résultats labo', path: '/patient/lab-results' },
    ],
  };

  const roleLabel: Record<string, string> = {
    admin: 'Administrateur',
    medecin: 'Médecin',
    patient: 'Patient',
    infirmier: 'Infirmier',
    pharmacien: 'Pharmacien',
    'responsable-labo': 'Laboratoire',
    secretaire: 'Secrétaire',
  };

  const currentMenu = menuItems[user?.role as keyof typeof menuItems] || menuItems.patient;

  return (
    <div className="min-h-screen bg-bg-primary flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gradient-card border-r border-border transition-all duration-300 flex flex-col`}>
        <div className="p-4 border-b border-border flex items-center justify-between">
          {sidebarOpen && <h1 className="text-xl font-bold text-primary">E-Sihha</h1>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-bg-hover rounded-lg">
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {currentMenu.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-bg-hover transition-all text-text-secondary hover:text-primary"
            >
              <item.icon size={20} />
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-border">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-danger/10 text-danger transition-all"
          >
            <LogOut size={20} />
            {sidebarOpen && <span>Déconnexion</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 bg-gradient-card border-b border-border px-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-text-primary">
            Bienvenue, {user?.prenom} {user?.nom}
          </h2>
          <div className="flex items-center gap-4">
            <span className="badge-primary">{roleLabel[user?.role || 'patient']}</span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
