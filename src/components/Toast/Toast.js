import React from 'react'
import { useSelector } from 'react-redux'
import './Toast.css'

const Toast = () => {
    const toastData = useSelector(state => state.toast);
    
    return (
        <div className={`${toastData.status !== 'idle' ? toastData.status === 'success' ? "toast success" : "toast error" : "toast"}`}>
            { toastData.message }
        </div>
    )
}

export default Toast