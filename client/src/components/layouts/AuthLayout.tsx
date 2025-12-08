import { Outlet } from 'react-router-dom';
import { Activity } from 'lucide-react';

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-primary items-center justify-center p-12">
        <div className="max-w-md text-center">
          <Activity className="w-20 h-20 mx-auto mb-6 text-white" />
          <h1 className="text-4xl font-bold text-white mb-4">E-Sihha Connect</h1>
          <p className="text-white/90 text-lg">
            Système de gestion médicale moderne
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8 bg-bg-primary">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
