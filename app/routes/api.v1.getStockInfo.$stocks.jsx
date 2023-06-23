import axios from 'axios'

export const loader = async ({ params }) => {
  const stocks = params.stocks.split(',').map(s => `tse_${s}.tw|otc_${s}.tw`).join('|')
  const { data } = await axios.get(`https://mis.twse.com.tw/stock/api/getStockInfo.jsp?json=1&delay=0&ex_ch=${stocks}`)
  console.log(data)
  return data
}
