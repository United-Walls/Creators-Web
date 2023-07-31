import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import Loading from '../Loading/Loading';
import { Navigate } from 'react-router-dom';
import { loadDownloadedWallsAsync, loadLikedWallsAsync, loadWallsAndUserAsync } from '../../features/dashboard/dashboardSlice';

const PrivateRouting = ({ component: Component }) => {
    const authData = useSelector(state => state.auth);
    const dashboardData = useSelector(state => state.dashboard);
    const dispatch = useDispatch();

    useEffect(() => {
        if (authData.isAuthenticated) {
            dispatch(loadWallsAndUserAsync({userId: authData.user.id, page: dashboardData.page}));
            dispatch(loadLikedWallsAsync({userId: authData.user.id, page: dashboardData.likedPage}));
            dispatch(loadDownloadedWallsAsync({userId: authData.user.id, page: dashboardData.downloadedPage}));
        }
    // eslint-disable-next-line
    }, [])

    if (authData.status === 'loading') return <Loading />
    if (authData.isAuthenticated) return <Component />
    return <Navigate to="/" />
}

export default PrivateRouting