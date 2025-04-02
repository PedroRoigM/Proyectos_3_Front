'use server'
import { cookies } from "next/headers";
export default async function PostTFG(formData) {
    try {
        console.log(formData);
        const url = `${process.env.SERVER_URL}/tfgs`;
        const token = await cookies().then(c => c.get('bytoken')?.value);
        if (!token) {
            throw new Error('Token not found');
        }
        const body = JSON.stringify(formData);
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: body,
        });
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        const dataResponse = await response.json();
        return dataResponse.data;
    } catch (err) {
        console.log(err)
    }
}