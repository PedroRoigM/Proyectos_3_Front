'use server'
//import { cookies } from "next/headers";

export default async function GetTFGs() {
    const url = `${process.env.SERVER_URL}/tfgs`;
    const token = process.env.TOKEN;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });
    const data = response.json();
    return data;
}