'use server'
import { cookies } from "next/headers";

export default async function PostTenTFGs(number, dataForm) {
    try {
        const page_number = number || 1;
        const url = `${process.env.SERVER_URL}/tfgs/pages/${page_number}`;
        const body = JSON.stringify(dataForm) || null;
        const token = process.env.TOKEN;
        if (!token) {
            throw new Error('NOT_FOUND_TOKEN');
        }
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: body,
        });
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        const data = await response.json();

        return data;
    } catch (err) {
        console.log(err)
    }
}