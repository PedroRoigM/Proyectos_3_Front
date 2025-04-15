'use server'
import { cookies } from "next/headers";

export default async function GetYears(dataForm) {
    try {
        const url = `${process.env.SERVER_URL}/years/get`;
        const token = await cookies().then(c => c.get('bytoken')?.value);
        if (!token) {
            throw new Error('Token not found');
        }
        const body = JSON.stringify(dataForm) || null;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: body,
        });
        if (!response.ok) {
            const data = await response.json();
            return errorHandler(data)
        }
        const data = await response.json();
        return data.data;
    } catch (err) {
        console.log(err)
    }
}