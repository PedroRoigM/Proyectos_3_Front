'use server';
import { cookies } from "next/headers";

export default async function PutTFG(id, dataForm) {
    try {
        const url = `${process.env.SERVER_URL}/tfgs/${id}`;
        const body = JSON.stringify(dataForm);
        const token = await cookies().then(c => c.get('bytoken')?.value);

        if (!token) {
            throw new Error('NOT_FOUND_TOKEN');
        }

        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: body,
        });
        if (!response.ok) {
            throw new Error(response.statusText);
        }

        const data = await response.json();
        return data;
    } catch (err) {
        return null;
    }
}