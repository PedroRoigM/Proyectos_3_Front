'use server';
import { cookies } from "next/headers";

export default async function GetAdvisors() {
    const url = `${process.env.SERVER_URL}/advisors`;
    const token = process.env.TOKEN;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });
    const data = await response.json();
    return data;
}