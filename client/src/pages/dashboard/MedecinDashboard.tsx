import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Users, Calendar, FileText, Clock } from 'lucide-react';

export default function MedecinDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-text-primary">Tableau de bord Médecin</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Calendar className="text-primary" size={24} />
            </div>
            <div>
              <p className="text-text-muted text-sm">Aujourd'hui</p>
              <p className="text-2xl font-bold text-text-primary">8</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="p-3 bg-success/10 rounded-lg">
              <Users className="text-success" size={24} />
            </div>
            <div>
              <p className="text-text-muted text-sm">Patients</p>
              <p className="text-2xl font-bold text-text-primary">156</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="p-3 bg-warning/10 rounded-lg">
              <FileText className="text-warning" size={24} />
            </div>
            <div>
              <p className="text-text-muted text-sm">Consultations</p>
              <p className="text-2xl font-bold text-text-primary">342</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="p-3 bg-danger/10 rounded-lg">
              <Clock className="text-danger" size={24} />
            </div>
            <div>
              <p className="text-text-muted text-sm">En attente</p>
              <p className="text-2xl font-bold text-text-primary">3</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Rendez-vous du jour</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-bg-secondary rounded-lg">
                <div>
                  <p className="font-medium text-text-primary">Ahmed Benali</p>
                  <p className="text-sm text-text-muted">Consultation de suivi</p>
                </div>
                <span className="badge-success">09:00</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-bg-secondary rounded-lg">
                <div>
                  <p className="font-medium text-text-primary">Fatima Zahra</p>
                  <p className="text-sm text-text-muted">Première consultation</p>
                </div>
                <span className="badge-warning">10:30</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-bg-secondary rounded-lg">
                <div>
                  <p className="font-medium text-text-primary">Mohammed Alami</p>
                  <p className="text-sm text-text-muted">Contrôle post-opératoire</p>
                </div>
                <span className="badge-primary">14:00</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Patients récents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-bg-secondary rounded-lg">
                <p className="font-medium text-text-primary">Sara Idrissi</p>
                <p className="text-sm text-text-muted">Dernière visite: 10/01/2024</p>
              </div>
              <div className="p-3 bg-bg-secondary rounded-lg">
                <p className="font-medium text-text-primary">Youssef Tazi</p>
                <p className="text-sm text-text-muted">Dernière visite: 08/01/2024</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
