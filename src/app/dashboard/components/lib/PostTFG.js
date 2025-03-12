'use server'

export default async function PostTFG({ formData }) {
    const url = `${process.env.SERVER_URL}/tfgs`;
    const token = process.env.TOKEN;
    const body = JSON.stringify(formData);
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: body,
    });
    const data = await response.json();
    return data;
}