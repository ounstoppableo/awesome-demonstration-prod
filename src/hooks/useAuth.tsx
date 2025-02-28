import { useEffect, useState } from 'react';
import { auth as handleAuth } from '@/app/lib/data';

export default function useAuth() {
  const [auth, setAuth] = useState(false);
  useEffect(() => {
    if (localStorage.getItem('token')) {
      handleAuth().then((res) => {
        if (res.code === 200) {
          setAuth(true);
        }
      });
    }
  }, []);
  return { auth };
}
