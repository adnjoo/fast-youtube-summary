import { useEffect, useState } from 'react';

import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';

const supabase = createClient();

export function useUser() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (data?.user) {
        setUser(data.user);
      } else if (error) {
        // console.log('Error fetching user:', error);
      }
    };
    getUser();
  }, []);

  return user;
}
