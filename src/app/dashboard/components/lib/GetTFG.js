'use server'
//import { cookies } from "next/headers";

export default async function GetTFG({ id }) {
    const url = `${process.env.SERVER_URL}/tfgs/${id}`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const data = response.json();
    return data;
}