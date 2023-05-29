import { ClientOnly } from "remix-utils";

import CashDirectRatio from '~/components/CashDirectRatio/index.client'

const CashDirectRatioRoute = () => {
  return (
    <ClientOnly fallback={<div>Loading...</div>}>
      {() => <CashDirectRatio />}
    </ClientOnly>
  )
}

export default CashDirectRatioRoute