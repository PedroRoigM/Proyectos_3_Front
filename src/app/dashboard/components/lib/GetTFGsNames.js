'use server';
import { cookies } from "next/headers";

export default async function GetTFGsNames() {
    try {
        const url = `${process.env.SERVER_URL}/tfgs/names`;
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
            throw new Error(response.statusText);
        }

        const data = await response.json();
        console.log(data)
        return data;
    } catch (err) {
        console.log(err)
    }
}