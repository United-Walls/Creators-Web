import React, { useEffect } from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import Auth from '../screens/auth/Auth'
import useUserToken  from '../hooks/useUserToken'
import { useDispatch } from 'react-redux';
import { loadUserAsync, logout } from '../features/auth/authSlice';
import setAuthToken from '../utils/setAuthToken';
import './App.css';
import PrivateRouting from '../components/PrivateRouting/PrivateRouting';
import Dashboard from '../screens/dashboard/Dashboard';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faDownload, faHeart, faHome, faImage, faLink, faList, faQuoteLeft, faUpload, faUser, faXmark } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import Toast from '../components/Toast/Toast';

library.add(
  faHome, faList, faUpload, faUser, fab, faLink, faQuoteLeft, faImage, faDownload, faHeart, faXmark
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
    <div className='App' >
      <HashRouter basename={process.env.PUBLIC_URL}>
        <Routes>
          <Route path='/' element={<Auth />} />
          <Route path='dashboard/*' element={<PrivateRouting component={ Dashboard } />} />
        </Routes>
      </HashRouter>
      <Toast />
    </div>
  )
}

export default App;