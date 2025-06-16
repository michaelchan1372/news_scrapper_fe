'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Button from '@/app/(components)/button';
import Link from 'next/link';

export default function Page() {
    const router = useRouter();
    const params = useParams();
    const { region, published_date } = params
 
    const [data, seTData] = useState<{
        id: number
        , title: string
        , link: string
        , published: string
        , description: string
        , sl_id: number
        , content_path: string
        , html_path: string
        , scrape_date : string
        , keyword: string
        , source: string
    }[]>([]);

    useEffect(() => {
      fetch(`${process.env.remote_connection || process.env.local_connection}/scrape/page`, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({ region, published_date }),
        credentials: "include"
      })
        .then((res) => res.json())
        .then( (data) => {
          seTData(data)
        }
        )
        .catch(console.error);
    }, [region, published_date]);

    const downloadCsv = async () => {
        fetch(`${process.env.remote_connection || process.env.local_connection}/scrape/download`, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({ region }),
        credentials: "include"
        })
        .then( async (res) => {
            console.log(res)
            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${decodeURIComponent(region as string)}_download.csv`; // Matches `filename` from FastAPI
            a.click();
            window.URL.revokeObjectURL(url);
        })
        .catch(console.error);
    }

    const downloadZip = async (id: number) => {
        const idStr = id.toString();
        fetch(`${process.env.remote_connection || process.env.local_connection}/scrape/zip`, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: idStr }),
        credentials: "include"
        })
        .then( async (res) => {

            if(res.status == 200){
                console.log(res)
                const data = await res.json();
                const url = data.url;
                const a = document.createElement("a");
                console.log(url)
                a.href = url;
                a.download = `${id}_download.zip`; // Matches `filename` from FastAPI
                a.click();
                window.URL.revokeObjectURL(url);
            }
        })
        .catch(console.error);
    }
    
    const handleClick = () => {
    router.push('/dashboard');  // change '/target-path' to your desired URL
    };

    return <div className="">
        <div className='flex flex-row'>
            <Button
                style={{
                    marginRight: '20px'
                }}
                text="Return"
                onClick={handleClick}
            />
            <Button
                text="Download Full Csv"
                onClick={downloadCsv}
            />
        </div>
        
        <table className='w-[80%] table-auto'>
            <tbody className='w-4/5 max-w-4/5'>
                <tr className='bg-white w-4/5 max-w-4/5 bg-opacity-50'>
                    <th className="py-2 px-1 border-b border-gray-300">Id</th>
                    <th className="py-2 px-1 border-b border-gray-300">Keyword</th>
                    <th className="py-2 px-1 border-b border-gray-300">Title</th>
                    <th className="py-2 px-1 border-b border-gray-300">Source</th>
                    <th className="py-2 px-1 border-b border-gray-300">Link</th>
                    <th className="py-2 px-1 border-b border-gray-300">Description</th>
                    <th className="py-2 px-1 border-b border-gray-300">Published On</th>
                    <th className="py-2 px-1 border-b border-gray-300">Scrape Date</th>
                    <th className="py-2 px-2 border-b border-gray-300">Archive</th>
                </tr >
                {data.map((val, i) => (
                <tr key={i} className='bg-white w-4/5 max-w-4/5 bg-opacity-50'>
                    <td className="py-2 px-2 max-w-sm overflow-hidden whitespace-nowrap truncate border-b border-gray-300">{val.id}</td>
                    <td className="py-2 px-1 max-w-sm overflow-hidden whitespace-nowrap truncate border-b border-gray-300">{val.keyword}</td>
                    <td className="py-2 px-1 max-w-sm overflow-hidden whitespace-nowrap truncate border-b border-gray-300">{val.title}</td>
                    <TDShort>{val.source}</TDShort>
                    <TDShort><a className="text-emerald-400" href={val.link}>{val.link}</a></TDShort>    
                    <TDShort>{stripHtmlTags(val.description)}</TDShort>
                    <td className="py-2 px-1 max-w-sm overflow-hidden whitespace-nowrap truncate border-b border-gray-300">{val.published}</td>
                    <td className="py-2 px-1 max-w-sm overflow-hidden whitespace-nowrap truncate border-b border-gray-300">{val.scrape_date}</td>
                    <td className="py-2 px-2 max-w-sm overflow-hidden whitespace-nowrap truncate border-b border-gray-300">
                        <div className='flex text-white flex-col text-xs'>  
                            {   val.content_path &&
                                <div>
                                    <Link  href={`/page/details/${val.id}`}>
                                    <button className="shadomd:w-md mb-1 bg-teal-500 border py-1 px-6 cursor-pointer hover:bg-teal-700 rounded-3xl">Text</button>
                                    </Link>
                                </div>              
                            } 
                            {   val.html_path && 
                                <div>
                                    <button className="shadomd:w-md bg-teal-500 py-1 px-7 border cursor-pointer hover:bg-teal-700 rounded-3xl" onClick={()=> downloadZip(val.id)}>
                                        Zip
                                    </button>
                                </div>
                            }
                        </div>
                        
                    </td>
                </tr>
                ))}
            </tbody>
        </table>
        
    </div>
}

function stripHtmlTags(html: string) {
  return html.replace(/<[^>]*>/g, '');
}

function TDShort({ children } : {children: React.ReactNode}) {
  return <td className="py-2 px-1 max-w-3xs overflow-hidden whitespace-nowrap truncate border-b border-gray-300">
        {children}
    </td>
}