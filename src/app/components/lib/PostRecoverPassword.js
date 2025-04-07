'use server';
import errorHandler from "../errors/Errors";
export default async function PostRecoverPassword(email) {
    try {
        const url = `${process.env.SERVER_URL}/users/recover-password`;
        const body = JSON.stringify({ email });
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
        const data = await response.json();
        return data;
    } catch (err) {
        return null;
    }
}