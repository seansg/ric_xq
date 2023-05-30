import axios from 'axios'

export const loader = async ({ params }) => {
  const { data } = await axios.get(`https://www.twse.com.tw/pcversion/exchangeReport/BFIAMU?date=${params.date}&type=MS&response=json`)
  return data
}
