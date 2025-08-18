'use client';
import { ChangeEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ScrollableCell } from "../../(components)/scrollable";
import MultiSelectDropdown from '@/app/(components)/multiSelect';
import { Option } from '@/app/(components)/multiSelect';
export default function Page() {
  const [data, setData] = useState<{published_date: string, region: string, num: number, keyword: string, summary: string, k_id: number}[]>([]);
  const [filteredData, setFTData] = useState<{published_date: string, region: string, num: number, keyword: string, summary: string, k_id: number}[]>([]);
  const [regionList, setRegionList] = useState<Option[]>([]);
  const [keywordList, setKeywordList] = useState<Option[]>([]);
  const [triggerRefresh, setTriggerRefresh] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState<boolean>(false);
  const [keywordListCache, setKeywordCache] = useState<Option[]>([]);
  const [regionListCache, setRegionCache] = useState<Option[]>([]);
  
  useEffect(() => {
    refresh();
  }, [triggerRefresh]);

  const refresh = async () => {
    setIsLoading(true);
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
    finally {
      setIsLoading(false);
    } 
  }

  useEffect(()=>{
    if(data && data.length){
      const regions = data.map((dat)=>dat.region)
      const keywords = data.map((dat)=>dat.keyword)
      const regionSelects = [...new Set(regions)].map((r)=> {
          return {
            label:r, value:r
        };
      })
      setRegionList(regionSelects)
      const keywordSelects = [...new Set(keywords)].map((r)=> {
          return {
            label:r, value:r
        };
      })
      setRegionList(regionSelects)
      setRegionCache(regionSelects)
      setKeywordList(keywordSelects)
      setKeywordCache(keywordSelects)
      if(!selectedOption){
        setFTData(data)
      }
      setSelectedOption(true)
    }
  }, [selectedOption, data])

  useEffect(()=> {
    if(keywordListCache || regionListCache){
      console.log(keywordListCache)
      let fitlerDT = data
      .filter((dat)=>keywordListCache.map(sk => sk.value).includes(dat.keyword))
      .filter((dat)=>regionListCache.map(sr => sr.value).includes(dat.region))
      setFTData(fitlerDT)
      console.log(fitlerDT)
    }
  }, [keywordListCache, regionListCache])

  const handleChangeRegion = (selectedRegions: Option[]) => {
    setRegionCache(selectedRegions)
  };

  const handleChangeKeyword = (selectedKeyword: Option[]) => {
    setKeywordCache(selectedKeyword)
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
    <div className='flex flex-row'>
    <MultiSelectDropdown
    placeholder={"Select Regions..."}
    options={regionList}
    onSelectionChange={handleChangeRegion}
    ></MultiSelectDropdown>    
    <MultiSelectDropdown
    placeholder={"Select Keywords..."}
    options={keywordList}
    onSelectionChange={handleChangeKeyword}
    ></MultiSelectDropdown>      
      </div>
    <div className='flex flex-row-reverse'>
      <button className="text-sm bg-gray-200 text-gray-600 px-2 py-1 rounded shadow hover:bg-gray-300 items-center justify-center cursor-pointer" onClick={refresh}>
        Refresh
      </button>
    </div>
    {
      isLoading && <div>
        Loading...
      </div>
    }
    {
      !isLoading && 
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
    }
    </div>
}