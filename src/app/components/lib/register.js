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
        (await cookies()).set({
            name: 'bytoken',
            value: token,
            path: '/',
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 60 * 5, // 5 minutes
        });
    } catch (error) {
        console.error("Error registering user:", error);
    }

    redirect('/validation');
}