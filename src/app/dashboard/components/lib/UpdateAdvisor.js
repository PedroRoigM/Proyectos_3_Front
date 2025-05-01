'use server';
import { cookies } from "next/headers";
import { handleApiError } from "../../../components/errors/api-error-service";

export default async function UpdateAdvisor(id, data) {
    try {
        const url = `${process.env.SERVER_URL}/advisors/${id}`;
        const body = JSON.stringify(data);
        const token = (await cookies()).get('bytoken')?.value;
        const response = await fetch(url, {
            method: 'PATCH',
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
        const responseData = await response.json();
        return responseData.data;
    } catch (err) {
        console.log(err)
    }
}