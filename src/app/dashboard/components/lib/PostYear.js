'use server';
import { cookies } from "next/headers";

export default async function postYear() {
    const url = `${process.env.SERVER_URL}/years`;
    const token = process.env.TOKEN;
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(degree)
    });
    const data = await response.json();
    return data;
}