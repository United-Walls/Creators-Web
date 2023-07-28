import React, { useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Auth from '../screens/auth/Auth'
import useUserToken  from '../hooks/useUserToken'
import { useDispatch } from 'react-redux';
import { loadUserAsync, logout } from '../features/auth/authSlice';
import setAuthToken from '../utils/setAuthToken';
import './App.css';
import PrivateRouting from '../components/PrivateRouting/PrivateRouting';
import Dashboard from '../screens/dashboard/Dashboard';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faHome, faLink, faList, faUpload, faUser } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';

library.add(
  faHome, faList, faUpload, faUser, fab, faLink
)

const App = () => {
  const userToken = useUserToken();
  const dispatch = useDispatch(); 

  useEffect(() => {
    if(userToken) {
      setAuthToken(userToken);
      dispatch(loadUserAsync());
    } else {
      dispatch(logout());
    }
  }, [userToken, dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Auth />} />
        <Route path='dashboard/*' element={<PrivateRouting component={ Dashboard } />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;