'use server';
import { cookies } from "next/headers";

export async function PatchUserRole(userId, role) {
    try {
        const url = `${process.env.SERVER_URL}/users/role/${userId}`;
        const token = await cookies().then(c => c.get('bytoken')?.value);
        const response = await fetch(url, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ role }),
        });
        if (!response.ok) {
            throw new Error("Failed to update user role");
        }
        const dataReponse = await response.json();
        return dataReponse.data;
    } catch (error) {
        console.error("Error updating user role:", error);
        throw error;
    }
}