"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, LogOut, Search, Settings, Users } from "lucide-react";
import { styles } from "../styles/components";

export default function AdminTopBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showAdminMenu, setShowAdminMenu] = useState(false);

  const handleLogout = () => {
    document.cookie = "bytoken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    window.location.href = "/";
  };

  return (
    <header className={`${styles.header.base} ${styles.header.admin}`}>
      <div className={`${styles.general.container} ${styles.general.flex} ${styles.general.justifyBetween} ${styles.general.itemsCenter}`}>
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
        <button onClick={() => setIsOpen(!isOpen)} className={styles.navigation.mobile}>
          {isOpen ? <X size={32} /> : <Menu size={32} />}
        </button>
      </div>

      {/* Menú desplegable en móvil */}
      {isOpen && (
        <nav className={styles.navigation.mobile}>
          <Link href="/dashboard" className={styles.navigation.link} onClick={() => setIsOpen(false)}>
            Destacados
          </Link>
          <Link href="/dashboard/upload-tfg" className={styles.navigation.link} onClick={() => setIsOpen(false)}>
            Subir TFG
          </Link>
          <button onClick={handleLogout} className={styles.navigation.logoutButton}>
            <LogOut size={18} />
            <span>Cerrar sesión</span>
          </button>
        </nav>
      )}
    </header>
  );
}