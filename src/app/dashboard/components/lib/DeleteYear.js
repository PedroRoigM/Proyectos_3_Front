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
                'Authorization': `Bearer ${token}`,
            },
        });
        if (!response.ok) {
            const data = await response.json();
            return errorHandler(data)
        }
        const data = await response.json();
        return data;
    } catch (err) {
        console.log(err)
    }
}