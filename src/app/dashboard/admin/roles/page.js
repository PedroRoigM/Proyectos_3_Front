'use client';
import React from 'react';
import { useState, useEffect } from 'react';
import UserCard from '../components/UserCard';
import GetUsers from '../../components/lib/GetUsers';
import { styles } from '../components/styles/components';
import LoadingSpinner from '../../components/LoadingSpinner';
import { ErrorBoundary } from '../../../components/errors/error-boundary';
import { useNotification } from '../../../components/errors/notification-context';
import { useApiError } from '../../../components/errors/api-error-hook';

function UserRolesContent() {
    const [users, setUsers] = useState([]);
    const { showError } = useNotification();
    const { loading, executeRequest } = useApiError();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await executeRequest(
                    async () => await GetUsers(),
                    {
                        loadingMessage: 'Cargando usuarios...',
                        errorMessage: 'Error al cargar usuarios'
                    }
                );

                if (data) {
                    setUsers(data);
                } else {
                    showError('No se pudieron cargar los usuarios');
                }
            } catch (error) {
                console.error('Error fetching users:', error);
                showError('Ha ocurrido un error al cargar los usuarios');
            }
        };

        fetchUsers();
    }, [executeRequest, showError]);

    // Función para actualizar la lista después de un cambio de rol
    const handleRoleChange = (updatedUser) => {
        setUsers(prevUsers =>
            prevUsers.map(user =>
                user._id === updatedUser._id ? updatedUser : user
            )
        );
    };

    if (loading) {
        return <LoadingSpinner message="Cargando usuarios..." />;
    }

    return (
        <div className={styles.roles.container}>
            <h1 className={styles.roles.title}>Gestión de Usuarios</h1>

            {users.length > 0 ? (
                <div className="mt-6 space-y-4">
                    {users.map((user) => (
                        <UserCard
                            key={user._id}
                            user={user}
                            onRoleChange={handleRoleChange}
                        />
                    ))}
                </div>
            ) : (
                <p className="text-center py-8 text-gray-500">
                    No se encontraron usuarios.
                </p>
            )}
        </div>
    );
}

export default function UserRolesPage() {
    return (
        <ErrorBoundary>
            <UserRolesContent />
        </ErrorBoundary>
    );
}