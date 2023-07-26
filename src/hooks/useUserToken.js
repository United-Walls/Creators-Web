import { useEffect, useState } from 'react'

const getUserToken = () => localStorage.getItem('token');

export default function useUserToken() {
  const [ userToken, setUserToken ] = useState(getUserToken());

  useEffect(() => {
    function hangleChangeStorage() {
      if (localStorage.getItem('token')) {
        setUserToken(getUserToken());
      }
    }

    window.addEventListener('storage', hangleChangeStorage);

    return () => window.removeEventListener('storage', hangleChangeStorage);
  })
  return userToken
}