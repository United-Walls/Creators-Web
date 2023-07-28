import React, { useState } from 'react'
import './Home.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {ReactComponent as ThreadsIcon} from '../../assets/icons/threads.svg';

const Home = ({ walls, username, userPfp, totalNoOfWalls }) => {
  const [textInputs, setTextInputs] = useState({ 
                                        username: username, 
                                        twitter: "", 
                                        instagram: "", 
                                        facebook: "", 
                                        mastodon: "", 
                                        threads: "", 
                                        steam: "", 
                                        linkedIn: "",
                                        link: "",
                                        other: [],
                                        paypal: "",
                                        patreon: "" ,
                                        otherdonations: []
                                      });

  const handleInputChange = (e) => {
    setTextInputs((state) => {
      return { ...state, [e.target.name]: e.target.value }
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault();
  }

  return (
    <div className="home">
        <div className="headerImage">
            <img src={walls[0].file_url} alt={walls[0].file_name} />
        </div>
        <div className="userHeader">
          <div className="userPfp">
            <img src={userPfp} alt={username} />
          </div>
          <div className="userInfo">
            <div className="username">@{username}</div>
            <div className="userDetails">
              <div className="userDetail">
                <div className="title">Wallpapers</div>
                <div className="data">{totalNoOfWalls}</div>
              </div>
              <div className="userDetail">
                <div className="title">Liked</div>
                <div className="data">{0}</div>
              </div>
              <div className="userDetail">
                <div className="title">Downloaded</div>
                <div className="data">{0}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="userSettings">
          <form onSubmit={handleSubmit}>
            <div className="setting">
              <div className="settingTitle">Edit Username</div>
              <div className="settingInfo">Change your username</div>
              <div className="inputContainer">
                <div className="icon"><FontAwesomeIcon icon="user" /></div>
                <input placeholder='Username' type="text" name='username' className="settingInput" value={textInputs.username} onChange={handleInputChange} />
              </div>
            </div>
            <div className="setting">
              <div className="settingTitle">Add/Edit Profile Pic</div>
            </div>
            <div className="setting">
              <div className="settingTitle">Add/Edit Social Media Links</div>
              <div className="settingInfo">Add/Change your social media links</div>
              <div className="inputContainer">
                <div className="icon"><FontAwesomeIcon icon={['fab', 'twitter']} /></div>
                <input placeholder='Twitter' type="text" name='twitter' className="settingInput" value={textInputs.twitter} onChange={handleInputChange} />
              </div>
              <div className="inputContainer">
                <div className="icon"><FontAwesomeIcon icon={['fab', 'instagram']} /></div>
                <input placeholder='Instagram' type="text" name='instagram' className="settingInput" value={textInputs.instagram} onChange={handleInputChange} />
              </div>
              <div className="inputContainer">
                <div className="icon"><FontAwesomeIcon icon={['fab', 'facebook']} /></div>
                <input placeholder='Facebook' type="text" name='facebook' className="settingInput" value={textInputs.facebook} onChange={handleInputChange} />
              </div>
              <div className="inputContainer">
                <div className="icon"><FontAwesomeIcon icon={['fab', 'mastodon']} /></div>
                <input placeholder='Mastodon' type="text" name='mastodon' className="settingInput" value={textInputs.mastodon} onChange={handleInputChange} />
              </div>
              <div className="inputContainer">
                <div className="icon"><ThreadsIcon style={{ width: "25px", fill: "var(--textColor)"}} /></div>
                <input placeholder='Threads' type="text" name='threads' className="settingInput" value={textInputs.threads} onChange={handleInputChange} />
              </div>
              <div className="inputContainer">
                <div className="icon"><FontAwesomeIcon icon={['fab', 'steam']} /></div>
                <input placeholder='Steam' type="text" name='steam' className="settingInput" value={textInputs.steam} onChange={handleInputChange} />
              </div>
              <div className="inputContainer">
                <div className="icon"><FontAwesomeIcon icon={['fab', 'linkedin']} /></div>
                <input placeholder='LinkedIn' type="text" name='linkedIn' className="settingInput" value={textInputs.linkedIn} onChange={handleInputChange} />
              </div>
              <div className="inputContainer">
                <div className="icon"><FontAwesomeIcon icon="link" /></div>
                <input placeholder='Link' type="text" name='link' className="settingInput" value={textInputs.link} onChange={handleInputChange} />
              </div>
            </div>
            <div className="setting">
              <div className="settingTitle">Add/Edit Donation Links</div>
              <div className="settingInfo">Add/Change your donation links</div>
              <div className="inputContainer">
                <div className="icon"><FontAwesomeIcon icon={['fab', 'paypal']} /></div>
                <input placeholder='Paypal' type="text" name='paypal' className="settingInput" value={textInputs.paypal} onChange={handleInputChange} />
              </div>
              <div className="inputContainer">
                <div className="icon"><FontAwesomeIcon icon={['fab', 'patreon']} /></div>
                <input placeholder='Patreon' type="text" name='patreon' className="settingInput" value={textInputs.patreon} onChange={handleInputChange} />
              </div>
            </div>
            <button className='settingButton' type='submit'>Save</button>
          </form>
        </div>
    </div>
  )
}

export default Home