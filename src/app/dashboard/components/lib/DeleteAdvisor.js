'use server';
import { cookies } from "next/headers";

export default async function DeleteAdvisor(id) {
    const url = `${process.env.SERVER_URL}/advisors/${id}`;
    const token = process.env.TOKEN;
    const response = await fetch(url, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authentication': `Bearer ${token}`,
        },
    });
    const data = await response.json();
    return data;
}