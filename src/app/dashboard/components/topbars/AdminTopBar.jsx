// src/app/dashboard/components/topbars/AdminTopBar.jsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, LogOut, Search, Settings, Users } from "lucide-react";
import { styles } from "../styles/components";
import AccountLogOut from "../lib/AccountLogOutLogOut";

export default function AdminTopBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showAdminMenu, setShowAdminMenu] = useState(false);
  const [showMobileAdminMenu, setShowMobileAdminMenu] = useState(false);

  const handleLogout = async () => {
    await AccountLogOut();
  };

  return (
    <header className={`${styles.header.base} ${styles.header.admin}`}>
      <div className="mx-[14%] sm:px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/dashboard">
          <Image src="/logo.jpg" alt="Logo" width={120} height={120} className={styles.header.logo} />
        </Link>

        {/* Menú en escritorio */}
        <nav className={styles.navigation.desktop}>
          <Link href="/dashboard" className={styles.navigation.link}>
            Destacados
          </Link>
          <Link href="/dashboard/upload-tfg" className={styles.navigation.link}>
            Subir TFG
          </Link>
          <Link href="/dashboard/admin/search" className={styles.navigation.adminLink}>
            <Search size={18} />
            <span>Revisión</span>
          </Link>
          <div className={styles.dropdown.container}>
            <button
              onClick={() => setShowAdminMenu(!showAdminMenu)}
              className={`${styles.general.flex} ${styles.general.itemsCenter} gap-1 text-[#14192c] font-semibold ${styles.general.transition} p-2 ${styles.general.rounded}`}
            >
              <Settings size={18} />
              <span>Admin</span>
            </button>
            {showAdminMenu && (
              <div className={styles.dropdown.menu}>
                <Link href="/dashboard/admin/roles" className={styles.dropdown.item}>
                  <Users size={16} />
                  <span>Gestionar Usuarios</span>
                </Link>
                <Link href="/dashboard/admin/control-panel" className={styles.dropdown.item}>
                  <span>Panel de Control</span>
                </Link>
              </div>
            )}
          </div>
          <button onClick={handleLogout} className={styles.navigation.logoutButton}>
            <LogOut size={18} />
            <span>Cerrar sesión</span>
          </button>
        </nav>

        {/* Menú hamburguesa en móvil */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden"
        >
          {isOpen ? <X size={32} /> : <Menu size={32} />}
        </button>
      </div>

      {/* Menú desplegable en móvil */}
      {isOpen && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <nav className={styles.navigation.mobile}>
            <Link href="/dashboard" className={styles.navigation.link} onClick={() => setIsOpen(false)}>
              Destacados
            </Link>
            <Link href="/dashboard/upload-tfg" className={styles.navigation.link} onClick={() => setIsOpen(false)}>
              Subir TFG
            </Link>
            <Link href="/dashboard/admin/search" className={styles.navigation.adminLink} onClick={() => setIsOpen(false)}>
              <Search size={18} />
              <span>Revisión</span>
            </Link>

            {/* Opciones de Admin en el menú móvil */}
            <div className="w-full border-t border-gray-300 my-2 pt-2">
              <button
                onClick={() => setShowMobileAdminMenu(!showMobileAdminMenu)}
                className={`${styles.general.flex} ${styles.general.itemsCenter} gap-1 text-[#14192c] font-semibold ${styles.general.transition} p-2 w-full`}
              >
                <Settings size={18} />
                <span>Admin</span>
                <span className="ml-auto">{showMobileAdminMenu ? "▲" : "▼"}</span>
              </button>

              {showMobileAdminMenu && (
                <div className="pl-6 flex flex-col gap-2 mt-2">
                  <Link href="/dashboard/admin/roles" className={styles.navigation.link} onClick={() => setIsOpen(false)}>
                    <div className="flex items-center gap-2">
                      <Users size={16} />
                      <span>Gestionar Usuarios</span>
                    </div>
                  </Link>
                  <Link href="/dashboard/admin/control-panel" className={styles.navigation.link} onClick={() => setIsOpen(false)}>
                    <span>Panel de Control</span>
                  </Link>
                </div>
              )}
            </div>

            <button onClick={handleLogout} className={styles.navigation.logoutButton}>
              <LogOut size={18} />
              <span>Cerrar sesión</span>
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}