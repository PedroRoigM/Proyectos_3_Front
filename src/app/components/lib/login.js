'use server';
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
export default async function PostLogin(dataForm) {
    const url = `${process.env.SERVER_URL}/users/login`;
    const body = JSON.stringify(dataForm);
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: body,
    });
    console.log(response)
    if (!response.ok) {
        return null;
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
    redirect('/dashboard');
}