import { useCallback, useRef } from 'react'
import cx from 'classnames'
import TextArea from './TextArea'
import { renamePriceCol } from '../utils'
import CSVReader from 'react-csv-reader'

const ParseCsv = ({ setData }) => {
  const inputRef = useRef(null)

  const parseTypes = {
    通用: {
      handleParseCSV: (context) => {
        if (!context) return
        const newData = context.filter((datum, index) => {
          return ![0, 1, 2, 3, 4].includes(index) && datum.filter(d => !!d).length > 0
        })
        const parseCol = (col, index, row) => {
          switch (index) {
            default: {
              return col.replace('.TW', '')
            }
          }
        }
        const rowData = newData.map((row) => {
            return row.filter((d, i) => ![4].includes(i)).map((col, i) => parseCol(col, i, row))
          })
        setData({
          date: context[1][0],
          headers: context[3].map((header) => header.replace(/\t/, '')).filter((d, i) => ![4].includes(i)).map((header, i) => {
            if (i === 2) return renamePriceCol
            return header
          }),
          rows: rowData,
          rowClass: rowData.map((row) => {
            const value = parseFloat(row[3].replace(/"/g, ''))
            return cx('border-b', {
              'bg-red-600 text-white': value >= 7,
              'bg-red-100': value > 0 && value < 7,
              'bg-green-100': value < 0 && value > -7,
              'bg-green-600 text-white': value < -7,
            })
          }
          )
        })
      }
    },
    價值投資: {
      handleParseCSV: (context) => {
        if (!context) return
        const newData = context.filter((datum, index) => {
          return ![0, 1, 2, 3, 4].includes(index) && datum.filter(d => !!d).length > 0
        })
        const parseCol = (col, index, row) => {
          switch (index) {
            default: {
              return col.replace('.TW', '')
            }
          }
        }
        setData({
          date: context[1][0],
          headers: context[3].map((header) => header.replace(/\t/, '')).map((header, i) => {
            return header
          }),
          rows: newData.map((row) => {
            return row.map((col, i) => parseCol(col, i, row))
          })
        })
      }
    },
  }

  const handleReader = (csv) => {
    inputRef.current.value = csv.join("\n")
  }

  const handleParse = useCallback((mode) => {
    if (!inputRef.current.value) return
    parseTypes[mode].handleParseCSV(inputRef.current.value.split("\n").map(row => row.split(",")))
  }, [parseTypes])

  return (
    <div className="flex justify-content-center flex-col">
      <div className='m-2.5 flex'>
        <button
          className='mr-2.5 px-5 py-2.5 bg-[#1da1f2] text-white rounded'
          onClick={async (e) => {
            const copiedText = await navigator.clipboard.readText()
            inputRef.current.value = copiedText
          }}
        >
          貼上
        </button>
        <CSVReader
          onFileLoaded={handleReader}
          // fileEncoding='big5'
        />
      </div>
      <div className="my-2.5 mx-2.5 flex gap-x-5">
        {
          Object.keys(parseTypes).map((mode) => (
            <button
              key={mode}
              className='px-5 py-2.5 bg-[#1da1f2] text-white rounded'
              onClick={(e) => handleParse(mode, e)}
            >
              {mode}
            </button>
          ))
        }
      </div>
      <div className='m-2.5'>
        <TextArea inputRef={inputRef}  />
      </div>
    </div>
  )
}

export default ParseCsv
