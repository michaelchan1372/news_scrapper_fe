'use client';
import { SetStateAction, useEffect, useState } from 'react';
import Link from 'next/link';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ScrollableCell } from "../../(components)/scrollable";

export default function Page() {
  const [data, setData] = useState<{published_date: string, region: string, num: number, keyword: string, summary: string, k_id: number}[]>([]);
  const [filteredData, setFTData] = useState<{published_date: string, region: string, num: number, keyword: string, summary: string, k_id: number}[]>([]);
  const [regionList, setRegionList] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState('');
  const [triggerRefresh, setTriggerRefresh] = useState(false);

  useEffect(() => {
    refresh();
  }, [triggerRefresh]);

  const refresh = async () => {
    try {
      let res = await fetch(`${process.env.remote_connection || process.env.local_connection}/scrape/`, {credentials: "include"})

      if (res.status === 401) {
        const refreshRes = await fetch(
          `${process.env.remote_connection || process.env.local_connection}/auth/refresh`,
          { method: "POST", credentials: "include" }
        );
        if (refreshRes.ok) {
          res = await fetch(`${process.env.remote_connection || process.env.local_connection}/scrape/`, {credentials: "include"})
        } else {
          console.error("Refresh token failed");
          return;
        }
      }
      if (!res.ok) throw new Error(`Error: ${res.status}`);
      const data = await res.json();
      setData(data)
    }
    catch(err) {
      console.error(err);
    }
  }

  useEffect(()=>{
    if(data && data.length){
      const regions = data.map((dat)=>dat.region)
      setRegionList([...new Set(regions)])
      if(selectedOption){
        const fitlerDT = data.filter((dat)=>dat.region == selectedOption)
        setFTData(fitlerDT)
      }
      else {
        setFTData(data)
      }
    }
    
  }, [selectedOption, data])

  const handleChange = (event: { target: { value: SetStateAction<string>; }; }) => {
    setSelectedOption(event.target.value);
  };

  const hideNews = async (region: string, published_date: string) => {
    const query = new URLSearchParams({
        region: region,
        published_date: published_date,
      });
    try {
      let res = await fetch(`${process.env.remote_connection || process.env.local_connection}/scrape/remove_news?${query.toString()}`, {
        method: 'DELETE',
        credentials: "include"
      })

      if (res.status === 401) {
        const refreshRes = await fetch(
          `${process.env.remote_connection || process.env.local_connection}/auth/refresh`,
          { method: "POST", credentials: "include" }
        );
        if (refreshRes.ok) {
          res = await fetch(`${process.env.remote_connection || process.env.local_connection}/scrape/remove_news?${query.toString()}`, {
            method: 'DELETE',
            credentials: "include"
          })
        } else {
          console.error("Refresh token failed");
          return;
        }
      }
      if (!res.ok) throw new Error(`Error: ${res.status}`);
      setTriggerRefresh(!triggerRefresh)
    }
    catch(err) {
      console.error(err);
    }
  }

  function toTitleCase(str: string) {
    return str
      .toLowerCase()
      .replace(/[-_]+/g, ' ')                      // replace _ and - with space
      .replace(/\b\w/g, char => char.toUpperCase()); // capitalize each word
  }
  return <div>
    <div>
        <label htmlFor="fruit">Choose a region: </label>
        <select className="border rounded-md py-1 px-2" id="fruit" value={selectedOption} onChange={handleChange}>
          <option value="">All</option>
          {regionList.map((val, i) => (
            <option key={i} value={val}>{toTitleCase(val)}</option>
          ))}
        </select>
      </div>
    <table className='border-collapse w-full table-auto'>
      <tbody>
        <tr className='bg-white max-w-4/5 bg-opacity-50 text-xs lg:text-sm'>
        <th className="py-2 lg:px-1 border-b border-gray-300">Published Date</th>
        <th className="py-2 lg:px-1 border-b border-gray-300 hidden lg:table-cell">Region</th>
        <th className="py-2 lg:px-1 border-b border-gray-300 hidden lg:table-cell">Number</th>
        <th className="py-2 lg:px-1 border-b border-gray-300">Keyword</th>
        <th className="py-2 lg:px-1 border-b border-gray-300">Summary</th>
        <th className="py-2 lg:px-1 border-b border-gray-300">Hidden</th>
      </tr>
        {filteredData.map((val, i) => (
          <tr key={i} className='bg-white bg-opacity-50'>
            <td className="py-2 px-2 max-w-xs overflow-hidden whitespace-nowrap truncate border-b border-gray-300">
              <Link href={`/page/${val.region}/${val.published_date}/${val.k_id}`}>
                <span className='py-2 px-2 rounded-md hover:bg-gray-200 cursor-pointer text-blue-500'>
                  {val.published_date}
                </span>
                </Link>
          </td>
            <td className="py-2 lg:px-1 max-w-sm overflow-hidden whitespace-nowrap truncate border-b border-gray-300 hidden lg:table-cell">{toTitleCase(val.region)}</td>
            <td className="py-2 lg:px-1 max-w-sm overflow-hidden whitespace-nowrap truncate border-b border-gray-300 hidden lg:table-cell">{val.num}</td>
            <td className="py-2 lg:px-1 max-w-sm overflow-hidden whitespace-nowrap truncate border-b border-gray-300">{val.keyword}</td>
            {
              val.summary && <ScrollableCell content={val.summary}/>
            }
            {
              !val.summary && <td className="py-2 lg:px-1 max-w-sm overflow-hidden whitespace-normal truncate border-b border-gray-300 text-center">Pending...</td>
            }
            <td className="py-2 px-2 max-w-2xl overflow-hidden whitespace-nowrap truncate border-b border-gray-300 align-middle text-center ">
              <button onClick={()=> hideNews(val.region, val.published_date)}>
                <FontAwesomeIcon icon={faTrash} className="text-gray-500"/>
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>
}