import React from 'react'
import { useSelector } from 'react-redux';
import Loading from '../Loading/Loading';
import { Navigate } from 'react-router-dom';

const PrivateRouting = ({ component: Component }) => {
    const authData = useSelector(state => state.auth);

    if (authData.status === 'loading') return <Loading />
    if (authData.isAuthenticated) return <Component />
    return <Navigate to="/" />
}

export default PrivateRouting