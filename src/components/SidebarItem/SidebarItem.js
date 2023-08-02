import React from 'react'
import './SidebarItem.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleSidebar } from '../../features/dashboard/dashboardSlice';

const SidebarItem = ({ name, icon, active }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const sidebarOpened = useSelector(state => state.dashboard.sidebarOpened);
  return (
    <div 
      className={`${active ? "sidebarItem active" : "sidebarItem"}`} 
      onClick={() => {
        if(name === "Home") {
          navigate(`/dashboard/`)
        } else {
          navigate(`/dashboard/${name.toLowerCase()}`)
        }
        if (sidebarOpened) {
          dispatch(toggleSidebar());
        }
      }}>
      <div className="icon">
        <FontAwesomeIcon icon={icon} />
      </div>
      <div className="name">{name}</div>
    </div>
  )
}

export default SidebarItem