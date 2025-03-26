'use client';

import { useUser } from './UserContext';
import UserTopBar from './topbars/UserTopBar';
import CoordinatorTopBar from './topbars/CoordinatorTopBar';
import AdminTopBar from './topbars/AdminTopBar';
export default function TopBarSelector() {
    const { role, isLoading } = useUser();

    // Mientras se carga la información del usuario
    if (isLoading) {
        return (
            <div className="w-full bg-white border-b-[2px] border-gray-200 shadow-md p-4">
                <div className="flex justify-center">
                    <div className="w-8 h-8 animate-spin rounded-full border-2 border-t-2 border-t-[#0065ef] border-gray-300"></div>
                </div>
            </div>
        );
    }

    // Seleccionar el TopBar según el rol
    if (role === 'administrador') {
        return <AdminTopBar />;
    } else if (role === 'coordinador') {
        return <CoordinatorTopBar />;
    } else {
        return <UserTopBar />;
    }
}