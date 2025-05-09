'use client';
import React from 'react';
import { useState, useEffect } from 'react';
import { PatchUserRole } from '../../components/lib/PatchUserRole';
import { useNotification } from '../../../components/errors/notification-context';
import { useApiError } from '../../../components/errors/api-error-hook';

const UserCard = ({ user, onRoleChange }) => {
    const [role, setRole] = useState(user.role);
    const [roles, setRoles] = useState([
        { name: 'administrador' },
        { name: 'usuario' },
        { name: 'coordinador' },
    ]);

    const { showSuccess, showError } = useNotification();
    const { loading, executeRequest } = useApiError();

    // Asegura que el rol del usuario coincida con alguna de las opciones disponibles
    useEffect(() => {
        // Verifica si el rol del usuario existe en el array de roles
        const roleExists = roles.some(r => r.name === user.role);

        // Si no existe, actualiza el array de roles para incluirlo
        if (!roleExists) {
            setRoles(prevRoles => [...prevRoles, { name: user.role }]);
        }
    }, [user.role, roles]);

    const handleRoleChange = async (newRole) => {
        if (newRole === role) return; // Evitar peticiones innecesarias

        try {
            const response = await executeRequest(
                async () => await PatchUserRole(user._id, newRole),
                {
                    loadingMessage: 'Actualizando rol...',
                    errorMessage: `Error al actualizar el rol de ${user.name}`
                }
            );

            if (response) {
                setRole(newRole);
                showSuccess(`Rol de ${user.name} actualizado a ${newRole}`);

                // Notificar al componente padre del cambio
                if (onRoleChange) {
                    onRoleChange({
                        ...user,
                        role: newRole
                    });
                }
            } else {
                showError(`No se pudo actualizar el rol de ${user.name}`);
                // Restaurar el rol anterior
                setRole(user.role);
            }
        } catch (error) {
            console.error('Error updating user role:', error);
            showError(`No se pudo actualizar el rol de ${user.name}`);
            // Restaurar el rol anterior
            setRole(user.role);
        }
    };

    return (
        <div className="flex justify-between items-center border border-gray-400 rounded-lg overflow-hidden shadow-md mb-4 p-4 bg-white hover:bg-gray-50 transition">
            <div className="flex-1">
                <h2 className="text-lg font-semibold mb-2 text-gray-800">{user.name}</h2>
                <p className="text-gray-600">{user.email}</p>
            </div>
            <div className="flex items-center">
                <div className="flex gap-1">
                    {roles.map((roleOption) => (
                        <button
                            key={roleOption.name}
                            onClick={() => handleRoleChange(roleOption.name)}
                            disabled={loading}
                            className={`px-3 py-2 rounded-full border text-15px font-medium transition ${
                                role === roleOption.name
                                    ? "bg-blue-600 text-white border-blue-600"
                                    : "bg-white text-gray-700 border-gray-300"
                            }`}
                        >
                            {roleOption.name.charAt(0).toUpperCase() + roleOption.name.slice(1)}
                        </button>
                    ))}
                </div>
                {loading && (
                    <div className="ml-2">
                        <div className="w-5 h-5 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserCard;