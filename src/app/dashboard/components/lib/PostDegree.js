'use server';
import { cookies } from "next/headers";
import { handleApiError } from "../../../components/errors/api-error-service";

export default async function postDegree(degree) {
    try {
        const url = `${process.env.SERVER_URL}/degrees`;
        const token = await cookies().then(c => c.get('bytoken')?.value);
        if (!token) {
            throw new Error('Token not found');
        }
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(degree)
        });
        if (!response.ok) {
            const data = await response.json();
            return handleApiError(data);
        }
        const data = response.json();
        return data;
    } catch (err) {
        console.log(err)
    }
}

