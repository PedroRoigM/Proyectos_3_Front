'use server';

import { cookies } from "next/headers";

export default async function PatchValidateTFG(id) {
    try {
        const url = `${process.env.SERVER_URL}/tfgs/verify/${id}`;
        const token = await cookies().then(c => c.get('bytoken')?.value);
        if (!token) {
            throw new Error('Token not found');
        }
        const response = await fetch(url, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
        if (!response.ok) {
            const data = await response.json();
            return errorHandler(data)
        }

        const data = response.json();
        return data;
    } catch (err) {
        console.log(err)
    }
}