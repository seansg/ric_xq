import { useCallback, useState, useRef } from 'react'
import CSVReader from 'react-csv-reader'
import lodash from 'lodash'
import Papa from 'papaparse'
import dealAmount from './data/dealAmount'
import DownloadProvider from '~c/DownloadProvider'
import Chart from './Chart'
import { toDecimal } from '~/utils';

// const res = await axios.get('https://www.twse.com.tw/pcversion/exchangeReport/BFIAMU?date=20230523')
//const { data } = await axios.get('https://www.twse.com.tw/exchangeReport/MI_INDEX?date=20230524&type=MS&response=json')

const calculCashDirectRatio = (csv, { name }) => {
  const filtered = csv.filter((r, i) => ![0, 1, 32, 33, 34, 35].includes(i))
  console.log(filtered, name, dealAmount[name])
  const total = toDecimal(dealAmount[name])

  filtered.forEach(row => {
    row.push(total.toString())
    row.push(toDecimal(row[2]).div(total).times(100).toString())
  })
  return filtered
}

const CashDirectRatio = () => {
  const [stat, setStat] = useState([])
  const inputRef = useRef(null)
  const totalDays = useRef(0)

  const handleReader = useCallback(async (csv, fileInfo, file) => {
    const curData = calculCashDirectRatio(csv, file)
    const cur = lodash.transform(curData, (sub, row) => {
      sub[row[0]] = row[row.length - 1]
      return sub
    }, {})

    const colorBar = lodash.transform(curData, (obj, row) => {
      obj[row[0]] = row[4] > 0 ? '#ff0000' : '#008000'
      return obj
    }, {})

    if (inputRef.current) {
      const results = await Promise.all(Array.from(inputRef.current.files).map(file =>
        new Promise((resolve) => {
          return Papa.parse(file, {
            encoding: 'big5',
            download: true,
            complete: (input) => {
              const records = input.data;
              const r = calculCashDirectRatio(records, file)
              resolve(r)
            }
          })
        })))
      totalDays.current = results.length

      const trans = results.map((result => lodash.transform(result, (sub, row) => {
        sub[row[0]] = row[row.length - 1]
        return sub
      }, {})))
      console.log('trans', trans)
      const sum = lodash.transform(trans, (obj, tran) => {
        Object.keys(tran).forEach(k => {
          if (!obj[k]) obj[k] = toDecimal('0')
          obj[k] = obj[k].add(toDecimal(tran[k]))
        })
        return obj
      }, {})
      console.log('sum', sum)

      const avg = lodash.transform(Object.keys(sum), (obj, k) => {
        obj[k] = sum[k].div(results.length)
      }, {})
      // console.log(avg)

      const dif = lodash.transform(Object.keys(avg), (obj, k) => {
        const val = toDecimal(cur[k]).minus(avg[k]).div(avg[k]).times(100)
        if (Math.abs(val) > 10) {
          obj[k] = val
        }
      }, {})

      const sorted = Object.entries(dif).sort((a, b) => b[1] - a[1]);

      const sortedTrans = lodash.transform(sorted, (ary, row) => {
        ary.push({
          key: row[0].replace('類指數', ''),
          value: row[1],
          color: colorBar[row[0]]
        })
        return ary
      }, [])
      console.log(sortedTrans)
      setStat(sortedTrans)
    }

  }, [])

  const todayDate = new Date().toISOString().slice(0, 10).replaceAll('-', '');

  const filename = `${todayDate} 近${totalDays.current}日成交比重差 %`

  const data = {
    datasets: [
      {
        label: filename,
        data: stat,
        parsing: {
          xAxisKey: 'value',
          yAxisKey: 'key',
        },
        backgroundColor: (context) => {
          return context.raw.color
        },
      },
    ],
  };

  return (
    <>
      <input name='files' ref={inputRef} type='file' multiple="multiple" />
      <CSVReader
        onFileLoaded={handleReader}
        fileEncoding='big5'
      />
      {
        stat.length > 0 &&
        <DownloadProvider filename={filename}>
          <Chart data={data} />
        </DownloadProvider>
      }
    </>
  )
}

export default CashDirectRatio
