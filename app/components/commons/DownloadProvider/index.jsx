import React, { createContext, useContext, useRef, useCallback } from 'react'
import html2canvas from 'html2canvas'
import PngBtn from './PngBtn'

const DownloadContext = createContext(null);

export const useDownloadContext = () => useContext(DownloadContext)
export { PngBtn }

const DownloadProvider = ({ children, filename }) => {
  const downloadContextRef = useRef()
  const filenameRef = useRef(filename)

  const handleDownload = useCallback(async () => {
    const element = downloadContextRef.current;
    const canvas = await html2canvas(element);

    const file = canvas.toDataURL('image/jpg');
    const link = document.createElement('a');

    if (typeof link.download === 'string') {
      link.href = file;
      link.download = filenameRef.current;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      if (window) {
        window.open(file);
      }
    }
  }, [])

  return (
    <DownloadContext.Provider value={{ handleDownload, filenameRef }}>
      <div ref={downloadContextRef}>
        {children}
      </div>
    </DownloadContext.Provider>
  )
}

export default DownloadProvider
