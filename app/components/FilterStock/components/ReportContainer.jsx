import { useState, useCallback, useRef } from 'react'
import _ from 'lodash'
import html2canvas from 'html2canvas';

import CSVReader from 'react-csv-reader'

import HtmlTable from './HtmlTable'
import TextArea from './TextArea'
import TableDownloader from './TableDownloader';

const ReportContainer = ({ data, title, filename, handleParseCSV }) => {
  const tableRef = useRef(null)
  const inputRef = useRef(null)
  const defaultValue = useRef('')

  const handleDownloadImage = useCallback(async () => {
    const element = tableRef.current;
    const canvas = await html2canvas(element);

    const data = canvas.toDataURL('image/jpg');
    const link = document.createElement('a');

    if (typeof link.download === 'string') {
      link.href = data;
      link.download = filename;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      window.open(data);
    }
  }, [data, filename])


  const handleParse = useCallback(() => {
    if (!inputRef.current.value) return

    defaultValue.current = inputRef.current.value
    handleParseCSV(inputRef.current.value.split("\n").map(row => row.split(",")))
  }, [handleParseCSV, title])

  return (
    <div className="grid grid-cols-2 divide-x">
      <TableDownloader data={data} title={title} filename={filename}/>
      <div className="flex justify-content-center flex-col">
        <div className="my-2.5 mx-2.5 flex gap-x-5">
          <button className='px-5 py-1 bg-[#1da1f2] text-white rounded' onClick={handleParse}>Parse</button>
          <CSVReader
            onFileLoaded={handleParseCSV}
            // fileEncoding='big5'
          />
        </div>
        <div className='m-2.5'>
          <TextArea inputRef={inputRef} defaultValue={defaultValue} />
        </div>
      </div>
    </div>
  )
}

export default ReportContainer
