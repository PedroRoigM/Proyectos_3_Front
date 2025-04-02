'use server';
import { cookies } from "next/headers";

export async function getUsers() {
    try {
        const url = `${process.env.SERVER_URL}/users`;
        const token = await cookies().then(c => c.get('bytoken')?.value);
        if (!token) {
            throw new Error("Token not found");
        }
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok) {
            throw new Error("Failed to fetch users");
        }
        const dataReponse = await response.json();
        return dataReponse.data;
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
}