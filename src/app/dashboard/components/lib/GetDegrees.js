'use server'
import { cookies } from "next/headers";

export default async function GetDegrees(dataForm) {
    try {
        const url = `${process.env.SERVER_URL}/degrees/get`;
        const token = await cookies().then(c => c.get('bytoken')?.value);
        if (!token) {
            throw new Error('Token not found');
        }
        const body = JSON.stringify(dataForm) || null;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${token}`,
            },
            body: body,
        });
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        const data = await response.json();

        return data.data;
    } catch (err) {
        console.log(err)
    }
}