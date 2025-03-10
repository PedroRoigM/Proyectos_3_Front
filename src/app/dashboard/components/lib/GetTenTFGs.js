'use server'
import { cookies } from "next/headers";

export default async function GetTenTFGs({ page_number, dataForm }) {
    const url = `${process.env.SERVER_URL}/tfgs/pages/${page_number}`;
    const body = JSON.stringify(dataForm) || null;
    console.log('Body: ', body);
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: body,
    });
    const data = await response.json();
    return data;
}