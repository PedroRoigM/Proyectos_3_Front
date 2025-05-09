'use server'
import { cookies } from "next/headers";
import { handleApiError } from "../../../components/errors/api-error-service";

export default async function PostTenTFGs(number, dataForm) {
    try {
        const page_number = number || 1;
        const url = `${process.env.SERVER_URL}/tfgs/pages/${page_number}`;
        const body = JSON.stringify(dataForm) || null;
        const token = await cookies().then(c => c.get('bytoken')?.value);
        if (!token) {
            throw new Error('NOT_FOUND_TOKEN');
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
        const dataResponse = await response.json();
        return dataResponse.data;
    } catch (err) {
        console.log(err)
    }
}