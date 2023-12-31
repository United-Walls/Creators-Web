import React, { useEffect, useRef, useState } from 'react'
import './Home.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {ReactComponent as ThreadsIcon} from '../../assets/icons/threads.svg';
import { useDispatch, useSelector } from 'react-redux';
import { getCategoryByIdAsync, getCreatorByIdAsync, loadSelectedWallAsync, loadWallsAndUserAsync, toggleSidebar, unselectCategory, unselectCreator, updateProfileAsync, updateProfilePicAsync, uploadWallpaperAsync } from '../../features/dashboard/dashboardSlice';
import { hasWhiteSpace, isValidUrl } from '../..';
import { hideToast, showToast } from '../../features/toast/toastSlice';
import { useLocation, useNavigate } from 'react-router-dom';
import { makeActive } from '../../features/page/pageSlice';
import { Waypoint } from 'react-waypoint';
import Loading from '../../components/Loading/Loading';

const Home = ({username, description, donationLinks, socialMediaLinks}) => {
  const userID = useSelector(state => state.auth.user.userID);
  const navigate = useNavigate();
  const userData = useSelector(state => ({username: state.dashboard.username, description: state.dashboard.description, id: state.auth.user.id, userPfp: state.dashboard.avatar_file_url, totalNoOfWalls: state.dashboard.totalNumberOfWalls, totalNoOfDownloadedWalls: state.dashboard.totalNumberOfDownloadedWalls, totalNoOfLikedWalls: state.dashboard.totalNumberOfLikedWalls, donationLinks: state.dashboard.donationLinks, socialMediaLinks: state.dashboard.socialMediaLinks}));
  const extras = useSelector(state => state.dashboard.extras);

  const wallData = useSelector(state => state.dashboard.walls);
  const wallPage = useSelector(state => state.dashboard.page);
  const approvedWallsData = useSelector(state => state.dashboard.approvalWalls)
  const categories = useSelector(state => state.dashboard.extras.categories);
  const [walls, setWalls] = useState();
  const [approvedWalls, setApprovedWalls] = useState();

  useEffect(() => {
    setWalls(state => wallData);
  }, [wallData]);

  useEffect(() => {
    setApprovedWalls(state => approvedWallsData);
  }, [approvedWallsData]);

  const fileRef = useRef(null);
  const wallRef = useRef(null);
  const location = useLocation();
  const page = useSelector(state => state.pages);
  const sidebarOpened = useSelector(state => state.dashboard.sidebarOpened);
  const dispatch = useDispatch();
  const [textInputs, setTextInputs] = useState({ 
                                        username: userData.username ?? "", 
                                        description: userData.description ?? "",
                                        twitter: userData.socialMediaLinks.twitter ?? "", 
                                        instagram: userData.socialMediaLinks.instagram ?? "", 
                                        facebook: userData.socialMediaLinks.facebook ?? "", 
                                        mastodon: userData.socialMediaLinks.mastodon ?? "", 
                                        threads: userData.socialMediaLinks.threads ?? "", 
                                        steam: userData.socialMediaLinks.steam ?? "", 
                                        linkedIn: userData.socialMediaLinks.linkedIn ?? "",
                                        link: userData.socialMediaLinks.link ?? "",
                                        other: userData.socialMediaLinks.other ?? [],
                                        paypal: userData.donationLinks.paypal ?? "",
                                        patreon: userData.donationLinks.patreon ?? "",
                                        otherdonations: userData.donationLinks.otherdonations ?? []
                                      });

  const [uploadProfilePic, setUploadProfilePic] = useState();
  const [wallpaperFiles, setWallpaperFiles] = useState([])
  const [addOtherSocialLinkActive, setAddOtherSocialLinkActive] = useState(false);
  const [addOtherDonationLinkActive, setAddOtherDonationLinkActive] = useState(false);
  const [otherSocialLink, setOtherSocialLink] = useState({title: "", link: ""});
  const [otherDonationLink, setOtherDonationLink] = useState({title: "", link: ""});
  const [errors, setErrors] = useState([]);
  const [categoryInput, setCategoryInput] = useState("");
  const [error, setError] = useState(false);

  const [loadingPics, setLoadingPics] = useState(true);

  const urls = ["", ""];

  const counter = useRef(0);

  const imageLoaded = () => {
    counter.current += 1;
    if (walls && walls.length > 0 && counter.current >= 1) {
      setLoadingPics(false);
    }
    if (userData.userPfp && counter.current >= 1) {
      setLoadingPics(false);
    }
    if (userData.userPfp && walls && walls.length > 0 && counter.current >= urls.length) {
      setLoadingPics(false);
    }
  }
  
  useEffect(() => {
    window.scrollTo(0, 0);
    switch(location.pathname) {
      case "/dashboard/admin/invites":
      case "/dashboard/admin/creators":
      case "/dashboard/admin/categories":
      case "/dashboard/admin/approvals":
      case "/dashboard/admin":
        if (
          userID === 975024565
          || userID === 934949695
          || userID === 1889905927 
          || userID === 127070302
        ) {
          dispatch(makeActive({ name: "Admin" }));
        } else {
          navigate("/dashboard");
        }
        break;
      case "/dashboard/wallpapers":
        dispatch(makeActive({name: "Wallpapers"}));
        break;

      case "/dashboard/upload":
        dispatch(makeActive({name: "Upload"}));
        break;

      default: 
        dispatch(makeActive({name: "Home"}));
        break;
    }
  }, [userID, location, dispatch, navigate]);

  useEffect(() => {
    if(location.pathname === '/dashboard/admin/categories' && location.search !== '') {
      if (
        userID === 975024565
        || userID === 934949695
        || userID === 1889905927 
        || userID === 127070302
      ) {
        let categoryId = location.search.split('?id=')[1];
        dispatch(getCategoryByIdAsync({ categoryId, page: extras.categoryWallsPage }));
      } else {
        navigate("/dashboard");
      }
    }
    // eslint-disable-next-line
  }, [location])

  useEffect(() => {
    if (location.pathname === '/dashboard/admin/creators' && location.search !== '') {
      if (
        userID === 975024565
        || userID === 934949695
        || userID === 1889905927 
        || userID === 127070302
      ) {
        let creatorId = location.search.split('?id=')[1];
        dispatch(getCreatorByIdAsync({ userId: creatorId, page: extras.creatorWallsPage }));
      } else {
        navigate("/dashboard");
      }
    }
    // eslint-disable-next-line
  }, [location]);

  useEffect(() => {
    if(categoryInput.trim().length === 0 || categoryInput === "") {
      setError(true);
    } else if(categoryInput.trim().length <= 2) {
      setError(true);
    } else if(!(/^\w+\s*\w+?$/.test(categoryInput))) {
      setError(true)
    } else {
      setError(false);
    }

    if(textInputs.username === "") {
      setErrors((state) => {
        let newState = state;
        if (newState && newState.length > 0) {
          if (newState.filter(val => val.inputName === "username").length <= 0) {
            newState.push({inputName: "username", error: `username can't be blank or have spaces`});
          }
        } else {
          newState = [{inputName: "username", error: "username can't be blank or have spaces"}];
        }

        return newState;
      });
    } else {
      if (hasWhiteSpace(textInputs.username)) {
        setErrors((state) => {
          let newState = state;
          if (newState && newState.length > 0) {
            if (newState.filter(val => val.inputName === "username").length <= 0) {
              newState.push({inputName: "username", error: `username can't be blank or have spaces`});
            } 
          } else {
            newState = [{inputName: "username", error: "username can't be blank or have spaces"}];
          }

          return newState;
        });
      } else {
        setErrors(state => (state && state.length > 0) && state.filter(val => val.inputName !== "username"));
      }
    }

    if(textInputs.twitter !== "" && !isValidUrl(textInputs.twitter)) {
      setErrors((state) => {
        let newState = state;
        
        if (newState && newState.length > 0) {
          if (newState.filter(val => val.inputName === "twitter").length <= 0) {
            newState.push({inputName: "twitter", error: `Not a valid link for twitter`})
          }
        } else {
          newState = [{inputName: "twitter", error: `Not a valid link for twitter`}];
        }
        
        return newState;
      });
    } else {
      setErrors(state => (state && state.length > 0) && state.filter(val => val.inputName !== "twitter"));
    }

    if(textInputs.instagram !== "" && !isValidUrl(textInputs.instagram)) {
      setErrors((state) => {
        let newState = state;
        
        if (newState && newState.length > 0) {
          if (newState.filter(val => val.inputName === "instagram").length <= 0) {
            newState.push({inputName: "instagram", error: `Not a valid link for instagram`})
          }
        } else {
          newState = [{inputName: "instagram", error: `Not a valid link for instagram`}];
        }
        
        return newState;
      });
    } else {
      setErrors(state => (state && state.length > 0) && state.filter(val => val.inputName !== "instagram"));
    }

    if(textInputs.facebook !== "" && !isValidUrl(textInputs.facebook)) {
      setErrors((state) => {
        let newState = state;
        
        if (newState && newState.length > 0) {
          if (newState.filter(val => val.inputName === "facebook").length <= 0) {
            newState.push({inputName: "facebook", error: `Not a valid link for facebook`})
          }
        } else {
          newState = [{inputName: "facebook", error: `Not a valid link for facebook`}];
        }
        
        return newState;
      });
    } else {
      setErrors(state => (state && state.length > 0) && state.filter(val => val.inputName !== "facebook"));
    }

    if(textInputs.mastodon !== "" && !isValidUrl(textInputs.mastodon)) {
      setErrors((state) => {
        let newState = state;
        
        if (newState && newState.length > 0) {
          if (newState.filter(val => val.inputName === "mastodon").length <= 0) {
            newState.push({inputName: "mastodon", error: `Not a valid link for mastodon`})
          }
        } else {
          newState = [{inputName: "mastodon", error: `Not a valid link for mastodon`}];
        }
        
        return newState;
      });
    } else {
      setErrors(state => (state && state.length > 0) && state.filter(val => val.inputName !== "mastodon"));
    }

    if(textInputs.threads !== "" && !isValidUrl(textInputs.threads)) {
      setErrors((state) => {
        let newState = state;
        
        if (newState && newState.length > 0) {
          if (newState.filter(val => val.inputName === "threads").length <= 0) {
            newState.push({inputName: "threads", error: `Not a valid link for threads`})
          }
        } else {
          newState = [{inputName: "threads", error: `Not a valid link for threads`}];
        }
        
        return newState;
      });
    } else {
      setErrors(state => (state && state.length > 0) && state.filter(val => val.inputName !== "threads"));
    }

    if(textInputs.steam !== "" && !isValidUrl(textInputs.steam)) {
      setErrors((state) => {
        let newState = state;
        
        if (newState && newState.length > 0) {
          if (newState.filter(val => val.inputName === "steam").length <= 0) {
            newState.push({inputName: "steam", error: `Not a valid link for steam`})
          }
        } else {
          newState = [{inputName: "steam", error: `Not a valid link for steam`}];
        }
        
        return newState;
      });
    } else {
      setErrors(state => (state && state.length > 0) && state.filter(val => val.inputName !== "steam"));
    }

    if(textInputs.linkedIn !== "" && !isValidUrl(textInputs.linkedIn)) {
      setErrors((state) => {
        let newState = state;
        
        if (newState && newState.length > 0) {
          if (newState.filter(val => val.inputName === "linkedIn").length <= 0) {
            newState.push({inputName: "linkedIn", error: `Not a valid link for linkedin`})
          }
        } else {
          newState = [{inputName: "linkedIn", error: `Not a valid link for linkedin`}];
        }
        
        return newState;
      });
    } else {
      setErrors(state => (state && state.length > 0) && state.filter(val => val.inputName !== "linkedIn"));
    }

    if(textInputs.link !== "" && !isValidUrl(textInputs.link)) {
      setErrors((state) => {
        let newState = state;
        
        if (newState && newState.length > 0) {
          if (newState.filter(val => val.inputName === "link").length <= 0) {
            newState.push({inputName: "link", error: `Not a valid link for link`})
          }
        } else {
          newState = [{inputName: "link", error: `Not a valid link for the Custom link`}];
        }
        
        return newState;
      });
    } else {
      setErrors(state => (state && state.length > 0) && state.filter(val => val.inputName !== "link"));
    }

    if(textInputs.paypal !== "" && !isValidUrl(textInputs.paypal)) {
      setErrors((state) => {
        let newState = state;
        
        if (newState && newState.length > 0) {
          if (newState.filter(val => val.inputName === "paypal").length <= 0) {
            newState.push({inputName: "paypal", error: `Not a valid link for paypal`})
          }
        } else {
          newState = [{inputName: "paypal", error: `Not a valid link for paypal`}];
        }
        
        return newState;
      });
    } else {
      setErrors(state => (state && state.length > 0) && state.filter(val => val.inputName !== "paypal"));
    }

    if(textInputs.patreon !== "" && !isValidUrl(textInputs.patreon)) {
      setErrors((state) => {
        let newState = state;
        
        if (newState && newState.length > 0) {
          if (newState.filter(val => val.inputName === "patreon").length <= 0) {
            newState.push({inputName: "patreon", error: `Not a valid link for patreon`})
          }
        } else {
          newState = [{inputName: "patreon", error: `Not a valid link for patreon`}];
        }
        
        return newState;
      });
    } else {
      setErrors(state => (state && state.length > 0) && state.filter(val => val.inputName !== "patreon"));
    }

    if(textInputs.other.length > 0) {
      for(let i = 0; i < textInputs.other.length; i++) {
        let other = textInputs.other[i];
        if (other.link !== "" && !isValidUrl(other.link)) {
          setErrors(state => {
            let newState = state;

            if (newState && newState.length > 0) {
              if (newState.filter(val => val.inputName === other.title).length <= 0) {
                newState.push({inputName: other.title, error: `Not a valid link for ${other.title}`});
              }
            } else {
              newState = [{inputName: other.title, error: `Not a valid link for ${other.title}`}];
            }
          });
        } else {
          setErrors(state => (state && state.length > 0) && state.filter(val => val.inputName !== other.title));
        }
      }
    }

    if(textInputs.otherdonations.length > 0) {
      for(let i = 0; i < textInputs.otherdonations.length; i++) {
        let other = textInputs.otherdonations[i];
        if (other.link !== "" && !isValidUrl(other.link)) {
          setErrors(state => {
            let newState = state;

            if (newState && newState.length > 0) {
              if (newState.filter(val => val.inputName === other.title).length <= 0) {
                newState.push({inputName: other.title, error: `Not a valid link for ${other.title}`});
              }
            } else {
              newState = [{inputName: other.title, error: `Not a valid link for ${other.title}`}];
            }
          });
        } else {
          setErrors(state => (state && state.length > 0) && state.filter(val => val.inputName !== other.title));
        }
      }
    }
  }, [textInputs, categoryInput])

  const handleInputChange = (e) => {
    setTextInputs((state) => {
      return { ...state, [e.target.name]: e.target.value }
    })
  }

  const handleOtherSocialMediaInputChange = (e) => {
    setTextInputs((state) => {
      let other = state.other.map((val, index) => {
        if (val.title === e.target.name) {
          return { title: val.title, link: e.target.value };
        } else {
          return val;
        }
      });
      return { ...state, other: other};
    })
  }

  const handleOtherDonationInputChange = (e) => {
    setTextInputs((state) => {
      const otherdonations = state.otherdonations.map(exists => {
        if (exists.title === e.target.name) {
          return { title: exists.title, link: e.target.value };
        } else {
          return exists;
        }
      });
      return { ...state, otherdonations: otherdonations}
    })
  }

  const handleAddingOtherSocialMediaLinkChange = (e) => {
    setOtherSocialLink((state) => ({...state, [e.target.name]: e.target.value }))
  }

  const handleAddingOtherDonationLinkChange = (e) => {
    setOtherDonationLink((state) => ({...state, [e.target.name]: e.target.value }));
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!addOtherSocialLinkActive && !addOtherDonationLinkActive) {
      setTimeout(() => {
        if (!errors || errors.length <= 0) {
          dispatch(updateProfileAsync(textInputs));
        } else {
          dispatch(showToast({ status: "error", message: "Well, I think you got some errors to deal with first, scroll up!" }));
          setTimeout(() => dispatch(hideToast()), 5000);
        }
      }, 500);
    }
  }

  return (
    <div
      className={`page ${page.filter(val => val.active)[0].name.toLowerCase()}`} 
      onClick={(e) => {
        if (sidebarOpened) {
          dispatch(toggleSidebar());
        }
      }}
      style={{cursor: `${sidebarOpened ? "pointer" : "default"}`}}
    >
      { 
      walls && walls.length > 0 && loadingPics
      ?
      <Loading />
      :
      walls && walls.length > 0
      ?
      ""
      :
      <div style={{height: "120px"}}></div>
      }
      <div className="headerImage">
          {
          walls && walls.length > 0
          ?
          <img className={walls && walls.length > 0 && loadingPics ? 'loading' : undefined} src={walls[0].file_url} alt={walls[0].file_name} onLoad={imageLoaded} />
          :
          ""
          }
      </div>
      <div className="userHeader">
        <div className="userPfp">
          {userData.userPfp
          ?<img className={userData.userPfp && loadingPics ? 'loading' : undefined} src={userData.userPfp} alt={userData.username} onLoad={imageLoaded} />:""}
        </div>
        <div className={`userInfo${userData.userPfp > 0 && loadingPics ? ' loadingImage' : ""}`}>
          <div className="username">@{userData.username}</div>
          <div className="description">{userData.description}</div>
          <div className="userDetails">
            <div className="userDetail">
              <div className="title">Wallpapers</div>
              <div className="data">{userData.totalNoOfWalls}</div>
            </div>
            <div className="userDetail">
              <div className="title">Liked</div>
              <div className="data">{userData.totalNoOfLikedWalls}</div>
            </div>
            <div className="userDetail">
              <div className="title">Downloaded</div>
              <div className="data">{userData.totalNoOfDownloadedWalls}</div>
            </div>
          </div>
        </div>
      </div>
        {
          page.filter(val => val.active)[0].name === "Home"
          ?
          (
            <div className="userSettings">
              <div className="setting">
                <div className="inputContainer">
                  <span>Note: All Text Fields can be saved with the Save button down below. While for the Profile Picture, you'll need to upload and click on the Upload button below on the Add/Edit Profile Pic Section. <br /><br />When adding More Social/Donation Links, make sure to click on Save button, otherwise it might get deleted after Refresh. You can add as many as you want as long as it contains a Title.</span>
                </div>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="setting">
                  <div className="settingTitle">Edit Username</div>
                  <div className="settingInfo">Change your username</div>
                  <div className="inputContainer">
                    <div className="icon"><FontAwesomeIcon icon="user" /></div>
                    <input placeholder='Username' type="text" name='username' className="settingInput" value={textInputs.username} onChange={handleInputChange} />
                  </div>
                  {
                    errors && errors.length > 0 && errors.map(error => {
                      if (error.inputName === "username") {
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
                  <div className="settingTitle">Add/Edit Description</div>
                  <div className="settingInfo">Add/change your Profile description</div>
                  <div className="inputContainer">
                    <div className="icon"><FontAwesomeIcon icon="quote-left" /></div>
                    <textarea placeholder='Description' type="text" name='description' className="settingInput" value={textInputs.description} onChange={handleInputChange} />
                  </div>
                </div>
                <div className="setting">
                  <div className="settingTitle">Add/Edit Profile Pic</div>
                  <div className="settingInfo">Add/Change your Profile Pic. Make sure it's Resolution ratio is 1:1. PNG or JPEG is allowed</div>
                  <input 
                    type="file" 
                    ref={fileRef} 
                    style={{display: "none"}} 
                    onChange={(e) => {
                      const file = e.target.files[0];
                      setUploadProfilePic(state => file);
                    }} 
                  />
                  <div 
                    className={`${!uploadProfilePic ? "dropZone big" : "dropZone"}`}
                    onClick={(e) => {
                      fileRef.current.click();
                    }}
                    onDrop={(e) => {
                      // Prevent default behavior (Prevent file from being opened)
                      e.preventDefault();
                    
                      if (e.dataTransfer.items) {
                        // Use DataTransferItemList interface to access the file(s)
                        [...e.dataTransfer.items].forEach((item, i) => {
                          // If dropped items aren't files, reject them
                          if (item.kind === "file") {
                            const file = item.getAsFile();
                            setUploadProfilePic(state => {
                              return file
                            });
                          }
                        });
                      } else {
                        // Use DataTransfer interface to access the file(s)
                        [...e.dataTransfer.files].forEach((file, i) => {
                          setUploadProfilePic(state => {
                            return file
                          });
                        });
                      }}}
                      onDragOver={(e) => {
                        // Prevent default behavior (Prevent file from being opened)
                        e.preventDefault();
                      }}
                    >
                      <div className="row">
                        <FontAwesomeIcon icon="image" />
                        <span>Click or drag a file here to {uploadProfilePic ? "change the " : ""} upload.</span>
                      </div>
                      {
                        uploadProfilePic 
                        ?
                          <div className="imageContainer"><img src={uploadProfilePic ? URL.createObjectURL(uploadProfilePic) : ""} alt="" /></div>
                        : 
                          ""
                      }
                  </div>
                  <div className="file">
                  {
                    uploadProfilePic 
                    ? 
                      (<span>Upload <b>{uploadProfilePic.name}</b>?</span>) 
                    : 
                      ""
                  }
                  </div>
                  {
                    uploadProfilePic
                    ?
                    <button 
                      className="settingButton" 
                      onClick={async (e) => {
                        e.preventDefault();
                        const formData = new FormData();
                        formData.append("profilePic", uploadProfilePic);
                        dispatch(updateProfilePicAsync(formData));
                        setUploadProfilePic(undefined);
                      }}
                    >Upload</button>
                    :
                    ""
                  }
                </div>
                <div className="setting">
                  <div className="settingTitle">Add/Edit Social Media Links</div>
                  <div className="settingInfo">Add/Change your social media links</div>
                  <div className="inputContainer">
                    <div className="icon"><FontAwesomeIcon icon={['fab', 'twitter']} /></div>
                    <input placeholder='Twitter' type="text" name='twitter' className="settingInput" value={textInputs.twitter} onChange={handleInputChange} />
                  </div>
                  {
                    errors && errors.length > 0 && errors.map(error => {
                      if (error.inputName === "twitter") {
                        return (
                          <div key={error.inputName} className="inputContainer">
                            <span className='error'>Error - {error.error}</span>
                          </div>
                        )
                      } else return ""
                    })
                  }
                  <div className="inputContainer">
                    <div className="icon"><FontAwesomeIcon icon={['fab', 'instagram']} /></div>
                    <input placeholder='Instagram' type="text" name='instagram' className="settingInput" value={textInputs.instagram} onChange={handleInputChange} />
                  </div>
                  {
                    errors && errors.length > 0 && errors.map(error => {
                      if (error.inputName === "instagram") {
                        return (
                          <div key={error.inputName} className="inputContainer">
                            <span className='error'>Error - {error.error}</span>
                          </div>
                        )
                      } else return ""
                    })
                  }
                  <div className="inputContainer">
                    <div className="icon"><FontAwesomeIcon icon={['fab', 'facebook']} /></div>
                    <input placeholder='Facebook' type="text" name='facebook' className="settingInput" value={textInputs.facebook} onChange={handleInputChange} />
                  </div>
                  {
                    errors && errors.length > 0 && errors.map(error => {
                      if (error.inputName === "facebook") {
                        return (
                          <div key={error.inputName} className="inputContainer">
                            <span className='error'>Error - {error.error}</span>
                          </div>
                        )
                      } else return ""
                    })
                  }
                  <div className="inputContainer">
                    <div className="icon"><FontAwesomeIcon icon={['fab', 'mastodon']} /></div>
                    <input placeholder='Mastodon' type="text" name='mastodon' className="settingInput" value={textInputs.mastodon} onChange={handleInputChange} />
                  </div>
                  {
                    errors && errors.length > 0 && errors.map(error => {
                      if (error.inputName === "mastodon") {
                        return (
                          <div key={error.inputName} className="inputContainer">
                            <span className='error'>Error - {error.error}</span>
                          </div>
                        )
                      } else return ""
                    })
                  }
                  <div className="inputContainer">
                    <div className="icon"><ThreadsIcon style={{ width: "25px", fill: "var(--textColor)"}} /></div>
                    <input placeholder='Threads' type="text" name='threads' className="settingInput" value={textInputs.threads} onChange={handleInputChange} />
                  </div>
                  {
                    errors && errors.length > 0 && errors.map(error => {
                      if (error.inputName === "threads") {
                        return (
                          <div key={error.inputName} className="inputContainer">
                            <span className='error'>Error - {error.error}</span>
                          </div>
                        )
                      } else return ""
                    })
                  }
                  <div className="inputContainer">
                    <div className="icon"><FontAwesomeIcon icon={['fab', 'steam']} /></div>
                    <input placeholder='Steam' type="text" name='steam' className="settingInput" value={textInputs.steam} onChange={handleInputChange} />
                  </div>
                  {
                    errors && errors.length > 0 && errors.map(error => {
                      if (error.inputName === "steam") {
                        return (
                          <div key={error.inputName} className="inputContainer">
                            <span className='error'>Error - {error.error}</span>
                          </div>
                        )
                      } else return ""
                    })
                  }
                  <div className="inputContainer">
                    <div className="icon"><FontAwesomeIcon icon={['fab', 'linkedin']} /></div>
                    <input placeholder='LinkedIn' type="text" name='linkedIn' className="settingInput" value={textInputs.linkedIn} onChange={handleInputChange} />
                  </div>
                  {
                    errors && errors.length > 0 && errors.map(error => {
                      if (error.inputName === "linkedIn") {
                        return (
                          <div key={error.inputName} className="inputContainer">
                            <span className='error'>Error - {error.error}</span>
                          </div>
                        )
                      } else return ""
                    })
                  }
                  <div className="inputContainer">
                    <div className="icon"><FontAwesomeIcon icon="link" /></div>
                    <input placeholder='Link' type="text" name='link' className="settingInput" value={textInputs.link} onChange={handleInputChange} />
                  </div>
                  {
                    errors && errors.length > 0 && errors.map(error => {
                      if (error.inputName === "link") {
                        return (
                          <div key={error.inputName} className="inputContainer">
                            <span className='error'>Error - {error.error}</span>
                          </div>
                        )
                      } else return ""
                    })
                  }
                  {
                    textInputs.other && textInputs.other.length > 0
                    ?
                    textInputs.other.map((more, index) => {
                      return (
                        <>
                          <div key={index} className="inputContainer">
                            <div className="icon"><FontAwesomeIcon icon="link" /></div>
                            <input placeholder={textInputs.other[index].title} type="text" name={textInputs.other[index].title} className="settingInput" value={textInputs.other[index].link} onChange={handleOtherSocialMediaInputChange} />
                            <div className="deleteIcon" onClick={(e) => {
                              e.preventDefault();
                              setTextInputs(state => {
                                let others = state.other.filter(ot => ot.title !== textInputs.other[index].title);
                                return { ...state, other: others };
                              })
                            }}><FontAwesomeIcon icon="xmark" /></div>
                          </div>
                          {
                            errors && errors.length > 0 && errors.map(error => {
                              if (error.inputName === textInputs.other[index].title) {
                                return (
                                  <div key={error.inputName} className="inputContainer">
                                    <span className='error'>Error - {error.error}</span>
                                  </div>
                                )
                              } else return ""
                            })
                          }
                        </>
                      )
                    })
                    :
                    ""
                  }
                  {
                    addOtherSocialLinkActive 
                    ?
                    (
                    <>
                      <br />
                      <br />
                      <div className="inputContainer">
                        <div className="icon"><FontAwesomeIcon icon="quote-left" /></div>
                        <input placeholder="Website name" type="text" name="title" className="settingInput" value={otherSocialLink.title} onChange={handleAddingOtherSocialMediaLinkChange} />
                      </div>
                      <div className="inputContainer">
                        <div className="icon"><FontAwesomeIcon icon="link" /></div>
                        <input placeholder="Website link" type="text" name="link" className="settingInput" value={otherSocialLink.link} onChange={handleAddingOtherSocialMediaLinkChange} />
                      </div>
                      <div className="inputContainer">
                        <div 
                        className="settingButton success" 
                        onClick={() => {
                          setTextInputs((state) => {
                            if (otherSocialLink.title && otherSocialLink.title !== "" && otherSocialLink.title.length > 0) {
                              let other = state.other;
                              if (other.length > 0 ) {
                                other.push({ title: otherSocialLink.title, link: otherSocialLink.link });
                              } else {
                                other = [{ title: otherSocialLink.title, link: otherSocialLink.link }];
                              }
                              return { ...state, other: other };
                            } else {
                              return state;
                            }
                          });
                          setOtherSocialLink({title: "", link: ""});
                          setAddOtherSocialLinkActive(false);
                        }}
                        >Add</div>
                      </div>
                    </>
                    )
                    :
                    ""
                  }
                  <button className='settingButton' onClick={() => setAddOtherSocialLinkActive(state => !state)}>Add other links</button>
                </div>
                <div className="setting">
                  <div className="settingTitle">Add/Edit Donation Links</div>
                  <div className="settingInfo">Add/Change your donation links</div>
                  <div className="inputContainer">
                    <div className="icon"><FontAwesomeIcon icon={['fab', 'paypal']} /></div>
                    <input placeholder='Paypal' type="text" name='paypal' className="settingInput" value={textInputs.paypal} onChange={handleInputChange} />
                  </div>
                  {
                    errors && errors.length > 0 && errors.map(error => {
                      if (error.inputName === "paypal") {
                        return (
                          <div key={error.inputName} className="inputContainer">
                            <span className='error'>Error - {error.error}</span>
                          </div>
                        )
                      } else return ""
                    })
                  }
                  <div className="inputContainer">
                    <div className="icon"><FontAwesomeIcon icon={['fab', 'patreon']} /></div>
                    <input placeholder='Patreon' type="text" name='patreon' className="settingInput" value={textInputs.patreon} onChange={handleInputChange} />
                  </div>
                  {
                    errors && errors.length > 0 && errors.map(error => {
                      if (error.inputName === "patreon") {
                        return (
                          <div key={error.inputName} className="inputContainer">
                            <span className='error'>Error - {error.error}</span>
                          </div>
                        )
                      } else return ""
                    })
                  }
                  {
                    textInputs.otherdonations && textInputs.otherdonations.length > 0
                    ?
                    textInputs.otherdonations.map((more, index) => {
                      return (
                        <>
                          <div key={index} className="inputContainer">
                            <div className="icon"><FontAwesomeIcon icon="link" /></div>
                            <input placeholder={textInputs.otherdonations[index].title} type="text" name={textInputs.otherdonations[index].title} className="settingInput" value={textInputs.otherdonations[index].link} onChange={handleOtherDonationInputChange} />
                            <div className="deleteIcon" onClick={(e) => {
                              e.preventDefault();
                              setTextInputs(state => {
                                let others = state.otherdonations.filter(ot => ot.title !== textInputs.otherdonations[index].title);
                                return { ...state, otherdonations: others };
                              })
                            }}><FontAwesomeIcon icon="xmark" /></div>
                          </div>
                          {
                            errors && errors.length > 0 && errors.map(error => {
                              if (error.inputName === textInputs.otherdonations[index].title) {
                                return (
                                  <div key={error.inputName} className="inputContainer">
                                    <span className='error'>Error - {error.error}</span>
                                  </div>
                                )
                              } else return ""
                            })
                          }
                        </>
                      )
                    })
                    :
                    ""
                  }
                  {
                    addOtherDonationLinkActive 
                    ?
                    (
                    <>
                      <br />
                      <br />
                      <div className="inputContainer">
                        <div className="icon"><FontAwesomeIcon icon="quote-left" /></div>
                        <input placeholder="Website name" type="text" name="title" className="settingInput" value={otherDonationLink.title} onChange={handleAddingOtherDonationLinkChange} />
                      </div>
                      <div className="inputContainer">
                        <div className="icon"><FontAwesomeIcon icon="link" /></div>
                        <input placeholder="Website link" type="text" name="link" className="settingInput" value={otherDonationLink.link} onChange={handleAddingOtherDonationLinkChange} />
                      </div>
                      <div className="inputContainer">
                        <div 
                        className="settingButton success" 
                        onClick={() => {
                          setTextInputs((state) => {
                            if (otherDonationLink.title && otherDonationLink.title !== "" && otherDonationLink.title.length > 0) {
                              let other = state.otherdonations;
                              if (other.length > 0 ) {
                                other.push({ title: otherDonationLink.title, link: otherDonationLink.link });
                              } else {
                                other = [{ title: otherDonationLink.title, link: otherDonationLink.link }];
                              }
                              return { ...state, otherdonations: other };
                            } else {
                              return state;
                            }
                          });
                          setOtherDonationLink({title: "", link: ""});
                          setAddOtherDonationLinkActive(false);
                        }}
                        >Add</div>
                      </div>
                    </>
                    )
                    :
                    ""
                  }
                  <button className='settingButton' onClick={() => setAddOtherDonationLinkActive(state => !state)}>Add other links</button>
                </div>
                <button disabled={errors || errors.length > 0} className='settingButton success' type='submit'>Save</button>
              </form>
            </div>
          )
          :
          ""
        }
        {
          page.filter(val => val.active)[0].name === "Wallpapers"
          ?
          (
            <>
              {
                approvedWalls && 
                approvedWalls.length > 0
                ?
                (
                  <>
                  <h1><center>{approvedWalls && approvedWalls.length > 0 ? "Walls needing Approval" : ""}</center></h1>
                  <div className="wallpaperGrid">
                    {
                      approvedWalls && 
                      approvedWalls.length > 0 && 
                      approvedWalls.map((wall, index) => {
                        return (
                          <div key={wall.wall._id} id={wall.wall._id} className={`wallpaper wall-${index + 1}`}>
                            <img src={wall.wall.file_url} alt={wall.wall.file_name} />
                            <span>{ wall.wall.file_name }</span>
                          </div>
                        )
                      })
                    }
                  </div>
                  </>
                )
                :
                ""
              }
              <h1><center>{walls && walls.length > 0 ? "Uploaded Walls" : ""}</center></h1>
              <div className="wallpaperGrid">
              {
              walls && 
              walls.length > 0 && 
              walls.map((wall, index) => {
                return (
                  <div key={wall._id} id={wall._id} className={`wallpaper wall-${index + 1}`} onClick={(e) => {
                    e.preventDefault();
                    dispatch(loadSelectedWallAsync({wallId: wall._id}));
                  }}>
                    <img src={wall.thumbnail_url} alt={wall.file_name} />
                    <div className="dataInfo">
                      <div className="data likes">
                        <div className="icon">
                          <FontAwesomeIcon icon="heart" />
                        </div>
                        <div className="info">{ wall.timesFavourite }</div>
                      </div>
                      <div className="data downloads">
                        <div className="icon">
                          <FontAwesomeIcon icon='download' />
                        </div>
                        <div className="info">{ wall.timesDownloaded }</div>
                      </div>
                    </div>
                    <span>{ wall.file_name }</span>
                  </div>
                )
              })
              }
              <Waypoint scrollableAncestor={window} onEnter={({ previousPosition, currentPosition, event }) => {
                if (walls.length < userData.totalNoOfWalls) {
                  dispatch(loadWallsAndUserAsync({ userId: userData.id, page: wallPage }));
                }
              }} />
            </div>
            </>
          )
          :
          ""
        }
        {
          page.filter(val => val.active)[0].name === "Upload"
          ?
          <div className="setting">
            <div className="settingTitle">Upload Wallpaper</div>
            <div className="settingInfo">Upload a wallpaper</div>
            <input 
              type="file" 
              ref={wallRef} 
              style={{display: "none"}} 
              multiple
              accept='image/*'
              onChange={(e) => {
                const files = e.target.files;
                setWallpaperFiles(state => {
                  let newState = state;
                  for(let i = 0; i < files.length; i++) {
                    newState.push(files[i]);
                  }
                  return newState;
                });
              }} 
            />
            <div 
              className="dropZone big"
              onClick={(e) => {
                wallRef.current.click();
              }}
              onDrop={(e) => {
                // Prevent default behavior (Prevent file from being opened)
                e.preventDefault();
              
                if (e.dataTransfer.items) {
                  // Use DataTransferItemList interface to access the file(s)
                  [...e.dataTransfer.items].forEach((item, i) => {
                    // If dropped items aren't files, reject them
                    if (item.kind === "file") {
                      const file = item.getAsFile();
                      setWallpaperFiles(state => {
                        let newState = state;
                        newState.push(file);
                        return newState
                      });
                    }
                  });
                } else {
                  // Use DataTransfer interface to access the file(s)
                  [...e.dataTransfer.files].forEach((file, i) => {
                    setUploadProfilePic(state => {
                      let newState = state;
                      newState.push(file);
                      return newState
                    });
                  });
                }}}
                onDragOver={(e) => {
                  // Prevent default behavior (Prevent file from being opened)
                  e.preventDefault();
                }}
              >
                <div className="row">
                  <FontAwesomeIcon icon="image" />
                  <span>Click or drag files here to upload.</span>
                </div>
            </div>
            <br />
            <br />
            {
              wallpaperFiles && wallpaperFiles.length > 0
              ?
              <>
                <div className="settingInfo">Clicking on the image, will remove from the uploads.</div>
                <div className="wallpapers">
                  <div className="wallpaperGrid">
                  {
                    wallpaperFiles.map((file, index) => {
                      return <div key={index} className="wallpaper" onClick={(e) => {
                        e.preventDefault();
                        setWallpaperFiles(state => state.filter(st => st !== file))
                      }}> 
                        <span><FontAwesomeIcon icon="xmark" /></span>
                        <img src={URL.createObjectURL(file)} alt={file.name} />
                      </div>
                    })
                  }
                  </div>
                </div>
                <div className="setting">
                  <div className="settingInfo">Choose a category for {wallpaperFiles.length > 1 ? "all these wallpapers" : "this wallpaper"}. {wallpaperFiles.length > 1 ? "Remember all these wallpapers will have to be the same category you choose. If you want to choose another category, upload these first, then upload the others with the new category." : ""}</div>
                  <div className="inputContainer">
                    <select name="category" id="" value={ categoryInput } onChange={(e) => {setCategoryInput(e.target.value)}}>
                      <option value="">Select Category</option>
                      {
                        categories && categories.length > 0
                        ?
                        categories.map(category => {
                          return <option key={category._id} value={category.name}>{category.name}</option>
                        })
                        :
                        ""
                      }
                    </select>
                  </div>
                  <div className="settingInfo">Or you can just type a new Category, our Server will make it automatically</div>
                  <div className="inputContainer">
                    <input placeholder="Category Name" type="text" name="categoryText" className="settingInput" value={categoryInput} onChange={(e) => {
                      const re = /(\b[a-z](?!\s))/g;
                      setCategoryInput(e.target.value.replace(re, (x) => x.toUpperCase()));
                    }} />
                  </div>
                  {
                    error 
                    ?
                    <div className="inputContainer">
                      <span className='error'>{categoryInput.trim().length <= 0 ? "Error - You need to select a Category" : categoryInput.trim().length <= 2 ? "Error - Category should be atleast more than 2 characters" : !(/^\w+\s*\w+?$/.test(categoryInput.trim())) ? "Error - you can only have a category with two words, or just one. For Example - One word Categories - Abstract, Two word Categories - Aerial View" : categoryInput.trim() === "" ? "Error - You need to select a Category" : ""}</span>
                    </div>
                    :
                    ""
                  }
                </div>
                <button 
                  disabled={error}
                  className="settingButton" 
                  onClick={async (e) => {
                    e.preventDefault();
                    const formData = new FormData();
                    formData.append("categoryName", categoryInput.trim())
                    wallpaperFiles.forEach(file => {
                      formData.append("walls", file);
                    })
                    dispatch(uploadWallpaperAsync(formData));
                    setWallpaperFiles([]);
                  }}
                >Upload</button>
              </>
              :
              ""
            }
          </div>
          :
          ""
        }
        {
          page.filter(val => val.active)[0].name === "Admin"
          ?
            location.pathname === "/dashboard/admin"
            ?
            (<div className="setting">
              <div className="pageButton" onClick={(e) => navigate('/dashboard/admin/approvals')}>
                <span>Walls Approvement</span>
                <FontAwesomeIcon icon="circle-chevron-right" />
              </div>
              <div className="pageButton" onClick={(e) => navigate('/dashboard/admin/categories')}>
                <span>Wall Categories</span>
                <FontAwesomeIcon icon="circle-chevron-right" />
              </div>
              <div className="pageButton" onClick={(e) => navigate('/dashboard/admin/creators')}>
                <span>Edit Creators</span>
                <FontAwesomeIcon icon="circle-chevron-right" />
              </div>
              <div className="pageButton" onClick={(e) => navigate('/dashboard/admin/invites')}>
                <span>Invitation Codes</span>
                <FontAwesomeIcon icon="circle-chevron-right" />
              </div>
            </div>)
            :
            ""
          :
          ""
        }
        {
          page.filter(val => val.active)[0].name === "Admin"
          ?
            location.pathname === "/dashboard/admin/approvals"
            ?
            (
            <div className="setting">
              <div className="pageButton" onClick={(e) => navigate('/dashboard/admin')}>
                <FontAwesomeIcon icon="circle-chevron-left" />
                <span>Walls Approvement</span>
                <span style={{width: "16px"}}></span>
              </div>
            </div>
            )
            :
            ""
          :
          ""
        }
        {
          page.filter(val => val.active)[0].name === "Admin"
          ?
            location.pathname === "/dashboard/admin/categories"
            ?
              location.search === ''
              ?
              (
                <div className="setting">
                  <div className="pageButton" onClick={(e) => navigate('/dashboard/admin')}>
                    <FontAwesomeIcon icon="circle-chevron-left" />
                    <span>Wall Categories</span>
                    <span style={{width: "16px"}}></span>
                  </div>
                  <div className="categories">
                    <div className="categoryGrid">
                      {
                        categories && categories.length > 0
                        ?
                        categories.map((category, index) => {
                          return category 
                              ?
                              (
                                <div key={category._id} id={category._id} className={`category category-${index + 1}`} onClick={(e) => {
                                  e.preventDefault();
                                  navigate(`/dashboard/admin/categories?id=${category._id}`)
                                }}>
                                {
                                  category.walls[0] && category.walls.length > 0 
                                  ?
                                  <img src={category.walls[0].thumbnail_url} alt={category.walls[0].file_name} />
                                  :
                                  ""
                                }
                                <span>{ category.name }</span>
                              </div>
                              )
                              : 
                              ""
                            })
                        :
                        ""
                      }
                    </div>
                  </div>
                </div>
              )
              :
              extras && extras.selectedCategory
              ?
                (
                  
                  <div className="setting">
                    <div className="pageButton" onClick={(e) => {
                      dispatch(unselectCategory());
                      setTimeout(() => {
                        navigate('/dashboard/admin/categories');
                      }, 250)
                    }}>
                      <FontAwesomeIcon icon="circle-chevron-left" />
                      <span>{extras.selectedCategory.name} ({extras.totalNoOfCategoryWalls})</span>
                      <span style={{width: "16px"}}></span>
                    </div>
                    <button 
                        disabled={error}
                        className="settingButton success" 
                        onClick={async (e) => {
                          e.preventDefault();
                        }}
                        style={{ marginTop: "1rem" }}
                      >Edit Category
                    </button>
                    <button 
                        disabled={error}
                        className="settingButton danger" 
                        onClick={async (e) => {
                          e.preventDefault();
                        }}
                      >Delete Category
                    </button>
                    <div className="wallpapers">
                      <div className="wallpaperGrid">
                      {
                      extras.selectedCategory.walls && 
                      extras.selectedCategory.walls.length > 0 && 
                      extras.selectedCategory.walls.map((wall, index) => {
                        return (
                          <div key={wall._id} id={wall._id} className={`wallpaper wall-${index + 1}`} onClick={(e) => {
                            e.preventDefault();
                            dispatch(loadSelectedWallAsync({wallId: wall._id}));
                          }}>
                            <img src={wall.thumbnail_url} alt={wall.file_name} />
                            <div className="dataInfo">
                              <div className="data likes">
                                <div className="icon">
                                  <FontAwesomeIcon icon="heart" />
                                </div>
                                <div className="info">{ wall.timesFavourite }</div>
                              </div>
                              <div className="data downloads">
                                <div className="icon">
                                  <FontAwesomeIcon icon='download' />
                                </div>
                                <div className="info">{ wall.timesDownloaded }</div>
                              </div>
                            </div>
                            <span>{ wall.file_name }</span>
                          </div>
                        )
                      })
                      }
                      <Waypoint scrollableAncestor={window} onEnter={({ previousPosition, currentPosition, event }) => {
                        if (extras.selectedCategory.walls.length < extras.totalNoOfCategoryWalls) {
                          dispatch(getCategoryByIdAsync({ categoryId: extras.selectedCategory._id, page: extras.categoryWallsPage }));
                        }
                      }} />
                      </div>
                    </div>
                  </div>
                )
              :
                ""
            :
              ""
          :
            ""
        }
        {
          page.filter(val => val.active)[0].name === "Admin"
          ?
            location.pathname === "/dashboard/admin/creators"
            ?
              location.search === ''
              ?
              (
              <div className="setting">
                <div className="pageButton" onClick={(e) => navigate('/dashboard/admin')}>
                  <FontAwesomeIcon icon="circle-chevron-left" />
                  <span>Edit Creators</span>
                  <span style={{width: "16px"}}></span>
                </div>
                <div className="userGrid">
                {
                  extras.creators &&
                  extras.creators.length > 0
                  ?
                  extras.creators.map(creator => {
                    return (
                    <div key={creator._id} id={creator._id} className="pageButton user" style={{
                      backgroundImage: `url("${creator.walls && creator.walls.length > 0 ? creator.walls[0].thumbnail_url : "unset"}`,
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      textShadow: "0px 5px 10px #000a"
                      }} onClick={(e) => {
                        e.preventDefault();
                        navigate(`/dashboard/admin/creators?id=${creator._id}`);
                      }}>
                      <span style={{width: "16px"}}></span>
                      <span className='userData'>
                        {creator.avatar_file_url && creator.avatar_file_url.length > 0 ? (<img src={creator.avatar_file_url} alt={creator.username} />) : ""}
                        <span>{creator.username}</span>
                      </span>
                      <FontAwesomeIcon icon="circle-chevron-right" />
                    </div>
                    )
                  })
                  :
                  ""
                }
                </div>
              </div>
              )
              :
              extras && extras.selectedCreator
              ?
                (
                  <div className="setting">
                    <div className="pageButton" onClick={(e) => {
                      dispatch(unselectCreator());
                      setTimeout(() => {
                        navigate('/dashboard/admin/creators');
                      }, 250);
                    }}>
                      <FontAwesomeIcon icon="circle-chevron-left" />
                      <span>{extras.selectedCreator.username} ({extras.totalNoOfCreatorWalls})</span>
                      <span style={{width: "16px"}}></span>
                    </div>
                    <button 
                        disabled={error}
                        className="settingButton success" 
                        onClick={async (e) => {
                          e.preventDefault();
                        }}
                        style={{ marginTop: "1rem" }}
                      >Edit Creator
                    </button>
                    <button 
                        disabled={error}
                        className="settingButton danger" 
                        onClick={async (e) => {
                          e.preventDefault();
                        }}
                      >Delete Creator
                    </button>
                    <div className="wallpapers">
                      <div className="wallpaperGrid">
                        {
                          extras.selectedCreator.walls &&
                          extras.selectedCreator.walls.length > 0 &&
                          extras.selectedCreator.walls.map((wall, index) => {
                            return (
                              <div key={wall._id} id={wall._id} className={`wallpaper wall-${index + 1}`} onClick={(e) => {
                                e.preventDefault();
                                dispatch(loadSelectedWallAsync({wallId: wall._id}));
                              }}>
                                <img src={wall.thumbnail_url} alt={wall.file_name} />
                                <div className="dataInfo">
                                  <div className="data likes">
                                    <div className="icon">
                                      <FontAwesomeIcon icon="heart" />
                                    </div>
                                    <div className="info">{ wall.timesFavourite }</div>
                                  </div>
                                  <div className="data downloads">
                                    <div className="icon">
                                      <FontAwesomeIcon icon='download' />
                                    </div>
                                    <div className="info">{ wall.timesDownloaded }</div>
                                  </div>
                                </div>
                                <span>{ wall.file_name }</span>
                              </div>
                            )
                          })
                        }
                        <Waypoint scrollableAncestor={window} onEnter={({ previousPosition, currentPosition, event }) => {
                          if (extras.selectedCreator.walls.length < extras.totalNoOfCreatorWalls) {
                            dispatch(getCreatorByIdAsync({ userId: extras.selectedCreator._id, page: extras.creatorWallsPage }));
                          }
                        }} />
                      </div>
                    </div>
                  </div>
                )
              :
                ""
            :
            ""
          :
          ""
        }
        {
          page.filter(val => val.active)[0].name === "Admin"
          ?
            location.pathname === "/dashboard/admin/invites"
            ?
            (
            <div className="setting">
              <div className="pageButton" onClick={(e) => navigate('/dashboard/admin')}>
                <FontAwesomeIcon icon="circle-chevron-left" />
                <span>Invitation Codes</span>
                <span style={{width: "16px"}}></span>
              </div>
            </div>
            )
            :
            ""
          :
          ""
        }
    </div>
  )
}

export default Home