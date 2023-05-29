import { useCallback, useRef } from 'react'
import _ from 'lodash'
import html2canvas from 'html2canvas';

import HtmlTable from './HtmlTable'
import PngBtn from '~/components/commons/DownloadProvider/PngBtn'

const TableDownloader = ({ data }) => {
  const tableRef = useRef(null)

  const handleDownloadImage = useCallback(async () => {
    const element = tableRef.current;
    const canvas = await html2canvas(element);

    const file = canvas.toDataURL('image/jpg');
    const link = document.createElement('a');

    if (typeof link.download === 'string') {
      link.href = file;
      link.download = data.filename;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      window.open(file);
    }
  }, [data])

  return (
    <div className="flex justify-content-center flex-col">
      <PngBtn onClick={handleDownloadImage} />
      <HtmlTable data={data} tableRef={tableRef} title={data.title}/>
    </div>
  )
}

export default TableDownloader
