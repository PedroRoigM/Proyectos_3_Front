'use client';
import React from 'react';
import { useState, useEffect } from 'react';
import UserCard from '../../components/UserCard';
import { getUsers } from '../../components/lib/GetUsers';

export default function Page() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await getUsers();
                setUsers(data);
            } catch (error) {
                console.error('Error fetching users:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">User List</h1>
            {users.map((user) => (
                <UserCard key={user._id} user={user} />
            ))}
        </div>
    );
}