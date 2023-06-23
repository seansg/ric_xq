import { useState, useCallback } from 'react'
import axios from 'axios'
import _ from 'lodash'
import Decimal from 'decimal.js'
import classnames from 'classnames'

const stringifyDate = (date) => date.toISOString().slice(0, 10).replaceAll('-', '')

const avgDays = 20

// [date, open, high, low, close]
const parseHistory = (data) => {
  const ary = []
  const cloneData = _.cloneDeep(data)
  while (ary.length < data.length) {
    const row = cloneData.pop()
    const historyDate = row[0].split('/')
    const rocYear = historyDate.shift()
    historyDate.unshift(Number(rocYear) + 1911)
    ary.push([historyDate.join(''), row[3], row[4], row[5], row[6]])
  }
  return ary
}

const getStockHistory = async (stock, date) => {
  const resTwse = await axios(`/api/v1/twse/exchangeReport/stock_day/${stock}/${date}`)
  if (resTwse.data.stat === 'OK') {
    return parseHistory(resTwse.data.data)
  }

  const resTpex = await axios(`/api/v1/tpex/daily_trading_info/${stock}/${date}`)
  if (!_.isEmpty(resTpex.data.aaData)) {
    return parseHistory(resTpex.data.aaData)
  }

  return []
}

const getStockDatePrices = async (stock) => {
  const datePrice = []
  const todayDate = stringifyDate(new Date())
  datePrice.push(await getStockHistory(stock, todayDate))

  if (datePrice[0].length < avgDays) {
    await new Promise(resolve => setTimeout(resolve, 6000))
    const lastMonDate = new Date();
    lastMonDate.setDate(10);
    lastMonDate.setMonth(lastMonDate.getMonth() - 1);
    datePrice.push(await getStockHistory(stock, stringifyDate(lastMonDate)))
  }

  return datePrice.flat()
}

const calMonthAvg = (rows, currentPrice, currentDate) => {
  return _.reduce(rows, (ary, row) => {
    if (row[0] === currentDate) return ary
    if (ary.length === avgDays - 1) return ary

    ary.push(new Decimal(row[4]))
    return ary
  }, []).reduce((sum, close) => sum.add(close)).add(new Decimal(currentPrice)).div(avgDays)
}

const calHightest = (rows, currentHigh) => {
  const highAry = _.reduce(rows, (ary, row) => {
    ary.push(row[2])
    return ary
  }, [])
  highAry.push(currentHigh)
  return _.max(highAry)
}

// 股票資訊
// c：股票代號，ex. 1101
// ch：Channel，ex. 1101.tw
// ex：上市或上櫃，ex.tse
// n：股票名稱，ex.台泥
// nf：似乎為全名，ex.台灣水泥股份有限公司
// 即時交易資訊
// z：最近成交價，ex. 42.85
// tv：Temporal Volume，當盤成交量，ex. 1600
// v：Volume，當日累計成交量，ex. 11608
// a：最佳五檔賣出價格，ex. 42.85_42.90_42.95_43.00_43.05_
// f：最價五檔賣出數量，ex. 83_158_277_571_233_
// b：最佳五檔買入價格，ex. 42.80_42.75_42.70_42.65_42.60_
// g：最佳五檔買入數量，ex. 10_28_10_2_184_
// tlong：資料時間，ex. 1424755800000
// t：資料時間，ex. 13: 30: 00
// ip：好像是一個 flag，3 是暫緩收盤股票, 2 是趨漲, 1 是趨跌， ex. 0
// 日資訊
// d：今日日期，ex. 20150224
// h：今日最高，ex. 42.90
// l：今日最低，ex. 42.35
// o：開盤價，ex. 42.40
// u：漲停點，ex. 45.10
// w：跌停點，ex. 39.20
// y：昨收，ex. 42.15
const getCurrentStockPrice = async (stocks) => {
  try {
    const { data } = await axios.get(`/api/v1/getStockInfo/${stocks}`)
    return _.transform(data.msgArray, (obj, info) => {
      obj[info.c] = [info.d, info.o, info.h, info.l, info.z, info.n]
    }, {})
  } catch (e) {
    console.error(e)
    return {}
  }
}

// [stock, name, price, avgprice, highest, highest %, action]
const calculateStragey = (stocks, currentPrice, historyData) => {
  return _.transform(stocks, (ary, stockNo) => {
    const newRow = []
    newRow.push(stockNo)
    if (_.isEmpty(currentPrice[stockNo]) || _.isEmpty(historyData[stockNo])) {
      newRow.push(['', '', '', '', ''])
    } else {
      const row = currentPrice[stockNo]
      newRow.push(row[5])
      newRow.push(row[4])
      const avgPrice = calMonthAvg(historyData[stockNo], row[4], row[0]).toString()
      newRow.push(avgPrice)

      const highestPrice = calHightest(historyData[stockNo], row[2])
      newRow.push(highestPrice)
      const highPercent = ((row[4] - highestPrice) / highestPrice).toFixed(2)
      newRow.push(highPercent)
      const action = (avgPrice > row[4] || (highPercent > 0.05)) ? '賣出' : '持有'
      newRow.push(action)
    }

    ary.push(newRow.flat())
    return ary
  }, [])
}

const CalSellout = () => {
  const [stock, setStock] = useState('')
  const [result, setResult] = useState([])
  const [loading, setLoading] = useState(false)

  const onCalculate = useCallback(async () => {
    setLoading(true)
    setResult([])
    try {
      const historyData = {}
      await Promise.all(_.uniq(stock.split(',')).map(async (s) => {
        historyData[s] = await getStockDatePrices(s)
        await new Promise(resolve => setTimeout(resolve, 6000))
      }))

      const currentPrice = await getCurrentStockPrice(stock)

      const data = calculateStragey(stock.split(','), currentPrice, historyData)

      setResult(data)
    } finally {
      setLoading(false)
    }
  }, [stock])

  return (
    <div className='m-5'>
      <form className='mb-2.5'>
        <label htmlFor="stock" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">股票代號</label>
        <div className="relative">
          <input id="stock" onChange={e => setStock(e.target.value)} className="block w-full p-4 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
          <button type="button" onClick={onCalculate} className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Calculate</button>
        </div>
      </form>
      {
        loading ?
          <div role="status">
            <svg aria-hidden="true" className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
          :
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">代號</th>
                  <th scope="col" className="px-6 py-3">公司</th>
                  <th scope="col" className="px-6 py-3">現價</th>
                  <th scope="col" className="px-6 py-3">{`<${avgDays}天均價`}</th>
                  <th scope="col" className="px-6 py-3">最高價</th>
                  <th scope="col" className="px-6 py-3">建議</th>
                </tr>
              </thead>
              <tbody>
                {
                  result.map((r, i) => (
                    <tr key={`${r[0]}_${i}`} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                      <td className={classnames('px-6 py-4', { 'text-rose-600 font-semibold': r[6] === '賣出' })}>{r[0]}</td>
                      <td className='px-6 py-4'>{r[1]}</td>
                      <td className='px-6 py-4'>{r[2]}</td>
                      <td className={classnames('px-6 py-4', { 'text-rose-600 font-semibold': r[3] > r[2] })}>{r[3]}</td>
                      <td className={classnames('px-6 py-4', { 'text-rose-600 font-semibold': r[5] <= -0.05 })}>{r[4]}({r[5] * 100}%)</td>
                      <td className={classnames('px-6 py-4', { 'text-rose-600 font-semibold': r[6] === '賣出' })}>{r[6]}</td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
      }
    </div>
  )
}

export default CalSellout
