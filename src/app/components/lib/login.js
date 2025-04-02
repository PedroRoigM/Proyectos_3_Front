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
    if (!response.ok) {
        return null;
    }
    const responseData = await response.json();

    const { token, user } = responseData.data;
    if (!token || !user) {
        return null;
    }
    (await cookies()).set({
        name: 'bytoken',
        value: token,
        path: '/',
    });
    redirect('/dashboard');
}