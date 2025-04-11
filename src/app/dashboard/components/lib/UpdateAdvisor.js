'use server';
import { cookies } from "next/headers";

export default async function UpdateAdvisor(id, data) {

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
        return null;
    }
    const responseData = await response.json();
    return responseData.data;
}