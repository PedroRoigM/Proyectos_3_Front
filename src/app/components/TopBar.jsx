// Componente que renderiza a barra superior da dashboard
import Image from 'next/image';
import React from 'react';
import Link from 'next/link';
import { styles } from './styles/components';

export default function TopBar() {
    return (
        <div className={styles.layout.topBar}>
            {/* Logo */}
            <Image src="/logo.jpg" alt="Logo" width="150" height="150" />
        </div>
    );
}