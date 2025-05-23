'use client';
import { SetStateAction, useEffect, useState } from 'react';
import Link from 'next/link';

export default function Page() {
  const [data, seTData] = useState<{published_date: string, region: string, num: number, keywords: string}[]>([]);
  const [filteredData, setFTData] = useState<{published_date: string, region: string, num: number, keywords: string}[]>([]);
  const [regionList, setRegionList] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState('');

  useEffect(() => {
    fetch(`${process.env.remote_connection || process.env.local_connection}/scrape/`)
      .then((res) => res.json())
      .then((res) => {
        seTData(res)
        }
      )
      .catch(console.error);
  }, []);

  useEffect(()=>{
    const regions = data.map((dat)=>dat.region)
    setRegionList([...new Set(regions)])
    if(selectedOption){
      const fitlerDT = data.filter((dat)=>dat.region == selectedOption)
      setFTData(fitlerDT)
    }
    else {
      setFTData(data)
    }
  }, [selectedOption, data])

  const handleChange = (event: { target: { value: SetStateAction<string>; }; }) => {
    setSelectedOption(event.target.value);
  };

  return <div>
    <div>
        <label htmlFor="fruit">Choose a region: </label>
        <select className="border rounded-md" id="fruit" value={selectedOption} onChange={handleChange}>
          <option value="">all</option>
          {regionList.map((val, i) => (
            <option key={i} value={val}>{val}</option>
          ))}
        </select>
      </div>
    <table className='border-collapse w-[70%] table-auto'>
      <tbody>
        <tr className='bg-white w-4/5 max-w-4/5 bg-opacity-50'>
        <th className="py-2 px-1 border-b border-gray-300">Published Date</th>
        <th className="py-2 px-1 border-b border-gray-300">Region</th>
        <th className="py-2 px-1 border-b border-gray-300">Number</th>
        <th className="py-2 px-1 border-b border-gray-300">Keywords</th>
        <th className="py-2 px-1 border-b border-gray-300">Summary</th>
      </tr>
        {filteredData.map((val, i) => (
          <tr key={i} className='bg-white w-4/5 max-w-4/5 bg-opacity-50'>
            <td className="py-2 px-2 max-w-xs overflow-hidden whitespace-nowrap truncate border-b border-gray-300">
              <Link href={`/page/${val.region}/${val.published_date}`}>
                <span className='py-2 px-2 rounded-md hover:bg-gray-200 cursor-pointer text-blue-500'>
                  {val.published_date}
                </span>
                </Link>
          </td>
            <td className="py-2 px-1 max-w-sm overflow-hidden whitespace-nowrap truncate border-b border-gray-300">{val.region}</td>
            <td className="py-2 px-1 max-w-sm overflow-hidden whitespace-nowrap truncate border-b border-gray-300">{val.num}</td>
            <td className="py-2 px-1 max-w-sm overflow-hidden whitespace-nowrap truncate border-b border-gray-300">{val.keywords}</td>
            <td className="py-2 px-2 max-w-sm overflow-hidden whitespace-nowrap truncate border-b border-gray-300">under development</td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>
}