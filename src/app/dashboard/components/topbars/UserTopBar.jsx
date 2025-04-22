"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, LogOut } from "lucide-react";
import { styles } from "../styles/components";
import AccountLogOut from "../lib/AccountLogOutLogOut";
export default function UserTopBar() {
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await AccountLogOut();
  };

  return (
    <header className={`${styles.header.base} ${styles.header.user}`}>
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