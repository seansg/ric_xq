import { ClientOnly } from "remix-utils";

import CashDirectRatio from '~/components/CashDirectRatio/index.client'
import Nav from '~/components/Nav'

const CashDirectRatioRoute = () => {
  return (
    <>
      <Nav />
      <ClientOnly fallback={<div>Loading...</div>}>
        {() => <CashDirectRatio />}
      </ClientOnly>
    </>
  )
}

export default CashDirectRatioRoute