import React from 'react'
import { ToastContainer, Zoom } from 'react-toastify';

const Toastify = () => {
  return (
    <div>
      <ToastContainer
      position="top-center"
      autoClose={2000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick={false}
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
      transition={Zoom}
    />
    </div>
  )
}

export default Toastify
