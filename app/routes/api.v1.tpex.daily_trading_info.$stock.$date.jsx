import axios from 'axios'

export const loader = async ({ params }) => {
  const year = Number(params.date.slice(0, 4)) - 1911
  const month = params.date.slice(4, -2)
  const { data } = await axios.get(`https://www.tpex.org.tw/web/stock/aftertrading/daily_trading_info/st43_result.php?l=zh-tw&d=${year}/${month}&stkno=${params.stock}`)

  return data
}
