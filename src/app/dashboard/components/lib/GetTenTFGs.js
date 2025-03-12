'use server'
import { cookies } from "next/headers";

export default async function GetTenTFGs({ number, dataForm }) {
    const page_number = number || 1;
    const url = `${process.env.SERVER_URL}/tfgs/pages/${page_number}`;
    const body = JSON.stringify(dataForm) || null;

    const token = process.env.TOKEN;
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: body,
    });
    const data = await response.json();
    console.log(data);
    return data;
}