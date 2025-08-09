'use client';

import { useEffect, useState } from "react";

interface IKeyword {
  keywords: string,
  regions: IUserRegion[]
}

interface IUserRegion {
  kur_id: number,
  name: string
}

interface IRegion {
  id: number,
  name: string,
  code: string
}

export default function Page() {
  const [keywords, setKeywords] = useState<IKeyword[]>([]);
  const [regions, setRegions] = useState<IRegion[]>([]);
  const [keywordIndex, setKeywordIndex] = useState<number>();
  const [newKeyword, setNewKeyword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  useEffect(() => {
    refreshPage();
  }, []);
  const refreshPage = async () => {
    setIsLoading(true);
    await fetchKeywords();
    await fetchRegions();
    setIsLoading(false);
  }
  const fetchKeywords = async () => {
    try {
      let res = await fetch(`${process.env.remote_connection || process.env.local_connection}/keywords/keywords`, {credentials: "include"})
      if (res.status === 401) {
        const refreshRes = await fetch(
          `${process.env.remote_connection || process.env.local_connection}/auth/refresh`,
          { method: "POST", credentials: "include" }
        );
        if (refreshRes.ok) {
          res = await fetch(`${process.env.remote_connection || process.env.local_connection}/keywords/keywords`, {credentials: "include"})
        } else {
          console.error("Refresh token failed");
          return;
        }
      }
      if (!res.ok) throw new Error(`Error: ${res.status}`);
      const data = await res.json();
      setKeywords(data)
    }
    catch (err) {
      console.error(err);
    }
  }
  const fetchRegions = async () => {
    try {
      let res = await fetch(`${process.env.remote_connection || process.env.local_connection}/keywords/regions`, {credentials: "include"})
      if (res.status === 401) {
        const refreshRes = await fetch(
          `${process.env.remote_connection || process.env.local_connection}/auth/refresh`,
          { method: "POST", credentials: "include" }
        );
        if (refreshRes.ok) {
          res = await fetch(`${process.env.remote_connection || process.env.local_connection}/keywords/regions`, {credentials: "include"})
        } else {
          console.error("Refresh token failed");
          return;
        }
      }
      if (!res.ok) throw new Error(`Error: ${res.status}`);
      const data = await res.json();
      setRegions(data)
    }
    catch (err) {
      console.error(err);
    }
  }
  const selectKeyword = (index: number) => {
    if(keywordIndex == index) {
      setKeywordIndex(undefined);
    }
    else {setKeywordIndex(index)}
  }
  const getKeyword = () => {
    return keywords.find((keyword, i) => (i == keywordIndex));
  }
  const isChecked = (region: IRegion) => {
    const keyword = getKeyword();
    const regionNames = keyword?.regions.map(region=>region.name);
    return regionNames?.includes(region.name)
  }
  const toggleCheckBox = async (region: IRegion) => {
    const keyword = getKeyword();
    if(isChecked(region)){
      const query = new URLSearchParams({
        keyword: keyword?.keywords || "",
        region_id: region.id + "",
      });
      setIsLoading(true);
      await deleteKeyword(query.toString(), region)
      setIsLoading(false);
    }
    else {
      const body = JSON.stringify({
        keyword: keyword?.keywords || "",
        region_id: region.id + "",
      }).toString();
      setIsLoading(true);
      fetch(`${process.env.remote_connection || process.env.local_connection}/keywords/add_keyword_region`, 
      {
        credentials: "include",
        body,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((res) => res.json())
      .then((res) => {
          if(res.kur_id) {
            const keywordsCopy = [...keywords];
            keywordsCopy.forEach((keyword)=> {
              if(keyword.keywords == getKeyword()?.keywords){
                keyword?.regions.push({
                  kur_id: res.kur_id,
                  name: region.name
                })
              }
            })
            setKeywords(keywordsCopy)
          }
        }
      )
      .catch(console.error);
      setIsLoading(false);
    }
  }
  const deleteKeyword = async (queryString: string, region: IRegion) => {
    try {
      let res = await fetch(`${process.env.remote_connection || process.env.local_connection}/keywords/remove_keyword_region?${queryString}`, 
      {
        credentials: "include",
        method: 'DELETE'
      })
      if (res.status === 401) {
        const refreshRes = await fetch(
          `${process.env.remote_connection || process.env.local_connection}/auth/refresh`,
          { method: "POST", credentials: "include" }
        );
        if (refreshRes.ok) {
          res = await fetch(`${process.env.remote_connection || process.env.local_connection}/keywords/remove_keyword_region?${queryString}`, 
          {
            credentials: "include",
            method: 'DELETE'
          })
        } else {
          console.error("Refresh token failed");
          return;
        }
      }
      if (!res.ok) throw new Error(`Error: ${res.status}`);
      const data = await res.json();
      if(data.message === true) {
        const keywordsCopy = [...keywords];
        keywordsCopy.forEach((keyword)=> {
          if(keyword.keywords == getKeyword()?.keywords){
            keyword.regions = keyword?.regions.filter(reg=>reg.name != region.name)
            if(keyword.regions.length == 0) {
              refreshPage();
              return;
            }
          }
        })
        setKeywords(keywordsCopy)
      }
    }
    catch (err) {
      console.error(err);
    }
  }
  const createKeyword = async () => {
    if(!newKeyword) return;
    
    const body = JSON.stringify({keyword: newKeyword}).toString();
    setIsLoading(true);
    try {
      let res = await fetch(`${process.env.remote_connection || process.env.local_connection}/keywords/add_keywords`, 
      {
        credentials: "include",
        body,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (res.status === 401) {
        const refreshRes = await fetch(
          `${process.env.remote_connection || process.env.local_connection}/auth/refresh`,
          { method: "POST", credentials: "include" }
        );
        if (refreshRes.ok) {
          res = await fetch(`${process.env.remote_connection || process.env.local_connection}/keywords/add_keywords`, 
          {
            credentials: "include",
            body,
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          })
        } else {
          console.error("Refresh token failed");
          return;
        }
      }
      if (!res.ok) throw new Error(`Error: ${res.status}`);
      const data = await res.json();
      refreshPage()
      setNewKeyword("")
    }
    catch(err) {
      console.error(err);
    }
    setIsLoading(false);
  }
  return <div className="w-80 md:w-128 lg:w-196 xl:w-320 2xl:w-420 3xl:w-560 flex flex-col-reverse md:flex-row flex-wrap">
    <div className="flex flex-row flex-wrap w-full md:w-1/2 p-4 md:p-8 2xl:px-16 h-fit">
      {
        keywords.map((keyword, i) => (
          <div key={i}
          onClick={()=> {selectKeyword(i)}}
          className={`h-fit px-2 py-2 w-32 my-2
          border border-gray-700 
          hover:bg-gray-200 mx-2 rounded text-center text-gray-600 cursor-pointer whitespace-nowrap
          ${i == keywordIndex? "bg-gray-200": "bg-white"}
          `}>
          {keyword.keywords}
          </div>
        ))
      }
      
      <div
        className={`h-fit px-2 py-2 w-32 my-2
          border border-gray-700 
          hover:bg-gray-200 mx-2 rounded text-center text-gray-600 cursor-pointer whitespace-nowrap
          bg-white`}
      >
        <input
          type="text"
          placeholder="New keyword"
          className="w-full bg-transparent outline-none text-center text-gray-600"
          value={newKeyword}
          onChange={(e) => setNewKeyword(e.target.value)}
          onKeyDown={(e) => {
          if (e.key === 'Enter') {
            createKeyword();
          }
        }}
        />
      </div>
    </div>
    {<div className="flex flex-col w-full md:w-1/2 border rounded-lg p-4 md:p-8 2xl:px-16 text-center">
      <span className="mb-4">{getKeyword() ?getKeyword()?.keywords : "Please choose a keyword"}</span>
      {getKeyword() && <div className="text-start w-full">
        <span className="text-sm">Regions:</span>
          {regions && regions.map((region, i)=> (
            <div key={i}>
              <input
                type="checkbox"
                checked={isChecked(region)}
                disabled={isLoading}
                onChange={()=>{toggleCheckBox(region)}}
                className="form-checkbox"
              />
              <span className="ml-2">
                {region.name}
              </span>
            </div>
          ))}
        </div>}
    </div>}
  </div>
  
}