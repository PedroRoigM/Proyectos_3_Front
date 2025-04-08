'use server';
import { cookies } from "next/headers";
import errorHandler from "../../../components/errors/Errors";
export default async function DeleteAdvisor(id) {
    try {
        const url = `${process.env.SERVER_URL}/advisors/${id}`;
        const token = (await cookies()).get('bytoken')?.value;
        if (!token) {
            throw new Error('Token not found');
        }
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Error desconocido');
        }
        const data = await response.json();
        return data;
    } catch (err) {
        console.log(err)
    }
}