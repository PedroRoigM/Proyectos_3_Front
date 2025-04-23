import React from 'react';
import CategoryCard from './CategoryCard';

const CategoryList = ({
    items,
    type,
    title,
    showInactive,
    onDelete,
    onToggleStatus,
    styles,
    searchTerm
}) => {
    // Determinar el mensaje a mostrar cuando no hay resultados
    const getEmptyMessage = () => {
        if (searchTerm) {
            return `No se encontraron ${type === 'advisor' ? 'tutores' :
                type === 'degree' ? 'grados' : 'años'
                } que coincidan con "${searchTerm}".`;
        }

        return showInactive
            ? `No hay ${type === 'advisor' ? 'tutores' : type === 'degree' ? 'grados' : 'años'} disponibles.`
            : `No hay ${type === 'advisor' ? 'tutores' : type === 'degree' ? 'grados' : 'años'} activos. Activa el interruptor para ver todos los ${type === 'advisor' ? 'tutores' : type === 'degree' ? 'grados' : 'años'}.`;
    };

    return (
        <div className={styles.panel.content.container}>
            <h2 className={styles.panel.content.title}>{title}</h2>

            {items.length > 0 ? (
                <div className={styles.panel.content.filter}>
                    {items.map((item) => (
                        <CategoryCard
                            key={item._id}
                            id={item._id}
                            title={type === 'advisor' ? item.advisor : type === 'degree' ? item.degree : item.year}
                            type={type}
                            onDelete={onDelete}
                            onToggleStatus={onToggleStatus}
                            isActive={item.active}
                        />
                    ))}
                </div>
            ) : (
                <div className={styles.panel.content.nofiltered}>
                    <p className={styles.panel.content.text}>
                        {getEmptyMessage()}
                    </p>
                </div>
            )}
        </div>
    );
};

export default CategoryList;