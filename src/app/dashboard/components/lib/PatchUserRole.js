'use server';
import { cookies } from "next/headers";
import { handleApiError } from "../../../components/errors/api-error-service";

export async function PatchUserRole(userId, role) {
    try {
        console.log("Updating user role:", userId, role);
        const url = `${process.env.SERVER_URL}/users/role/${userId}`;
        const token = await cookies().then(c => c.get('bytoken')?.value);
        const body = JSON.stringify({ role });
        const response = await fetch(url, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: body,
        });
        console.log("Response:", response);
        if (!response.ok) {
            const data = await response.json();
            return handleApiError(data);
        }
        const dataReponse = await response.json();
        return dataReponse.data;
    } catch (error) {
        console.error("Error updating user role:", error);
        throw error;
    }
}