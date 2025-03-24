'use server'
import { cookies } from "next/headers";

export default async function GetYears() {
    try {
        const url = `${process.env.SERVER_URL}/years`;
        const token = await cookies().then(c => c.get('bytoken')?.value);
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
            throw new Error(response.statusText)
        }
        const data = await response.json();
        return data.data;
    } catch (err) {
        console.log(err)
    }
}