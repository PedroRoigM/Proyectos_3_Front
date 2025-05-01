'use server';
import { cookies } from "next/headers";
import { handleApiError } from "../../../components/errors/api-error-service";

export default async function GetAdvisors(dataForm) {
    try {
        const url = `${process.env.SERVER_URL}/advisors/get`;
        const token = await cookies().then(c => c.get('bytoken')?.value);
        const body = JSON.stringify(dataForm) || null;
        if (!token) {
            throw new Error('Token not found');
        }
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
            return handleApiError(data);
        }

        const data = await response.json();
        return data.data;
    } catch (err) {
        console.log(err)
    }
}