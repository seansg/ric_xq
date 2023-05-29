import { ClientOnly } from "remix-utils";

import FilterStock from '~/components/FilterStock/index.client'

const FilterStockRoute = () => {
  return (
    <ClientOnly fallback={<div>Loading...</div>}>
      {() => <FilterStock />}
    </ClientOnly>
  )
}

export default FilterStockRoute