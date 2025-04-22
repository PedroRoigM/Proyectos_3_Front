'use server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function AccountLogOut() {
    const cookieStore = cookies();
    cookieStore.set('bytoken', '', { path: '/', expires: new Date(0) });
    redirect('/');
}