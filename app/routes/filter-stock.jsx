import { ClientOnly } from "remix-utils";

import FilterStock from '~/components/FilterStock/index.client'
import Nav from '~/components/Nav'

const FilterStockRoute = () => {
  return (
    <>
      <Nav />
      <ClientOnly fallback={<div>Loading...</div>}>
        {() => <FilterStock />}
      </ClientOnly>
    </>
  )
}

export default FilterStockRoute