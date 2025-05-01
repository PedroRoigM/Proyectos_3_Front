'use server';
import { cookies } from "next/headers";
import { handleApiError } from "../../../components/errors/api-error-service";

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
            const data = await response.json();
            return handleApiError(data);
        }
        const data = await response.arrayBuffer();
        return data
    } catch (error) {
        console.log(error);
    }
}