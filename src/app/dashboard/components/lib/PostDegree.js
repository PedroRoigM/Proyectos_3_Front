'use server';
import { cookies } from "next/headers";

export default async function postDegree({ degree }) {
    const url = `${process.env.SERVER_URL}/degrees`;
    const token = process.env.TOKEN;
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(degree)
    });
    const data = response.json();
    return data;
}

