'use server'
import { cookies } from "next/headers";

export default async function GetDifferentDegrees() {
    const url = `${process.env.SERVER_URL}/degrees`;
    const token = process.env.TOKEN;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${token}`,
        },
    });
    const data = await response.json();

    return data;
}