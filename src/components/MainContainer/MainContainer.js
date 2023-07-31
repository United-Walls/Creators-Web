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

const Content = ({ walls, username, userPfp, totalNoOfWalls, totalNoOfLikedWalls, totalNoOfDownloadedWalls, donationLinks, socialMediaLinks, description }) => {
  return (
    <div className="content">
      <div className="placeholderContent"></div>
      <div className="wrapper">
        <Home walls={walls} username={username} userPfp={userPfp} totalNoOfWalls={totalNoOfWalls} totalNoOfLikedWalls={totalNoOfLikedWalls} totalNoOfDownloadedWalls={totalNoOfDownloadedWalls} donationLinks={donationLinks} socialMediaLinks={socialMediaLinks} description={description} />
      </div>
    </div>
  )
}

const MainContainer = () => {
  const dashboardData = useSelector(state => state.dashboard);

  return (
    <div className='mainContainer'>
      {
        dashboardData.status === "loading" 
        ?
        <Loading />
        :
        ""
      }
      <Sidebar username={dashboardData.username} userPfp={dashboardData.avatar_file_url} userId={dashboardData.userId} />
      {
        dashboardData && dashboardData.walls.length > 0 ?
        <Content walls={dashboardData.walls} username={dashboardData.username} userPfp={dashboardData.avatar_file_url} totalNoOfWalls={dashboardData.totalNumberOfWalls} totalNoOfLikedWalls={dashboardData.totalNumberOfLikedWalls} totalNoOfDownloadedWalls={dashboardData.totalNumberOfDownloadedWalls} donationLinks={dashboardData.donationLinks} socialMediaLinks={dashboardData.socialMediaLinks} description={dashboardData.description} />
        :
        ""
      }
    </div>
  )
}

export default MainContainer