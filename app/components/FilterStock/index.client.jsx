import { useState } from 'react'
import _ from 'lodash'

import ParseCsv from './components/ParseCsv'
import HtmlTable from './components/HtmlTable'
import DownloadProvider from '../commons/DownloadProvider'

const initData = {
  date: '',
  headers: [],
  rows: [[]],
}

const FilterStock = () => {
  const [data, setData] = useState(initData)

  return (
    <>
      <div className="grid grid-cols-2 divide-x">
        <DownloadProvider>
          <HtmlTable data={data} />
        </DownloadProvider>
        <ParseCsv setData={setData} />
      </div>
    </>
  )
}

export default FilterStock
