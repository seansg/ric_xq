import axios from 'axios'

export const loader = async ({ params }) => {
  const { data } = await axios.get(`https://www.twse.com.tw/exchangeReport/STOCK_DAY?response=json&date=${params.date}&stockNo=${params.stock}`)

  return data
}
