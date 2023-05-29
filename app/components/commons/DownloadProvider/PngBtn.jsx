import React from 'react'

const PngBtn = ({ onClick }) => {
  return (
    <div className='m-2.5'>
      <button className='px-5 py-2.5 bg-[#1da1f2] text-white rounded' onClick={onClick}>to JEPG</button>
    </div>
  )
}

export default PngBtn
