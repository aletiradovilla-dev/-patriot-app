import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

type Profile = {
  nombre: string;
  telefono: string;
  empresa: string;
  email: string;
};

export function useProfile() {
  const [profile, setProfile] = useState<Profile>({ nombre: '', telefono: '', empresa: '', email: '' });

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      setProfile(p => ({ ...p, email: user.email || '' }));

      const { data } = await supabase
        .from('perfiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (data) {
        setProfile({
          nombre: data.nombre || '',
          telefono: data.telefono || '',
          empresa: data.empresa || '',
          email: user.email || '',
        });
      }
    };

    fetchProfile();
  }, []);

  return profile;
}