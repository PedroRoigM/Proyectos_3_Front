'use server';
import { cookies } from "next/headers";
import { handleApiError } from "../../../components/errors/api-error-service";

export default async function GetTFGsNames() {
    try {
        const url = `${process.env.SERVER_URL}/tfgs/names`;
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
            const data = await response.json();
            return handleApiError(data);
        }

        const data = await response.json();
        return data;
    } catch (err) {
        console.log(err)
    }
}