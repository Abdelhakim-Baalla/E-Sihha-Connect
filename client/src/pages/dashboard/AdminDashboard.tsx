import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Users, Calendar, TrendingUp, Activity } from 'lucide-react';

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-text-primary">Tableau de bord Administrateur</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Users className="text-primary" size={24} />
            </div>
            <div>
              <p className="text-text-muted text-sm">Utilisateurs</p>
              <p className="text-2xl font-bold text-text-primary">245</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="p-3 bg-success/10 rounded-lg">
              <Calendar className="text-success" size={24} />
            </div>
            <div>
              <p className="text-text-muted text-sm">RDV ce mois</p>
              <p className="text-2xl font-bold text-text-primary">1,234</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="p-3 bg-warning/10 rounded-lg">
              <TrendingUp className="text-warning" size={24} />
            </div>
            <div>
              <p className="text-text-muted text-sm">Revenus</p>
              <p className="text-2xl font-bold text-text-primary">45K</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="p-3 bg-secondary/10 rounded-lg">
              <Activity className="text-secondary" size={24} />
            </div>
            <div>
              <p className="text-text-muted text-sm">Taux occupation</p>
              <p className="text-2xl font-bold text-text-primary">87%</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Activité récente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-bg-secondary rounded-lg">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-text-primary">Nouveau patient inscrit</p>
                  <p className="text-xs text-text-muted">Il y a 5 minutes</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-bg-secondary rounded-lg">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-text-primary">RDV confirmé</p>
                  <p className="text-xs text-text-muted">Il y a 12 minutes</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Statistiques médecins</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-bg-secondary rounded-lg">
                <span className="text-text-primary">Dr. Martin</span>
                <span className="badge-success">24 RDV</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-bg-secondary rounded-lg">
                <span className="text-text-primary">Dr. Dubois</span>
                <span className="badge-primary">18 RDV</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
