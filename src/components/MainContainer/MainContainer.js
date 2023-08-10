import React, { useEffect, useState } from 'react'
import './MainContainer.css'
import { useDispatch, useSelector } from 'react-redux'
import Loading from '../Loading/Loading';
import Home from '../../screens/Home/Home';
import SidebarItem from '../SidebarItem/SidebarItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { adminWallDeleteAsync, adminWallUpdateAsync, deleteWallByIdAsync, unselectWall, updateWallByIdAsync } from '../../features/dashboard/dashboardSlice';
import { hideToast, showToast } from '../../features/toast/toastSlice';
import { useLocation, useNavigate } from 'react-router-dom';

const Sidebar = ({ username, userPfp, userId }) => {
  const sidebarOpened = useSelector((state => state.dashboard.sidebarOpened));
  const user = useSelector(state => state.auth.user);
  const pages = useSelector(state => state.pages);
  const [userPFPLoading, setUserPFPLoading] = useState(true);

  const imageLoaded = () => {
    setUserPFPLoading(false);
  }

  return (
    <div className={`${sidebarOpened ? "sidebar opened" : "sidebar"}`}>
      { 
      userPfp && userPFPLoading
      ?
      <Loading />
      :
      ""
      }
      <div className="userContainer">
        {
          userPfp ? 
          <img className={userPfp && userPFPLoading ? "loading" : undefined} src={userPfp} alt={username} onLoad={imageLoaded} />
          :
          ""
        }
        <div className={`userData${userPfp && userPFPLoading ? ' loadingImage' : ""}`}>
          <span>
            @{username} 
            {
              user.userID === 975024565
              || user.userID === 934949695
              || user.userID === 1889905927 
              || user.userID === 127070302
              ?
              <span className="adminLabel">Admin</span>
              :
              ""
            }
          </span>
          <span>User ID - {userId}</span>
        </div>
      </div>
      <div className={`sidebarItems${userPfp && userPFPLoading ? ' loadingImage' : ""}`}>
        {
          pages && pages.length > 0 && pages.map((page, index) => {
            return <SidebarItem key={index} name={page.name} icon={page.icon} active={page.active} special={page.special} />
          })
        }
      </div>
    </div>
  )
}

const Content = () => {
  const userData = useSelector(state => ({username: state.dashboard.username, description: state.dashboard.description, id: state.auth.user.id, userPfp: state.dashboard.avatar_file_url, totalNoOfWalls: state.dashboard.totalNumberOfWalls, totalNoOfDownloadedWalls: state.dashboard.totalNumberOfDownloadedWalls, totalNoOfLikedWalls: state.dashboard.totalNumberOfLikedWalls, donationLinks: state.dashboard.donationLinks, socialMediaLinks: state.dashboard.socialMediaLinks}));

  return (
    <div className="content">
      <div className="placeholderContent"></div>
      <div className="wrapper">
        {
        userData.username ?
        <Home 
          username={userData.username}
          description={userData.description}
          donationLinks={userData.donationLinks}
          socialMediaLinks={userData.socialMediaLinks}
        />
        :
        ""
        }
        
      </div>
    </div>
  )
}

const WallModal = () => {
  const userID = useSelector(state => state.auth.user.userID);

  const selectedWall = useSelector(state => state.dashboard.selectedWall);
  const categories = useSelector(state => state.dashboard.extras.categories);
  const dispatch = useDispatch();
  const [loadingImage, setLoadingImage] = useState(true);

  const [textInputs, setTextInputs] = useState({ file_name: selectedWall.file_name ?? "", category: selectedWall.category })

  const [errors, setErrors] = useState([]);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.log(textInputs)
    if(textInputs.file_name === "") {
      setErrors((state) => {
        let newState = state;
        if (newState && newState.length > 0) {
          if (newState.filter(val => val.inputName === "file_name").length <= 0) {
            newState.push({inputName: "file_name", error: `Wallpaper name can't be blank`});
          }
        } else {
          newState = [{inputName: "file_name", error: "Wallpaper name can't be blank "}];
        }

        return newState;
      });
    } else {
      setErrors(state => (state && state.length > 0) && state.filter(val => val.inputName !== "file_name"));
    }

    if(textInputs.category === "") {
      setErrors((state) => {
        let newState = state;
        if (newState && newState.length > 0) {
          if (newState.filter(val => val.inputName === "category").length <= 0) {
            newState.push({inputName: "category", error: `You haven't chosen a category!`});
          }
        } else {
          newState = [{inputName: "category", error: "You haven't chosen a category!"}];
        }

        return newState;
      });
    } else {
      setErrors(state => (state && state.length > 0) && state.filter(val => val.inputName !== "category"));
    }
  }, [textInputs])

  const imageLoaded = () => {
    setLoadingImage(false);
  }

  const handleInputChange = (e) => {
    e.preventDefault();
    setTextInputs((state) => ({ ...state, [e.target.name]: e.target.value }));
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    setTimeout(() => {
      if (!errors || errors.length <= 0) {
        if(location.pathname === '/dashboard/admin/categories' && location.search !== '') {
          if (
            userID === 975024565
            || userID === 934949695
            || userID === 1889905927 
            || userID === 127070302
          ) {
            dispatch(adminWallUpdateAsync({ wallId: selectedWall._id, ...textInputs }));
          } else {
            dispatch(unselectWall());
            navigate("/dashboard");
          }
        } else {
          dispatch(updateWallByIdAsync({ wallId: selectedWall._id, ...textInputs }));
        }
      } else {
        dispatch(showToast({ status: "error", message: "Well, I think you got some errors to deal with first, scroll up!" }));
        setTimeout(() => dispatch(hideToast()), 5000);
      }
    }, 500);
  }

  return (
    <div className={`wallmodal`}>
      { 
      loadingImage
      ?
      <Loading />
      :
      ""
      }
      <div className={`content${loadingImage ? ' loadingImage' : ""}`}>
        <img className={loadingImage ? "loading" : undefined} src={selectedWall.file_url} alt="" onLoad={imageLoaded} />
        <div className="dialog">
          <div className="topBar"><FontAwesomeIcon icon="xmark" onClick={(e) => dispatch(unselectWall())} /><span>{selectedWall.file_name}</span><span className='spacer'></span></div>
          <div className="mainContent">
            <div className="wallSettings">
                <div className="setting">
                  <div className="settingTitle">Edit Wallpaper Name</div>
                  <div className="settingInfo">Change the name of the Wallpaper</div>
                  <div className="inputContainer">
                    <input placeholder='Wallpaper Name' type="text" name='file_name' className="settingInput" value={textInputs.file_name} onChange={handleInputChange} />
                  </div>
                  {
                    errors && errors.length > 0 && errors.map(error => {
                      if (error.inputName === "file_name") {
                        return (
                          <div key={error.inputName} className="inputContainer">
                            <span className='error'>Error - {error.error}</span>
                          </div>
                        )
                      } else return ""
                    })
                  }
                </div>
                <div className="setting">
                  <div className="settingTitle">Edit Wallpaper Category</div>
                  <div className="settingInfo">Change the Wallpaper Category</div>
                  <select name="category" id="" value={ textInputs.category } onChange={handleInputChange}>
                    <option value="">Select Category</option>
                    {
                      categories && categories.length > 0
                      ?
                      categories.map(category => {
                        return <option key={category._id} value={category._id}>{category.name}</option>
                      })
                      :
                      ""
                    }
                  </select>
                  {
                    errors && errors.length > 0 && errors.map(error => {
                      if (error.inputName === "category") {
                        return (
                          <div key={error.inputName} className="inputContainer">
                            <span className='error'>Error - {error.error}</span>
                          </div>
                        )
                      } else return ""
                    })
                  }
                </div>
                <div className="inputContainer">
                  <button onClick={handleSubmit} className='settingButton success'>Save changes</button>
                  <button className="settingButton danger" onClick={() => { 
                    if(location.pathname === '/dashboard/admin/categories' && location.search !== '') {
                      if (
                        userID === 975024565
                        || userID === 934949695
                        || userID === 1889905927 
                        || userID === 127070302
                      ) {
                        dispatch(adminWallDeleteAsync({ wallId: selectedWall._id }));
                        dispatch(unselectWall());
                      } else {
                        dispatch(unselectWall());
                        navigate("/dashboard");
                      }
                    } else {
                      dispatch(deleteWallByIdAsync({ wallId: selectedWall._id } ));
                      dispatch(unselectWall());
                    }
                  }}>Delete Wall</button>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const MainContainer = () => {
  const dashboardData = useSelector(state => state.dashboard);

  return (
    <div className='mainContainer'> 
      <Sidebar username={dashboardData.username} userPfp={dashboardData.avatar_file_url} userId={dashboardData.userId} />
      <Content />
      {
        dashboardData && dashboardData.selectedWall 
        ?
        <WallModal />
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