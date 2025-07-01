"use client"
import { resolve } from "path";
import { useEffect, useState } from "react";

export default function SidebarLayout({ children } : {children: React.ReactNode}) {
  const [expanded, setExpanded] = useState(false);
  useEffect(() => {
      fetch(`${process.env.remote_connection || process.env.local_connection}/navigation/all`, 
        {credentials: "include"})
        .then((res) => res.json())
        .then((res) => {
           console.log(res)
          }
        )
        .catch(console.error);
    }, []);
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
            className="bg-white text-gray-800 text-xl py-2 px-3 rounded-md shadow hover:bg-gray-200 hover:scale-105 transition-all duration-200"
          >
            ☰
          </button>
        </div>
      </div>

      <div>
        
      </div>

      <div className={`transition-all duration-300 ease-in-out flex-1 p-8`}
        style={{ marginLeft: expanded ? "16rem" : "5rem" }}>
        {children}
      </div>
      
    </div>
  );
}