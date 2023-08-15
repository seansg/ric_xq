import { useCallback } from 'react'

const TitleField = ({ onChange }) => {
  const handleChange = useCallback((e) => {
    onChange(e.target.value)
  }, [])

  return (
    <>
      <label for="title" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select an title</label>
      <select id="title" onChange={handleChange} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
        <option selected value=""></option>
        <option value="激戰區-非百元(Tick 適用)">激戰區-非百元(Tick 適用)</option>
        <option value="激戰區-百元(Tick 適用)">激戰區-百元(Tick 適用)</option>
        <option value="上班族首選-多排">上班族首選-多排</option>
        <option value="成長型-價投">成長型-價投</option>
        <option value="型態首選-動能追追">型態首選-動能追追</option>
        <option value="年輕人首選 - 多方">年輕人首選 - 多方</option>
        <option value="年輕人首選 - 空方">年輕人首選 - 空方</option>
      </select>
    </>
  )
}

export default TitleField
