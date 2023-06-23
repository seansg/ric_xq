import { ClientOnly } from "remix-utils";

import CalSellout from '~/components/CalSellout/index.client'

const CalSelloutRoute = () => {
  return (
    <>
      <ClientOnly fallback={<div>Loading...</div>}>
        {() => <CalSellout />}
      </ClientOnly>
    </>
  )
}

export default CalSelloutRoute
