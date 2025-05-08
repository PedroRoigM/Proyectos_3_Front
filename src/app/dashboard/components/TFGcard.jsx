// Componente que renderiza una tarjeta con la información de un TFG
import React from 'react';
import Link from 'next/link';
import styles from './styles/TFGcard';

export default function TFGcard({ tfg }) {
    const truncateText = (text, maxLength) => {
        if (!text) {
            return '';
        }
        if (text.length <= maxLength) {
            return text;
        }
        return text.substring(0, maxLength) + '...';
    };

    return (
        <div style={styles.card}>
            <Link href={`/dashboard/tfg/${tfg._id}?id=${tfg._id}`} className="block">
                <div className="bg-gray-200 p-4 hover:bg-gray-300 transition">
                    <h2 className="text-lg md:text-xl font-semibold" style={styles.header}>
                        {truncateText(tfg.tfgTitle, 80)}
                    </h2>
                    <h3 className="text-sm md:text-md text-gray-700" style={styles.description}>
                        {tfg.degree.degree}
                    </h3>
                    <p className="text-xs md:text-sm text-gray-600" style={styles.description}>
                        {truncateText(tfg.abstract, 180)}
                    </p>
                </div>
            </Link>
            <div className="bg-[#E1E7FB] flex flex-wrap gap-2 p-2">
                {tfg.keywords.map((keyword, index) => (
                    <span key={index} style={styles.tag}>{keyword}</span>
                ))}
            </div>
        </div>
    );
}