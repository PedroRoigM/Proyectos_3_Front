'use server';
import { cookies } from "next/headers";

export default async function PostAdvisor(advisor) {
    const url = `${process.env.SERVER_URL}/advisors`;
    const token = process.env.TOKEN;
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(advisor),
    });
    const data = await response.json();
    return data;
}