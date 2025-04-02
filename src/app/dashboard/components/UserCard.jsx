'use client';
import React from 'react';
import { useState } from 'react';
import { PatchUserRole } from './lib/PatchUserRole'; // Importa la función para actualizar el rol del usuario
const UserCard = ({ user }) => {
    const [role, setRole] = useState(user.role); // Estado local para el rol del usuario
    const [roles, setRoles] = useState([
        { name: 'Administrador' },
        { name: 'Usuario' },
        { name: 'Coordinador' },
    ]);

    const handleRoleChange = async (newRole) => {
        setRole(newRole); // Actualiza el estado local del rol
        try {
            const response = await PatchUserRole(user._id, newRole); // Llama a la función para actualizar el rol en el servidor
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
        <div className="border border-gray-400 rounded-lg overflow-hidden shadow-md mb-4">
            <div className="cursor-pointer bg-gray-100 p-4">
                <h2 className="text-lg font-semibold mb-2">{user.name}</h2>
                <p className="text-gray-600">Email: {user.email}</p>
                <p className="text-gray-600">Role: {user.role}</p>
            </div>
            <div className="p-4 bg-gray-50">
                <h3 className="text-md font-semibold mb-2">Change Role</h3>
                <select
                    value={role}
                    onChange={(e) => handleRoleChange(e.target.value)}
                    className="border border-gray-300 rounded-md p-2"
                >
                    {roles.map((roleOption, index) => (
                        <option key={index} value={roleOption.name}>
                            {roleOption.name}
                        </option>
                    ))}
                </select>
                <button
                    onClick={() => handleRoleChange(role)}
                    className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md"
                >
                    Update Role
                </button>
            </div>

        </div>
    );
}

export default UserCard;