import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import Loading from '../Loading/Loading';
import { Navigate } from 'react-router-dom';
import { loadWallCount, loadWallsAndUserAsync } from '../../features/dashboard/dashboardSlice';

const PrivateRouting = ({ component: Component }) => {
    const authData = useSelector(state => state.auth);
    const dashboardData = useSelector(state => state.dashboard);
    const dispatch = useDispatch();

    useEffect(() => {
        if (authData.isAuthenticated) {
            dispatch(loadWallCount({userId: authData.user.id}));
            dispatch(loadWallsAndUserAsync({userId: authData.user.id, page: dashboardData.page}))
        }
    // eslint-disable-next-line
    }, [])

    if (authData.status === 'loading') return <Loading />
    if (authData.isAuthenticated) return <Component />
    return <Navigate to="/" />
}

export default PrivateRouting