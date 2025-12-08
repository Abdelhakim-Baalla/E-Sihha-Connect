import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import api from '@/lib/axios';

const registerSchema = z.object({
  nom: z.string().min(2, 'Minimum 2 caractères'),
  prenom: z.string().min(2, 'Minimum 2 caractères'),
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Minimum 6 caractères'),
  telephone: z.string().optional(),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function Register() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    setError('');
    setSuccess('');
    try {
      const payload = {
        nom: data.nom,
        prenom: data.prenom,
        email: data.email,
        motDePasse: data.password,
      };
      console.log('Payload inscription:', payload);
      const response = await api.post('/inscription', payload);
      console.log('Réponse inscription:', response.data);
      setSuccess('Inscription réussie ! Redirection...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err: any) {
      console.error('Erreur inscription:', err);
      console.error('Réponse erreur:', err.response);
      const errorMsg = typeof err.response?.data === 'string' 
        ? err.response.data 
        : err.response?.data?.message || err.message || 'Erreur d\'inscription';
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card">
      <h2 className="text-2xl font-bold text-text-primary mb-2">Inscription</h2>
      <p className="text-text-secondary mb-6">Créez votre compte patient</p>

      {error && (
        <div className="bg-danger/10 border border-danger/20 text-danger px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-success/10 border border-success/20 text-success px-4 py-3 rounded-lg mb-4">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Nom"
            placeholder="Nom"
            error={errors.nom?.message}
            {...register('nom')}
          />
          <Input
            label="Prénom"
            placeholder="Prénom"
            error={errors.prenom?.message}
            {...register('prenom')}
          />
        </div>

        <Input
          label="Email"
          type="email"
          placeholder="votre@email.com"
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          label="Téléphone"
          type="tel"
          placeholder="+212 6XX XXX XXX"
          error={errors.telephone?.message}
          {...register('telephone')}
        />

        <Input
          label="Mot de passe"
          type="password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register('password')}
        />

        <Button type="submit" className="w-full" isLoading={isLoading}>
          S'inscrire
        </Button>

        <p className="text-center text-sm text-text-secondary">
          Déjà un compte ?{' '}
          <Link to="/login" className="text-primary hover:underline">
            Se connecter
          </Link>
        </p>
      </form>
    </div>
  );
}
