import PropTypes from 'prop-types'
import { useState } from 'react'
import WaterMarkProvider from '~/components/commons/WaterMarkProvider'

const HtmlTable = ({ data, tableRef, title }) => {
  const [selectTitle, setSelectTitle] = useState('')

  return (
    <>
      <select onChange={(e) => setSelectTitle(e.target.value)}>
        <option></option>
        <option>激戰區-百元</option>
        <option>激戰區-非百元</option>
        <option>上班族首選-多排</option>
        <option>成長型-價投</option>
      </select>
      <div className='mx-auto' key={new Date().getTime()}>
        <div className="flex flex-col text-center" style={{ backgroundColor: '#d6d6d6'}} ref={tableRef}>
          <div>{title} {selectTitle}</div>
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

    </>
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
