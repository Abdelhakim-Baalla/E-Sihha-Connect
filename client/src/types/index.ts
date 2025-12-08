export type UserRole = 'admin' | 'medecin' | 'infirmier' | 'patient' | 'pharmacien' | 'responsable-labo' | 'secretaire';

export interface User {
  _id: string;
  nom: string;
  prenom: string;
  email: string;
  role: UserRole;
  telephone?: string;
  specialite?: string;
  actif: boolean;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  utilisateur: User;
}
