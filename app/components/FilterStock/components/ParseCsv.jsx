import { useCallback, useRef } from 'react'
import cx from 'classnames'
import TextArea from './TextArea'
import { kdTrans, renameWaveCol, renamePriceCol } from '../utils'
import CSVReader from 'react-csv-reader'

const ParseCsv = ({ setData }) => {
  const inputRef = useRef(null)

  const todayDate = new Date().toISOString().slice(0, 10).replaceAll('-', '');


  const parseTypes = {
    DayTrading: {
      handleParseCSV: (context) => {
        if (!context) return
        const newData = context.filter((datum, index) => {
          //return ![0, 1, 2, 3, 4].includes(index) && datum[7] !== '沒方向' && datum.filter(d => !!d).length > 0
          return ![0, 1, 2, 3, 4].includes(index) && datum.filter(d => !!d).length > 0
        })
        const parseCol = (col, index, row) => {
          switch (index) {
            case 7: {
              return kdTrans(col, row[3])
            }
            default: {
              return col.replace('.TW', '')
            }
          }
        }
        const rowData = newData.map((row) => {
            return row.filter((d, i) => ![4].includes(i)).map((col, i) => parseCol(col, i, row))
          })
        setData({
          title: '',
          filename: `Ric_${todayDate}_daytrading`,
          date: context[1][0],
          headers: context[3].map((header) => header.replace(/\t/, '')).filter((d, i) => ![4].includes(i)).map((header, i) => {
            if (i === 2) return renamePriceCol
            //if (i === 3) return renameWaveCol
            return header
          }),
          rows: rowData,
          rowClass: rowData.map((row) => {
            return cx('border-b', {
                      'bg-red-600 text-white': Number(row[3]) >= 7,
                      'bg-red-100':  Number(row[3]) > 0 &&  Number(row[3]) < 7,
                      'bg-green-100':  Number(row[3]) < 0 &&  Number(row[3]) > -7,
                      'bg-green-600 text-white':  Number(row[3]) < -7,
                    })}
          )
        })
      }
    },
    ShortBand: {
      handleParseCSV: (context) => {
        if (!context) return
        const newData = context.filter((datum, index) => {
          return ![0, 1, 2, 3, 4].includes(index) && datum.filter(d => !!d).length > 0
        })
        const parseCol = (col, index, row) => {
          switch (index) {
            case 6: {
              return kdTrans(col, row[3])
            }
            default: {
              return col.replace('.TW', '')
            }
          }
        }
        setData({
          title: '多頭排列組合-短波段選股策略',
          filename: `Ric_${todayDate}_shortband`,
          date: context[1][0],
          headers: context[3].map((header) => header.replace(/\t/, '')).map((header, i) => {
            if (i === 3) return renameWaveCol
            return header
          }),
          rows: newData.map((row) => {
            return row.map((col, i) => parseCol(col, i, row))
          })
        })
      }
    },
    ValueInvesting: {
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
          title: '價投-中長線篩選條件',
          filename: `Ric_${todayDate}_valueInvesting`,
          date: context[1][0],
          headers: context[3].map((header) => header.replace(/\t/, '')).map((header, i) => {
            //if (i === 3) return renameWaveCol
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
      <div className='m-2.5'>
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
        <button
          className='px-5 py-2.5 bg-[#1da1f2] text-white rounded'
          onClick={async (e) => {
            const copiedText = await navigator.clipboard.readText()
            inputRef.current.value = copiedText
          }}
        >
          FromCliboard
        </button>
      </div>
      <div className='m-2.5'>
        <TextArea inputRef={inputRef}  />
      </div>
    </div>
  )
}

export default ParseCsv
