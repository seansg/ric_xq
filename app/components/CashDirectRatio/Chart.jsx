import React from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import WaterMarkProvider from '~/components/commons/WaterMarkProvider'
import { useDownloadContext, PngBtn } from '~c/DownloadProvider'
import { options } from './config'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Chart = ({ data }) => {
  const { handleDownload, downloadContextRef } = useDownloadContext()

  return (
    <>
      <PngBtn onClick={handleDownload} />
      <div ref={downloadContextRef}>
        <WaterMarkProvider>
          <div className='h-screen'>
            <Bar options={options} data={data} />
          </div>
        </WaterMarkProvider>
      </div>
    </>
  )
}

export default Chart
