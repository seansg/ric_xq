import PropTypes from 'prop-types'
import { useState } from 'react'
import WaterMarkProvider from '~/components/commons/WaterMarkProvider'
import { useRef } from 'react'
import _ from 'lodash'
import { useDownloadContext, PngBtn } from '~c/DownloadProvider'
import TitleField from './TitleField'
import lodash from 'lodash'

const HtmlTable = ({ data }) => {
  const [selectTitle, setSelectTitle] = useState('')
  const tableRef = useRef(null)
  const { handleDownload, filenameRef } = useDownloadContext()
  const todayDate = new Date().toISOString().slice(0, 10).replaceAll('-', '');
  filenameRef.current = `${['Ric', todayDate, selectTitle].filter((v) => !lodash.isEmpty(v)).join('_')}`

  return (
    <div className="flex justify-content-center flex-col">
      <PngBtn onClick={handleDownload} />
      <div className='mx-5 mb-2.5'>
       <TitleField onChange={setSelectTitle} />
      </div>

      <div className='mx-auto' key={new Date().getTime()}>
        <div className="flex flex-col text-center" style={{ backgroundColor: '#d6d6d6'}} ref={tableRef}>
          <div>{selectTitle}</div>
          <div className='mb-2.5'>{ data.date }</div>

          <WaterMarkProvider>
              <table className="w-full text-sm text-left text-black-50">
              <thead className='text-xs text-white uppercase bg-gray-50 dark:bg-gray-700'>
                  <tr>
                    {
                      data.headers.map((header) => (
                        <th key={header} className='p-2.5 text-center'>{header}</th>
                      ))
                    }
                  </tr>
                </thead>
                <tbody>
                    {
                      data.rows.map((row, index) => (
                        <tr key={index} className={data.rowClass && data.rowClass[index]}>
                          {
                            row.map((col, i) => (
                              <td className='p-2.5 text-center' key={col}>{col}</td>
                            ))
                          }
                        </tr>
                      ))
                    }
                </tbody>
              </table>
          </WaterMarkProvider>
          <div className='flex justify-end mb-2'>
            <span>方向搭配技術分析僅供參考，盈虧自負。</span>
          </div>
        </div>
      </div>
    </div>
  )
}

HtmlTable.defaultProps = {
  parseCol: (v) => v,
}

HtmlTable.propTypes = {
  data: PropTypes.object,
  tableRef: PropTypes.object.isRequired,
  parseCol: PropTypes.func,
}

export default HtmlTable
