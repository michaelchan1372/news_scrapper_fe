"use client"
import { resolve } from "path";
import { useEffect, useState } from "react";
import * as FaIcon from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRouter } from 'next/navigation'

interface Navigation {
  id: number,
  is_active: number,
  is_dashboard: number,
  path: string,
  title: string,
  icon: string | null,
  image: string | null
}

export default function SidebarLayout({ children } : {children: React.ReactNode}) {
  const router = useRouter()
  const [expanded, setExpanded] = useState(false);
  const [navigations, setNavigations] = useState<Navigation[]>([]);
  useEffect(() => {
      const fetchNavigations = async () => {
        try {
          let res = await fetch(`${process.env.remote_connection || process.env.local_connection}/navigation/all`, {credentials: "include"})

          if (res.status === 401) {
            const refreshRes = await fetch(
              `${process.env.remote_connection || process.env.local_connection}/auth/refresh`,
              { method: "POST", credentials: "include" }
            );
            if (refreshRes.ok) {
              res = await fetch(
                `${process.env.remote_connection || process.env.local_connection}/navigation/all`,
                { credentials: "include" }
              );
            } else {
              console.error("Refresh token failed");
              return;
            }
          }
          if (!res.ok) throw new Error(`Error: ${res.status}`);
          const data = await res.json();
          setNavigations(data);
        }
        catch(err) {
          console.error(err);
        }
      }
      fetchNavigations();
    }, []);

  const navTo =(path: string) =>{
    router.push(path)
  }
  
  return (
    <div className="flex">
      {/* Sidebar */}
      <div
        className="shadow fixed top-0 left-0 h-full bg-white text-white z-10 transition-all duration-300 ease-in-out overflow-hidden"
        style={{ width: expanded ? "16rem" : "5rem" }} // inline style enables smooth width animation
      >
        {/* Toggle Button */}
        <div className="flex justify-end p-4">
          <button
            onClick={() => setExpanded(!expanded)}
            className="bg-white text-gray-800 text-xl px-3 rounded-md shadow hover:bg-gray-200 hover:scale-105 transition-all duration-200"
          >
            <FontAwesomeIcon icon={FaIcon[`${expanded?"faCaretLeft":"faCaretRight"}`as keyof typeof FaIcon] as FaIcon.IconDefinition} size="sm"/>
          </button>
        </div>
        <div className="flex flex-col text-gray-600">
          {navigations.map((navigation, i)=>(
            <button className={`
              ${expanded? `mb-2 py-2 hover:bg-gray-100 ml-4 mr-4 mb-2 rounded border border-gray-200`:
                `ml-2 mr-2 mb-2 py-2 rounded border border-gray-200 hover:bg-gray-200 `
              }`} 
              key={i}
              onClick={() => navTo(navigation.path)}
            >
              {navigation.icon? <FontAwesomeIcon icon={FaIcon[navigation.icon as keyof typeof FaIcon] as FaIcon.IconDefinition} className="text-gray-500"/>: ""}
              {expanded?<span className="ml-2">{navigation.title}</span>: ""}
            </button>
          ))}
        </div>
      </div>


      <div className={`transition-all duration-300 ease-in-out flex-1 p-8`}
        style={{ marginLeft: expanded ? "16rem" : "5rem" }}>
        {children}
      </div>
      
    </div>
  );
}