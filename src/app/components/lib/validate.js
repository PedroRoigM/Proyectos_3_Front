'use server';
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
export default async function PatchValidation(code) {
    try {
        const url = `${process.env.SERVER_URL}/users/validate`;
        const token = await cookies().then(c => c.get('bytoken')?.value);
        if (!token) {
            throw new Error('Token not found');
        }
        const body = JSON.stringify({ code: code });

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: body,
        });
        if (!response.ok) {
            return null;
        }
        const user = await response.json();
        if (!user) {
            throw new Error('User not found');
        }
        // Borrar cookie
        (await cookies()).delete('bytoken');
    } catch (error) {
        console.error("Error validating user:", error);
    }
    redirect('/');

}