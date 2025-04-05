'use server';
import { cookies } from "next/headers";

export default async function GetTFGpdf(id) {
    try {
        const url = `${process.env.SERVER_URL}/tfgs/pdf/${id}`;
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
        const data = await response.arrayBuffer();
        return data
    } catch (error) {
        console.log(error);
    }
}