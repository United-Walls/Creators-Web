import React from 'react'
import ReactLoading from 'react-loading'
import './Loading.css'

const Loading = () => {
  return (
    <div className='loading'>
        <ReactLoading type='spinningBubbles' color='#C6D0F5'/>
    </div>
  )
}

export default Loading