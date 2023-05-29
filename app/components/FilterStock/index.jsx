import { useState } from 'react'
import _ from 'lodash'

import ParseCsv from './components/ParseCsv'
import TableDownloader from './components/TableDownloader'

const initData = {
  title: '',
  filename: '',
  date: '',
  headers: [],
  rows: [[]],
}

const FilterStock = () => {
  const [data, setData] = useState(initData)

  return (
    <>
      <div className="grid grid-cols-2 divide-x">
        <TableDownloader data={data} />
        <ParseCsv setData={setData} />
      </div>
    </>
  )
}

export default FilterStock
