'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Page() {
  const [data, seTData] = useState<{published_date: string, region: string, num: number, keywords: string}[]>([]);
  useEffect(() => {
    fetch(`${process.env.remote_connection || process.env.local_connection}/scrape/`)
      .then((res) => res.json())
      .then( (data) => {
        seTData(data)
      }
      )
      .catch(console.error);
  }, []);



  return <div>
    <table className='border-collapse border border-gray-400'>
      <tbody>
        <tr>
        <TH>Published Date</TH>
        <TH>Region</TH>
        <TH>Number</TH>
        <TH>Keywords</TH>
        <TH>Summary</TH>
      </tr>
        {data.map((val, i) => (
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
