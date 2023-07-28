import React from 'react'
import './TopBar.css'
import { useDispatch, useSelector } from 'react-redux'
import { toggleSidebar } from '../../features/dashboard/dashboardSlice';

const TopBar = () => {
    const sidebarOpened = useSelector(state => state.dashboard.sidebarOpened);
    const dispatch = useDispatch();

    return (
        <div className='topbar'>
            <button className={`${ sidebarOpened ? "sidebarButton active" : "sidebarButton" }`} onClick={() => dispatch(toggleSidebar())}>
                <span className="line line1"></span>
                <span className="line line2"></span>
                <span className="line line3"></span>
            </button>
            <div className="logoContainer">
                <div className="logo">Creators</div>
            </div>
            <div className="placeholder"></div>
        </div>
    )
}

export default TopBar