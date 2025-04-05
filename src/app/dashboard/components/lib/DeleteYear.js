'use server'
import { cookies } from "next/headers";

export default async function DeleteYear({ id }) {
    try {
        const url = `${process.env.SERVER_URL}/years/${id}`;
        const token = (await cookies()).get('bytoken')?.value;
        if (!token) {
            throw new Error('Token not found');
        }
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authentication': `Bearer ${token}`,
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