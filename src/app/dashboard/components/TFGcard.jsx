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

    // Mostrar menos palabras clave para ahorrar espacio
    const displayedKeywords = tfg.keywords.slice(0, 3); // Limitamos a 3 palabras clave máximo

    return (
        <div style={styles.card}>
            <Link href={`/dashboard/tfg/${tfg._id}?id=${tfg._id}`} className="block">
                <div className="p-3 hover:bg-gray-50 transition"> {/* Reducido el padding */}
                    <h2 style={styles.header}>
                        {truncateText(tfg.tfgTitle, 60)} {/* Reducido el número de caracteres */}
                    </h2>
                    <h3 className="text-xs text-gray-600"> {/* Reducido el tamaño de fuente */}
                        {tfg.degree.degree}
                    </h3>
                    <p style={styles.description}>
                        {truncateText(tfg.abstract, 120)} {/* Reducido el número de caracteres */}
                    </p>
                </div>
            </Link>
            <div className="bg-[#E1E7FB] flex flex-wrap gap-1 p-2"> {/* Reducido el padding y gap */}
                {displayedKeywords.map((keyword, index) => (
                    <span key={index} style={styles.tag}>{keyword}</span>
                ))}
                {tfg.keywords.length > 3 && (
                    <span style={{ ...styles.tag, backgroundColor: '#EDF2FD' }}>
                        +{tfg.keywords.length - 3}
                    </span>
                )}
            </div>
        </div>
    );
}