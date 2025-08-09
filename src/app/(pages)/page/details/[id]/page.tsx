"use client"

import Button from "@/app/(components)/button";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";


export default function Page() {
  const params = useParams();
  const router = useRouter();

  const { id } = params
  const [data, setData] = useState<string>("");

  useEffect(() => {
    refreshPage();
  }, [id]);
  const refreshPage = async () => {
    try {
      let res = await fetch(`${process.env.remote_connection || process.env.local_connection}/scrape/text`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
        credentials: "include"
      })

      if (res.status === 401) {
        const refreshRes = await fetch(
          `${process.env.remote_connection || process.env.local_connection}/auth/refresh`,
          { method: "POST", credentials: "include" }
        );
        if (refreshRes.ok) {
          res = await fetch(`${process.env.remote_connection || process.env.local_connection}/scrape/text`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id }),
            credentials: "include"
          })
        } else {
          console.error("Refresh token failed");
          return;
        }
      }
      if (!res.ok) throw new Error(`Error: ${res.status}`);
      const data = await res.json();
      setData(data)
    }
    catch (err) {
      console.error(err);
    }
  }
  return <div>
    <Button onClick={() => router.back()} text="Go Back"></Button>
    <p>{data.split('\n').map((line, index) => (
      <span key={index}>
        {line}
        <br />
      </span>
    ))}</p>
  </div>
}