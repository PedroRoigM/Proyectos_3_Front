'use server'
import { cookies } from "next/headers";

export default async function GetTFG(id) {
    try {
        const url = `${process.env.SERVER_URL}/tfgs/${id}`;
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
        console.log(response)
        if (!response.ok) {
            throw new Error(response.statusText);
        }

        const data = await response.json();

        return data._doc;
    } catch (err) {
        console.log(err)
    }
}