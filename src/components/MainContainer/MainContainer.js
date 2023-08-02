import React from 'react'
import './MainContainer.css'
import { useSelector } from 'react-redux'
import Loading from '../Loading/Loading';
import Home from '../../screens/Home/Home';
import SidebarItem from '../SidebarItem/SidebarItem';

const Sidebar = ({ username, userPfp, userId }) => {
  const sidebarOpened = useSelector((state => state.dashboard.sidebarOpened));
  const pages = useSelector(state => state.pages);
  
  return (
    <div className={`${sidebarOpened ? "sidebar opened" : "sidebar"}`}>
      <div className="userContainer">
        <img src={userPfp} alt={username} />
        <div className="userData">
          <span>@{username}</span>
          <span>User ID - {userId}</span>
        </div>
      </div>
      <div className="sidebarItems">
        {
          pages && pages.length > 0 && pages.map((page, index) => {
            return <SidebarItem key={index} name={page.name} icon={page.icon} active={page.active} />
          })
        }
      </div>
    </div>
  )
}

const Content = () => {
  return (
    <div className="content">
      <div className="placeholderContent"></div>
      <div className="wrapper">
        <Home />
      </div>
    </div>
  )
}

const MainContainer = () => {
  const dashboardData = useSelector(state => state.dashboard);

  return (
    <div className='mainContainer'> 
      <Sidebar username={dashboardData.username} userPfp={dashboardData.avatar_file_url} userId={dashboardData.userId} />
      {
        dashboardData && dashboardData.walls.length > 0 ?
        <Content />
        :
        ""
      }
      {
        dashboardData.status === "loading" 
        ?
        <Loading />
        :
        ""
      }
    </div>
  )
}

export default MainContainer