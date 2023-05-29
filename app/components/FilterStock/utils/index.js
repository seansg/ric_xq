
export const kdBuyTrans = (kd) => {
  switch (true) {
    case (Number(kd) < 16):
      return `低檔鈍化`
    case (Number(kd) < 31):
      return `區間盤整`
    case (Number(kd) < 49):
      return `買盤進駐`
    case (Number(kd) < 71):
      return `起漲中`
    case (Number(kd) < 83):
      return `漲幅滿足`
    default:
      return `高檔鈍化`
  }
}

export const kdSellTrans = (kd) => {
  switch (true) {
    case (Number(kd) < 16):
      return `低檔鈍化`
    case (Number(kd) < 31):
      return `區間盤整`
    case (Number(kd) < 49):
      return `跌幅收斂`
    case (Number(kd) < 71):
      return `轉跌中`
    case (Number(kd) < 83):
      return `賣壓湧現`
    default:
      return `高檔鈍化`
  }
}

export const kdTrans = (kd, direction) => {
  return direction >= 0 ? kdBuyTrans(kd) : kdSellTrans(kd)
}

export const renameWaveCol = '幅度%'

export const renamePriceCol = '收盤價'
