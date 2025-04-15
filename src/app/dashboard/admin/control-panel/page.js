'use client';
import React, { useState, useEffect } from 'react';
import { styles } from '../components/styles/components';
import LoadingSpinner from '../../components/LoadingSpinner';
import TabNavigation from '../components/TabNavigation';
import ControlPanel from '../components/ControlPanel';
import ConfirmationModal from '../components/ConfirmationModal';

// Importaciones de servicios
import {
    GetAdvisors,
    GetDegrees,
    GetYears,
    DeleteAdvisor,
    DeleteDegree,
    DeleteYear,
    PostAdvisor,
    PostDegree,
    PostYear,
    UpdateAdvisor,
    UpdateDegree,
    UpdateYear
} from '../../components/lib';

export default function ControlPanelPage() {
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
                setAdvisors([...advisors, { ...response.data, active: true }]);
            } else {
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
                <TabNavigation
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    styles={styles}
                />

                {/* Panel de control con contenido según la pestaña seleccionada */}
                <ControlPanel
                    activeTab={activeTab}
                    showInactive={showInactive}
                    setShowInactive={setShowInactive}
                    newAdvisor={newAdvisor}
                    setNewAdvisor={setNewAdvisor}
                    newDegree={newDegree}
                    setNewDegree={setNewDegree}
                    newYear={newYear}
                    handleCreateAdvisor={handleCreateAdvisor}
                    handleCreateDegree={handleCreateDegree}
                    handleCreateYear={handleCreateYear}
                    filteredAdvisors={filteredAdvisors}
                    filteredDegrees={filteredDegrees}
                    filteredYears={filteredYears}
                    handleDeleteItem={handleDeleteItem}
                    handleToggleStatus={handleToggleStatus}
                    styles={styles}
                />
            </div>

            {/* Modal de confirmación */}
            {showModal && (
                <ConfirmationModal
                    modalType={modalType}
                    onCancel={() => setShowModal(false)}
                    onConfirm={confirmModalAction}
                    styles={styles}
                />
            )}
        </div>
    );
}