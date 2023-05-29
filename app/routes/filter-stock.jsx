import { lazy, Suspense } from "react";

const FilterStock = lazy(() => import("~/components/FilterStock"));

const FilterStockRoute = () => {
  return (
    <Suspense fallback={null}>
      <FilterStock />
    </Suspense>
  )
}

export default FilterStockRoute