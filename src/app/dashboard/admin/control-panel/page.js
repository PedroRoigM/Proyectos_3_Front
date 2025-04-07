'use client';
import React, { useState, useEffect } from 'react';
import { styles, inputClassName } from '../components/styles/components'
import GetAdvisors from '../../components/lib/GetAdvisors';
import GetDegrees from '../../components/lib/GetDegrees';
import GetYears from '../../components/lib/GetYears';
import LoadingSpinner from '../../components/LoadingSpinner';
import DeleteAdvisor from '../../components/lib/DeleteAdvisor';
import DeleteDegree from '../../components/lib/DeleteDegree';
import DeleteYear from '../../components/lib/DeleteYear';
import PostAdvisor from '../../components/lib/PostAdvisor';
import PostDegree from '../../components/lib/PostDegree';
import PostYear from '../../components/lib/PostYear';
import UpdateAdvisor from '../../components/lib/UpdateAdvisor';
import UpdateDegree from '../../components/lib/UpdateDegree';
import UpdateYear from '../../components/lib/UpdateYear';
import CategoryCard from '../../components/CategoryCard';

export default function ControlPanel() {
    // Estados principales para los datos
    const [advisors, setAdvisors] = useState([]);
    const [degrees, setDegrees] = useState([]);
    const [years, setYears] = useState([]);
    const [loading, setLoading] = useState(true);

    // Estado para controlar la pestaña activa
    const [activeTab, setActiveTab] = useState('advisors');

    // Estados para nuevos elementos
    const [newAdvisor, setNewAdvisor] = useState('');
    const [newDegree, setNewDegree] = useState('');
    const [newYear, setNewYear] = useState('');

    // Estados para el filtro y modales
    const [showInactive, setShowInactive] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('');
    const [itemToModify, setItemToModify] = useState(null);

    // Cargar datos iniciales
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [advisorsData, degreesData, yearsData] = await Promise.all([
                    GetAdvisors(),
                    GetDegrees(),
                    GetYears()
                ]);

                // Convertir los datos y agregar estado "active" si no existe
                const processedAdvisors = (advisorsData || []).map(advisor => ({
                    ...advisor,
                    active: advisor.active !== undefined ? advisor.active : true
                }));

                const processedDegrees = (degreesData || []).map(degree => ({
                    ...degree,
                    active: degree.active !== undefined ? degree.active : true
                }));

                const processedYears = (yearsData || []).map(year => ({
                    ...year,
                    active: year.active !== undefined ? year.active : true
                }));

                setAdvisors(processedAdvisors);
                setDegrees(processedDegrees);
                setYears(processedYears);
                setLoading(false);
            } catch (error) {
                console.error('Error al cargar datos:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Crear un nuevo tutor
    const handleCreateAdvisor = async (e) => {
        e.preventDefault();
        if (!newAdvisor.trim()) return;

        try {
            const response = await PostAdvisor({ advisor: newAdvisor });

            if (response && response.data) {
                // Si la API devuelve el nuevo objeto, lo usamos
                setAdvisors([...advisors, { ...response.data, active: true }]);
            } else {
                // Si no, creamos un objeto temporal
                setAdvisors([...advisors, {
                    _id: `temp-${Date.now()}`,
                    advisor: newAdvisor,
                    active: true
                }]);
            }

            setNewAdvisor('');
        } catch (error) {
            console.error('Error al crear tutor:', error);
        }
    };

    // Crear un nuevo grado
    const handleCreateDegree = async (e) => {
        e.preventDefault();
        if (!newDegree.trim()) return;

        try {
            const response = await PostDegree({ degree: newDegree });

            if (response && response.data) {
                setDegrees([...degrees, { ...response.data, active: true }]);
            } else {
                setDegrees([...degrees, {
                    _id: `temp-${Date.now()}`,
                    degree: newDegree,
                    active: true
                }]);
            }

            setNewDegree('');
        } catch (error) {
            console.error('Error al crear grado:', error);
        }
    };

    // Crear un nuevo año
    const handleCreateYear = async (e) => {
        e.preventDefault();

        try {
            const response = await PostYear();

            if (response && response.data) {
                setYears([...years, { ...response.data, active: true }]);
            } else {
                setYears([...years, {
                    _id: `temp-${Date.now()}`,
                    year: newYear,
                    active: true
                }]);
            }

            setNewYear('');
        } catch (error) {
            console.error('Error al crear año:', error);
        }
    };

    // Abrir modal para eliminar
    const handleDeleteItem = (id, type) => {
        setItemToModify(id);
        setModalType(`delete-${type}`);
        setShowModal(true);
    };

    // Manejar cambio de estado (activo/inactivo)
    const handleToggleStatus = (id, type) => {
        setItemToModify(id);
        setModalType(`toggle-${type}`);
        setShowModal(true);
    };

    // Confirmar acción del modal
    const confirmModalAction = async () => {
        if (!itemToModify || !modalType) {
            setShowModal(false);
            return;
        }

        const [action, type] = modalType.split('-');

        try {
            if (action === 'delete') {
                switch (type) {
                    case 'advisor':
                        await DeleteAdvisor(itemToModify);
                        setAdvisors(advisors.filter(advisor => advisor._id !== itemToModify));
                        break;
                    case 'degree':
                        await DeleteDegree({ id: itemToModify });
                        setDegrees(degrees.filter(degree => degree._id !== itemToModify));
                        break;
                    case 'year':
                        await DeleteYear({ id: itemToModify });
                        setYears(years.filter(year => year._id !== itemToModify));
                        break;
                    default:
                        break;
                }
            } else if (action === 'toggle') {
                // Aquí deberías tener endpoints de API para cambiar el estado
                // Por ahora, simularemos cambiando solo el estado local
                switch (type) {
                    case 'advisor':
                        await UpdateAdvisor(itemToModify, { active: !advisors.find(advisor => advisor._id === itemToModify).active });
                        setAdvisors(advisors.map(advisor =>
                            advisor._id === itemToModify
                                ? { ...advisor, active: !advisor.active }
                                : advisor
                        ));
                        break;
                    case 'degree':
                        await UpdateDegree(itemToModify, { active: !degrees.find(degree => degree._id === itemToModify).active });
                        setDegrees(degrees.map(degree =>
                            degree._id === itemToModify
                                ? { ...degree, active: !degree.active }
                                : degree
                        ));
                        break;
                    case 'year':
                        await UpdateYear(itemToModify, { active: !years.find(year => year._id === itemToModify).active });
                        setYears(years.map(year =>
                            year._id === itemToModify
                                ? { ...year, active: !year.active }
                                : year
                        ));
                        break;
                    default:
                        break;
                }
            }
        } catch (error) {
            console.error(`Error al procesar acción ${action} en ${type}:`, error);
        } finally {
            setShowModal(false);
            setItemToModify(null);
            setModalType('');
        }
    };

    // Filtrar elementos según el estado activo/inactivo
    const getFilteredItems = (items) => {
        return showInactive ? items : items.filter(item => item.active);
    };

    const filteredAdvisors = getFilteredItems(advisors);
    const filteredDegrees = getFilteredItems(degrees);
    const filteredYears = getFilteredItems(years);

    if (loading) {
        return <LoadingSpinner message="Cargando panel de control..." />;
    }

    return (
        <div className={styles.layout.flexCenter}>
            {/* Encabezado */}
            <div className={styles.layout.card}>
                <h1 className={styles.layout.title}>Panel de Control</h1>
                <p className={styles.layout.subtitle}>
                    Administra tutores, grados académicos y años lectivos para la plataforma de TFGs.
                </p>
            </div>

            {/* Contenedor principal con tabs */}
            <div className={styles.tabs.container}>
                {/* Navegación por pestañas */}
                <div className={styles.tabs.container_window}>
                    <button
                        className={`${styles.tabs.window_layout}${activeTab === 'advisors'
                            ? styles.tabs.active_window
                            : styles.tabs.inactive_window
                            }`}
                        onClick={() => setActiveTab('advisors')}
                    >
                        Tutores
                    </button>
                    <button
                        className={`${styles.tabs.window_layout} ${activeTab === 'degrees'
                            ? styles.tabs.active_window
                            : styles.tabs.inactive_window
                            }`}
                        onClick={() => setActiveTab('degrees')}
                    >
                        Grados
                    </button>
                    <button
                        className={`${styles.tabs.window_layout} ${activeTab === 'years'
                            ? styles.tabs.active_window
                            : styles.tabs.inactive_window
                            }`}
                        onClick={() => setActiveTab('years')}
                    >
                        Años
                    </button>
                </div>

                {/* Contenido del panel */}
                <div className={styles.panel.container}>
                    {/* Controles superiores: filtro y formulario de creación */}
                    <div className={styles.panel.controlers}>
                        {/* Toggle para mostrar inactivos */}
                        <div className={styles.panel.toggle.container}>
                            <label className={styles.panel.toggle.label}>
                                <input
                                    type="checkbox"
                                    checked={showInactive}
                                    onChange={() => setShowInactive(!showInactive)}
                                    className={styles.panel.toggle.input}
                                />
                                <div className={styles.panel.toggle.switch}></div>
                                <span className={styles.panel.toggle.text}>
                                    Mostrar elementos inactivos
                                </span>
                            </label>
                        </div>

                        {/* Formularios de creación según la pestaña activa */}
                        {activeTab === 'advisors' && (
                            <form onSubmit={handleCreateAdvisor} className={styles.panel.foms.container}>
                                <input
                                    type="text"
                                    value={newAdvisor}
                                    onChange={(e) => setNewAdvisor(e.target.value)}
                                    placeholder="Nombre del tutor"
                                    className={styles.panel.foms.input}
                                    required
                                />
                                <button
                                    type="submit"
                                    className={styles.panel.foms.button}
                                >
                                    Añadir
                                </button>
                            </form>
                        )}

                        {activeTab === 'degrees' && (
                            <form onSubmit={handleCreateDegree} className={styles.panel.foms.container}>
                                <input
                                    type="text"
                                    value={newDegree}
                                    onChange={(e) => setNewDegree(e.target.value)}
                                    placeholder="Nombre del grado"
                                    className={styles.panel.foms.input}
                                    required
                                />
                                <button
                                    type="submit"
                                    className={styles.panel.foms.button}
                                >
                                    Añadir
                                </button>
                            </form>
                        )}

                        {activeTab === 'years' && (
                            <form onSubmit={handleCreateYear} className={styles.panel.foms.container}>
                                <button
                                    type="submit"
                                    className={styles.panel.foms.button}
                                >
                                    Añadir
                                </button>
                            </form>
                        )}
                    </div>

                    {/* Contenido específico de cada pestaña - Usando CategoryCard */}
                    {activeTab === 'advisors' && (
                        <div className={styles.panel.content.container}>
                            <h2 className={styles.panel.content.title}>Gestión de Tutores</h2>

                            {filteredAdvisors.length > 0 ? (
                                <div className={styles.panel.content.filter}>
                                    {filteredAdvisors.map((advisor) => (
                                        <CategoryCard
                                            key={advisor._id}
                                            id={advisor._id}
                                            title={advisor.advisor}
                                            type="advisor"
                                            onDelete={handleDeleteItem}
                                            onToggleStatus={handleToggleStatus}
                                            isActive={advisor.active}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className={styles.panel.content.nofiltered}>
                                    <p className={styles.panel.content.text}>
                                        {showInactive
                                            ? "No hay tutores disponibles."
                                            : "No hay tutores activos. Activa el interruptor para ver todos los tutores."}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'degrees' && (
                        <div className={styles.panel.content.container}>
                            <h2 className={styles.panel.content.title}>Gestión de Grados</h2>

                            {filteredDegrees.length > 0 ? (
                                <div className={styles.panel.content.filter}>
                                    {filteredDegrees.map((degree) => (
                                        <CategoryCard
                                            key={degree._id}
                                            id={degree._id}
                                            title={degree.degree}
                                            type="degree"
                                            onDelete={handleDeleteItem}
                                            onToggleStatus={handleToggleStatus}
                                            isActive={degree.active}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className={styles.panel.content.nofiltered}>
                                    <p className={styles.panel.content.text}>
                                        {showInactive
                                            ? "No hay grados disponibles."
                                            : "No hay grados activos. Activa el interruptor para ver todos los grados."}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'years' && (
                        <div className={styles.panel.content.container}>
                            <h2 className={styles.panel.content.title}>Gestión de Años Académicos</h2>

                            {filteredYears.length > 0 ? (
                                <div className={styles.panel.content.filter}>
                                    {filteredYears.map((year) => (
                                        <CategoryCard
                                            key={year._id}
                                            id={year._id}
                                            title={year.year}
                                            type="year"
                                            onDelete={handleDeleteItem}
                                            onToggleStatus={handleToggleStatus}
                                            isActive={year.active}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className={styles.panel.content.nofiltered}>
                                    <p className={styles.panel.content.text}>
                                        {showInactive
                                            ? "No hay años disponibles."
                                            : "No hay años activos. Activa el interruptor para ver todos los años."}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Modal de confirmación */}
            {showModal && (
                <div className={styles.panel.confirmation.overlay}>
                    <div className={styles.panel.confirmation.container}>
                        <h3 className={styles.panel.confirmation.title}>
                            {modalType.startsWith('delete')
                                ? '¿Confirmar eliminación?'
                                : '¿Confirmar cambio de estado?'}
                        </h3>
                        <p className={styles.panel.confirmation.message}>
                            {modalType.startsWith('delete')
                                ? 'Esta acción eliminará este elemento de forma permanente.'
                                : 'Esta acción cambiará la visibilidad del elemento en el sistema.'}
                        </p>
                        <div className={styles.panel.confirmation.button_container}>
                            <button
                                onClick={() => setShowModal(false)}
                                className={styles.panel.confirmation.cancel_button}
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={confirmModalAction}
                                className={`${styles.panel.confirmation.confirm_button} ${modalType.startsWith('delete')
                                    ? styles.panel.confirmation.red_cancel
                                    : styles.panel.confirmation.overlay
                                    }`}
                            >
                                {modalType.startsWith('delete') ? 'Eliminar' : 'Confirmar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}