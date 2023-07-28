import React from 'react'
import './SidebarItem.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch } from 'react-redux';
import { makeActive } from '../../features/page/pageSlice';

const SidebarItem = ({ name, icon, active }) => {
  const dispatch = useDispatch();

  return (
    <div className={`${active ? "sidebarItem active" : "sidebarItem"}`} onClick={() => dispatch(makeActive({ name }))}>
      <div className="icon">
        <FontAwesomeIcon icon={icon} />
      </div>
      <div className="name">{name}</div>
    </div>
  )
}

export default SidebarItem