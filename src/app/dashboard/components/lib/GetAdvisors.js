'use server';
import { cookies } from "next/headers";

export default async function GetAdvisors() {
    try {
        const url = `${process.env.SERVER_URL}/advisors`;
        const token = process.env.TOKEN;
        if (!token) {
            throw new Error('Token not found');
        }
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
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