import { useCallback, useState, useRef } from 'react'
import lodash from 'lodash'
import DownloadProvider from '~c/DownloadProvider'
import Chart from './Chart'
import { toDecimal } from '~/utils';
import axios from 'axios'
import DatePicker from '~c/DatePicker';

const calculCashDirectRatio = (csv, date, dealAmount ) => {
  const total = toDecimal(dealAmount[date])

  csv.forEach(row => {
    row.push(total.toString())
    row.push(toDecimal(row[2]).div(total).times(100).toString())
  })
  return csv
}

const todayDate = new Date().toISOString().slice(0, 10).replaceAll('-', '')

const getTotalAmount = async (closeDays, curDate) => {
  const dataset = {}
  console.log(curDate)
  let i = 0
  while (Object.keys(dataset).length < closeDays) {
    const { data } = await axios(`/api/v1/mi-index/${curDate - i}`)
    if (data.date) {
      dataset[data.date] = toDecimal(data.data7[0][1]).toString()
    }
    i++
  }
  return dataset
}

const getTotalStocks = async (closeDays, curDate) => {
  const dealAmount = await getTotalAmount(closeDays, curDate)
  const dataset = {}
  let i = 0
  while (Object.keys(dataset).length < closeDays) {
    const { data } = await axios(`/api/v1/bfiamu/${curDate - i}`)
    if (data.date) {
      dataset[data.date] = calculCashDirectRatio(data.data, data.date, dealAmount)
    }
    i++
  }
  return dataset
}

const CashDirectRatio = () => {
  const latestDateRef = useRef(todayDate)
  const [curDate, setCurDate] = useState(todayDate)
  const [stat, setStat] = useState([])
  const [closeDays, setCloseDays] = useState(3)
  const handleChangeDays = useCallback((e) => {
    setCloseDays(e.target.value)
  }, [])

  const onClick = useCallback(async () => {
    const stocks = await getTotalStocks(closeDays, curDate)
    latestDateRef.current = lodash.max(Object.keys(stocks))

    const curData = stocks[latestDateRef.current]
    const cur = lodash.transform(curData, (sub, row) => {
      sub[row[0]] = row[row.length - 1]
      return sub
    }, {})

    const colorBar = lodash.transform(stocks[latestDateRef.current], (obj, row) => {
      obj[row[0]] = row[4] > 0 ? '#ff0000' : '#008000'
      return obj
    }, {})

    const trans = Object.keys(stocks).sort().map((date => lodash.transform(stocks[date], (sub, row) => {
      sub[row[0]] = row[row.length - 1]
      return sub
    }, {})))

    const sum = lodash.transform(trans, (obj, tran) => {
      Object.keys(tran).forEach(k => {
        if (!obj[k]) obj[k] = toDecimal('0')
        obj[k] = obj[k].add(toDecimal(tran[k]))
      })
      return obj
    }, {})


    const avg = lodash.transform(Object.keys(sum), (obj, k) => {
      obj[k] = sum[k].div(closeDays)
    }, {})

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
    setStat(sortedTrans)
  }, [closeDays, curDate])

  const filename = `${latestDateRef.current} 近${closeDays}日成交比重差 %`

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
    <div className='m-5'>
      <div className='flex items-center text-5xl font-extrabold'>成交比重差</div>
      <div className='m-5 w-100 flex items-end'>
        <div className='mr-2.5'>
          <label className="block mb-2 text-sm font-medium text-gray-900">日期</label>
          <DatePicker
            onChange={(date) => {
              date.setMinutes(new Date().getMinutes())
              date.setHours(new Date().getHours())
              setCurDate(date.toISOString().slice(0, 10).replaceAll('-', ''))
            }}
          />
        </div>
        <div>
          <label htmlFor="days" className="block mb-2 text-sm font-medium text-gray-900">近幾日</label>
          <input type="number" id="days"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="3"
            step='1'
            min='1'
            required
            onChange={handleChangeDays}
            value={closeDays}
          />
        </div>
        <div className='m-2.5 mb-0'>
          <button className='px-5 py-2.5 bg-[#1da1f2] text-white rounded' onClick={onClick}>Fetch Data</button>
        </div>
      </div>
      {
        stat.length > 0 &&
        <DownloadProvider filename={filename}>
          <Chart data={data} />
        </DownloadProvider>
      }
    </div>
  )
}

export default CashDirectRatio
