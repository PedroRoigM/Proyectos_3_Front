'use server';
import { cookies } from "next/headers";
import { handleApiError } from "../../../components/errors/api-error-service";

export default async function GetUnverifiedTFGs(page_number, formData) {
    try {
        page_number = page_number || 1;
        formData = formData || {};
        const url = `${process.env.SERVER_URL}/tfgs/unverified/${page_number}`;
        const token = await cookies().then(c => c.get('bytoken')?.value);
        const body = JSON.stringify(formData);
        if (!token) {
            throw new Error('Token not found');
        }
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: body
        });
        if (!response.ok) {
            const data = await response.json();
            return handleApiError(data);
        }

        const dataResponse = await response.json();
        return dataResponse.data;
    } catch (err) {
        console.log(err)
    }
}