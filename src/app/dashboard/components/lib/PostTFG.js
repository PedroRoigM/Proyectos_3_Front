'use server'

export default async function PostTFG(formData) {
    try {
        const url = `${process.env.SERVER_URL}/tfgs`;
        const token = process.env.TOKEN;
        if (!token) {
            throw new Error('Token not found');
        }
        const body = JSON.stringify(formData);
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: body,
        });
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        const data = await response.json();
        return data;
    } catch (err) {
        console.log(err)
    }
}