'use client';
import React from 'react';
import { useState, useEffect } from 'react';
import { PatchUserRole } from './lib/PatchUserRole';

const UserCard = ({ user }) => {
    const [role, setRole] = useState(user.role);
    const [roles, setRoles] = useState([
        { name: 'administrador' },
        { name: 'usuario' },
        { name: 'coordinador' },
    ]);

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
        setRole(newRole);
        try {
            const response = await PatchUserRole(user._id, newRole);
            if (response) {
                console.log('User role updated successfully:', response);
            } else {
                console.error('Error updating user role:', response);
            }
        } catch (error) {
            console.error('Error updating user role:', error);
        }
    }

    return (
        <div className="flex justify-between items-center border border-gray-400 rounded-lg overflow-hidden shadow-md mb-4">
            <div className="cursor-pointer bg-gray-100 p-4">
                <h2 className="text-lg font-semibold mb-2">{user.name}</h2>
                <p className="text-gray-600">{user.email}</p>
            </div>
            <div className="p-4">
                <select
                    value={role}
                    onChange={(e) => handleRoleChange(e.target.value)}
                    className="border border-gray-300 rounded-md p-2"
                >
                    {roles.map((roleOption, index) => (
                        <option
                            key={index}
                            value={roleOption.name}
                        >
                            {roleOption.name}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}

export default UserCard;