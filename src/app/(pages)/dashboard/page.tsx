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
        <select id="fruit" value={selectedOption} onChange={handleChange}>
          <option value="">all</option>
          {regionList.map((val, i) => (
            <option key={i} value={val}>{val}</option>
          ))}
        </select>
      </div>
    <table className='border-collapse border border-gray-400'>
      <tbody>
        <tr>
        <TH>Published Date</TH>
        <TH>Region</TH>
        <TH>Number</TH>
        <TH>Keywords</TH>
        <TH>Summary</TH>
      </tr>
        {filteredData.map((val, i) => (
          <tr key={i}>
            <TD><Link href={`/page/${val.region}/${val.published_date}`}><span className='bg-blue-500
        text-gray-200 py-2 px-2 rounded-md'>{val.published_date}</span></Link></TD>
            <TD>{val.region}</TD>
            <TD>{val.num}</TD>
            <TD>{val.keywords}</TD>
            <TDWide>under development</TDWide>
          </tr>
        ))}
      </tbody>
    </table>
    </div>
}

function TD({ children } : {children: React.ReactNode}) {
  return <td className="border py-2 px-2">
        {children}
    </td>
}

function TDWide({ children } : {children: React.ReactNode}) {
  return <td className="border py-2 px-2 min-w-lg">
        {children}
    </td>
}

function TH({ children } : {children: React.ReactNode}) {
  return <th className="border py-2 px-2">
        {children}
    </th>
}
