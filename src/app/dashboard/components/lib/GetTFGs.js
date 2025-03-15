'use server'
//import { cookies } from "next/headers";

export default async function GetTFGs() {
    try {
        const url = `${process.env.SERVER_URL}/tfgs`;
        const token = process.env.TOKEN;
        if (!token) {
            throw new Error('Token not found');
        }
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        const data = response.json();
        return data;
    } catch (err) {
        console.log(err)
    }
}