import React, { createContext, useContext } from 'react'
import WaterMark from 'watermark-component-for-react';

const WaterMarkContext = createContext(null);

export const useWaterMarkContext = () => useContext(WaterMarkContext)

const WaterMarkProvider = ({ children, content = `🪙 Dr.Provision🪙` }) => {
  return (
    <WaterMarkContext.Provider value={{}}>
      <WaterMark content={content} font='40px Microsoft Yahei'>
        {children}
      </WaterMark>
    </WaterMarkContext.Provider>
  )
}

export default WaterMarkProvider
