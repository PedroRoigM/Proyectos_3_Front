'use client';

import { useState, useEffect } from 'react';
import { getUserRole } from './UserContext';
import UserTopBar from './topbars/UserTopBar';
import CoordinatorTopBar from './topbars/CoordinatorTopBar';
import AdminTopBar from './topbars/AdminTopBar';

export default function TopBarSelector() {
    const [role, setRole] = useState(null);

    useEffect(() => {
        async function fetchUserRole() {
            try {
                const userData = await getUserRole();
                setRole(userData.role);
            } catch (error) {
                console.error('Error al obtener el rol:', error);
            }
        }

        fetchUserRole();
    }, []);

    // Seleccionar el TopBar según el rol
    if (role === 'administrador') {
        return <AdminTopBar />;
    } else if (role === 'coordinador') {
        return <CoordinatorTopBar />;
    } else {
        return <UserTopBar />;
    }
}