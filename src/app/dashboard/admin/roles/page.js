'use client';
import React from 'react';
import { useState, useEffect } from 'react';
import UserCard from '../components/UserCard';
import GetUsers from '../../components/lib/GetUsers';
import { styles, inputClassName } from '../components/styles/components'
import LoadingSpinner from '../../components/LoadingSpinner';

export default function Page() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await GetUsers();
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
        return <LoadingSpinner message="Cargando página..." />;
    }

    return (
        <div className={styles.roles.container}>
            <h1 className={styles.roles.title}>User List</h1>
            {users.map((user) => (
                <UserCard key={user._id} user={user} />
            ))}
        </div>
    );
}