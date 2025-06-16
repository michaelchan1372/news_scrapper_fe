"use client"

import Button from "@/app/(components)/button";
import { useParams, useRouter  } from "next/navigation";
import { useEffect, useState } from "react";


export default function Page() {
    const params = useParams();
    const router = useRouter();

    const { id } = params
    const [data, seTData] = useState<string>("");

    useEffect(() => {
          fetch(`${process.env.remote_connection || process.env.local_connection}/scrape/text`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id }),
            credentials: "include"
          })
            .then((res) => res.json())
            .then( (data) => {
              seTData(data)
            }
            )
            .catch(console.error);
        }, [id]);
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