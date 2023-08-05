import React, { useEffect, useRef, useState } from 'react'
import './Home.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {ReactComponent as ThreadsIcon} from '../../assets/icons/threads.svg';
import { useDispatch, useSelector } from 'react-redux';
import { loadSelectedWallAsync, loadWallsAndUserAsync, toggleSidebar, updateProfileAsync, updateProfilePicAsync } from '../../features/dashboard/dashboardSlice';
import { hasWhiteSpace, isValidUrl } from '../..';
import { hideToast, showToast } from '../../features/toast/toastSlice';
import { useLocation } from 'react-router-dom';
import { makeActive } from '../../features/page/pageSlice';
import { Waypoint } from 'react-waypoint';
import Loading from '../../components/Loading/Loading';

const Home = () => {
  const userData = useSelector(state => ({username: state.dashboard.username, description: state.dashboard.description, id: state.auth.user.id, userPfp: state.dashboard.avatar_file_url, totalNoOfWalls: state.dashboard.totalNumberOfWalls, totalNoOfDownloadedWalls: state.dashboard.totalNumberOfDownloadedWalls, totalNoOfLikedWalls: state.dashboard.totalNumberOfLikedWalls, donationLinks: state.dashboard.donationLinks, socialMediaLinks: state.dashboard.socialMediaLinks}));

  const wallData = useSelector(state => state.dashboard.walls);
  const wallPage = useSelector(state => state.dashboard.page);
  const [walls, setWalls] = useState();

  useEffect(() => {
    setWalls(state => wallData);
  }, [wallData]);

  const fileRef = useRef(null);
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

  const [addOtherSocialLinkActive, setAddOtherSocialLinkActive] = useState(false);
  const [addOtherDonationLinkActive, setAddOtherDonationLinkActive] = useState(false);
  const [otherSocialLink, setOtherSocialLink] = useState({title: "", link: ""});
  const [otherDonationLink, setOtherDonationLink] = useState({title: "", link: ""});
  const [errors, setErrors] = useState([]);

  const [loadingPics, setLoadingPics] = useState(true);

  const urls = ["", ""];

  const counter = useRef(0);

  const imageLoaded = () => {
    counter.current += 1;
    if (counter.current >= urls.length) {
      setLoadingPics(false);
    }
  }
  
  useEffect(() => {
    window.scrollTo(0, 0);
    switch(location.pathname) {
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
  }, [location, dispatch]);

  useEffect(() => {
    console.log(uploadProfilePic);
  }, [uploadProfilePic]);

  useEffect(() => {
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
  }, [textInputs])

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
        e.preventDefault();
        if (sidebarOpened) {
          dispatch(toggleSidebar());
        }
      }}
      style={{cursor: `${sidebarOpened ? "pointer" : "default"}`}}
    >
      { 
      loadingPics
      ?
      <Loading />
      :
      ""
      }
      <div className="headerImage">
          {
          walls && walls.length > 0
          ?
          <img className={loadingPics ? 'loading' : undefined} src={walls[0].file_url} alt={walls[0].file_name} onLoad={imageLoaded} />
          :
          ""
          }
      </div>
      <div className="userHeader">
        <div className="userPfp">
          <img className={loadingPics ? 'loading' : undefined} src={userData.userPfp} alt={userData.username} onLoad={imageLoaded} />
        </div>
        <div className={`userInfo${loadingPics ? ' loadingImage' : ""}`}>
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
                      console.log("File(s) dropped");
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
                        console.log("File(s) in drop zone");

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
                <button className='settingButton success' type='submit'>Save</button>
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
                  console.log(walls.length < userData.totalNoOfWalls, walls.length, userData.totalNoOfWalls);
                  console.log("Get more walls");
                  dispatch(loadWallsAndUserAsync({ userId: userData.id, page: wallPage }));
                }
              }} />
            </div>
          )
          :
          ""
        }
    </div>
  )
}

export default Home