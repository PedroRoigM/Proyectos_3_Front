'use server';
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
export default async function PostRegister(dataForm) {
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
        throw new Error(response.statusText);
    }
    const user = await response.json();

    if (!user) {
        return null;
    }
    (await cookies()).set({
        name: 'bytoken',
        value: user.token,
        path: '/',
    });
    redirect('/validation');
}