'use server'

export default async function PostTFG({ formData }) {
    const url = `${process.env.SERVER_URL}/tfgs`;
    const body = JSON.stringify(formData);
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: body,
    });
    const data = response.json();
    return data;
}