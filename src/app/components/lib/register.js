'use server';
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import errorHandler from "../errors/Errors";
export default async function PostRegister(dataForm) {
    try {
        const url = `${process.env.SERVER_URL}/users/register`;
        const body = JSON.stringify(dataForm);
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: body,
        });
        if (!response.ok) {
            const data = await response.json();
            return errorHandler(data);
        }
        const user = await response.json();
        (await cookies()).set({
            name: 'bytoken',
            value: user.data.token,
            path: '/',
        });
    } catch (error) {
        console.error("Error registering user:", error);
    }

    redirect('/validation');
}