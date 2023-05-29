import { useMemo } from 'react'
import PropTypes from 'prop-types'
import BaseTable, { Column } from 'react-base-table'
import 'react-base-table/styles.css'
import _ from 'lodash'

const ReactBaseTable = ({ data }) => {
  // const columns = generateColumns(10, undefined, { sortable: true })
  // const data = generateData(columns, 200)

  // const defaultSort = {
  //   'column-0': SortOrder.ASC,
  //   'column-1': SortOrder.DESC,
  //   'column-2': SortOrder.ASC,
  // }

  // const onColumnSort = ({ key, order }) => {
  //   const { data, sortState } = this.state
  //   this.setState({
  //     // clear the sort state if the previous order is desc
  //     sortState: {
  //       ...sortState,
  //       [key]: sortState[key] === SortOrder.DESC ? null : order,
  //     },
  //     data: this.state.data.reverse(),
  //   })
  // }

  const rows = useMemo(() => {
    const { headers, rows } = data
    return _.transform(rows, (result, row) => {
      const datum = _.transform(row, (fields, col, index) => {
        fields[headers[index]] = col.replace('.TW', '')
      }, {})
      result.push(datum)
    }, [])
  }, [data])

  return (
     <div className='mx-auto'>
      <div className="mt-5 flex flex-col text-center">
        { data.date }
        <BaseTable data={rows} width={1000} height={400}>
          {
            data.headers.map((header, index) => (
              <Column key={header} dataKey={header} width={0} flexGrow={1}>{header}</Column>
            ))
          }
        </BaseTable>
      </div>
      <div className='flex justify-content-end'>
        <span>方向搭配技術分析僅供參考，盈虧自負。</span>
      </div>
    </div>
    // <Table
    //     fixed
    //     columns={columns}
    //     data={data}
    //     sortState={this.state.sortState}
    //     onColumnSort={this.onColumnSort}
    //   />

  )
}

ReactBaseTable.propTypes = {
  data: PropTypes.object,
}

export default ReactBaseTable
