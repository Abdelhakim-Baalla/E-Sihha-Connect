import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Calendar, FileText, Pill, Activity } from 'lucide-react';

export default function PatientDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-text-primary">Tableau de bord Patient</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Calendar className="text-primary" size={24} />
            </div>
            <div>
              <p className="text-text-muted text-sm">Rendez-vous</p>
              <p className="text-2xl font-bold text-text-primary">3</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="p-3 bg-success/10 rounded-lg">
              <FileText className="text-success" size={24} />
            </div>
            <div>
              <p className="text-text-muted text-sm">Consultations</p>
              <p className="text-2xl font-bold text-text-primary">12</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="p-3 bg-warning/10 rounded-lg">
              <Pill className="text-warning" size={24} />
            </div>
            <div>
              <p className="text-text-muted text-sm">Ordonnances</p>
              <p className="text-2xl font-bold text-text-primary">5</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="p-3 bg-secondary/10 rounded-lg">
              <Activity className="text-secondary" size={24} />
            </div>
            <div>
              <p className="text-text-muted text-sm">Résultats labo</p>
              <p className="text-2xl font-bold text-text-primary">8</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Prochains rendez-vous</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-bg-secondary rounded-lg">
                <div>
                  <p className="font-medium text-text-primary">Dr. Martin</p>
                  <p className="text-sm text-text-muted">Consultation générale</p>
                </div>
                <span className="text-sm text-primary">15/01/2024</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-bg-secondary rounded-lg">
                <div>
                  <p className="font-medium text-text-primary">Dr. Dubois</p>
                  <p className="text-sm text-text-muted">Cardiologie</p>
                </div>
                <span className="text-sm text-primary">20/01/2024</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ordonnances actives</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-bg-secondary rounded-lg">
                <p className="font-medium text-text-primary">Paracétamol 500mg</p>
                <p className="text-sm text-text-muted">3x par jour - 7 jours</p>
              </div>
              <div className="p-3 bg-bg-secondary rounded-lg">
                <p className="font-medium text-text-primary">Amoxicilline 1g</p>
                <p className="text-sm text-text-muted">2x par jour - 5 jours</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
