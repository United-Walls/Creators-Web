import React, { useEffect } from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import Auth from '../screens/auth/Auth'
import useUserToken  from '../hooks/useUserToken'
import { useDispatch, useSelector } from 'react-redux';
import { loadUserAsync, logout } from '../features/auth/authSlice';
import setAuthToken from '../utils/setAuthToken';
import './App.css';
import PrivateRouting from '../components/PrivateRouting/PrivateRouting';
import Dashboard from '../screens/dashboard/Dashboard';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faChevronCircleLeft, faChevronCircleRight, faDownload, faHammer, faHeart, faHome, faImage, faLink, faList, faQuoteLeft, faRightFromBracket, faUpload, faUser, faXmark } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import Toast from '../components/Toast/Toast';
import { addPage } from '../features/page/pageSlice';
import { getExtrasAsync, resetDashboard } from '../features/dashboard/dashboardSlice';

library.add(
  faHome, faList, faUpload, faUser, fab, faLink, faQuoteLeft, faImage, faDownload, faHeart, faXmark, faHammer, faChevronCircleRight, faRightFromBracket, faChevronCircleLeft
)

const App = () => {
  const user = useSelector(state => state.auth.user);
  const userToken = useUserToken();
  const dispatch = useDispatch();

  useEffect(() => {
    if(userToken) {
      setAuthToken(userToken);
      dispatch(loadUserAsync());
    } else {
      dispatch(logout());
      dispatch(resetDashboard());
    }
  }, [userToken, dispatch]);

  useEffect(() => {
    if(user) {
      if (
        user.userID === 975024565
        || user.userID === 934949695
        || user.userID === 1889905927 
        || user.userID === 127070302
      ) {
        dispatch(addPage({ name: "Admin", icon: "hammer" }))
        dispatch(getExtrasAsync());
      }
    }
  }, [user, dispatch])

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