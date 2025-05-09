'use client';
import React, { useState, useEffect } from 'react';
import { styles } from '../components/styles/components';
import LoadingSpinner from '../../components/LoadingSpinner';
import TabNavigation from '../components/TabNavigation';
import ControlPanel from '../components/ControlPanel';
import ConfirmationModal from '../components/ConfirmationModal';
import { ErrorBoundary } from '../../../components/errors/error-boundary';
import { useNotification } from '../../../components/errors/notification-context';
import { useApiError } from '../../../components/errors/api-error-hook';

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

function ControlPanelContent() {
    // Estados principales para los datos
    const [advisors, setAdvisors] = useState([]);
    const [degrees, setDegrees] = useState([]);
    const [years, setYears] = useState([]);

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

    // Estado para la búsqueda
    const [searchTerm, setSearchTerm] = useState('');

    // Hooks para el manejo de errores y notificaciones
    const { showSuccess, showError } = useNotification();
    const { loading, executeRequest } = useApiError();

    // Cargar datos iniciales
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Ejecutar múltiples llamadas a la API en paralelo
                const [advisorsData, degreesData, yearsData] = await Promise.all([
                    executeRequest(
                        async () => await GetAdvisors(),
                        { errorMessage: 'Error al cargar los tutores' }
                    ),
                    executeRequest(
                        async () => await GetDegrees(),
                        { errorMessage: 'Error al cargar los grados' }
                    ),
                    executeRequest(
                        async () => await GetYears(),
                        { errorMessage: 'Error al cargar los años académicos' }
                    )
                ]);

                // Procesar los datos recibidos
                if (advisorsData) {
                    const processedAdvisors = advisorsData.map(advisor => ({
                        ...advisor,
                        active: advisor.active !== undefined ? advisor.active : true
                    }));
                    setAdvisors(processedAdvisors);
                }

                if (degreesData) {
                    const processedDegrees = degreesData.map(degree => ({
                        ...degree,
                        active: degree.active !== undefined ? degree.active : true
                    }));
                    setDegrees(processedDegrees);
                }

                if (yearsData) {
                    const processedYears = yearsData.map(year => ({
                        ...year,
                        active: year.active !== undefined ? year.active : true
                    }));
                    setYears(processedYears);
                }
            } catch (error) {
                console.error('Error al cargar datos:', error);
                showError('No se pudieron cargar los datos. Por favor, intenta de nuevo.');
            }
        };

        fetchData();
    }, [executeRequest, showError]);

    // Crear un nuevo tutor
    const handleCreateAdvisor = async (e) => {
        e.preventDefault();
        if (!newAdvisor.trim()) return;

        try {
            const response = await executeRequest(
                async () => await PostAdvisor({ advisor: newAdvisor }),
                {
                    loadingMessage: 'Creando tutor...',
                    errorMessage: 'Error al crear tutor'
                }
            );

            if (response && response.data) {
                setAdvisors([...advisors, { ...response.data, active: true }]);
                showSuccess(`Tutor "${newAdvisor}" creado correctamente`);
            } else {
                // Usar un ID temporal para el tutor en caso de que la API no devuelva uno
                setAdvisors([...advisors, {
                    _id: `temp-${Date.now()}`,
                    advisor: newAdvisor,
                    active: true
                }]);
                showSuccess(`Tutor "${newAdvisor}" creado correctamente`);
            }

            setNewAdvisor('');
        } catch (error) {
            console.error('Error al crear tutor:', error);
            showError(`No se pudo crear el tutor "${newAdvisor}"`);
        }
    };

    // Crear un nuevo grado
    const handleCreateDegree = async (e) => {
        e.preventDefault();
        if (!newDegree.trim()) return;

        try {
            const response = await executeRequest(
                async () => await PostDegree({ degree: newDegree }),
                {
                    loadingMessage: 'Creando grado...',
                    errorMessage: 'Error al crear grado'
                }
            );

            if (response && response.data) {
                setDegrees([...degrees, { ...response.data, active: true }]);
                showSuccess(`Grado "${newDegree}" creado correctamente`);
            } else {
                setDegrees([...degrees, {
                    _id: `temp-${Date.now()}`,
                    degree: newDegree,
                    active: true
                }]);
                showSuccess(`Grado "${newDegree}" creado correctamente`);
            }

            setNewDegree('');
        } catch (error) {
            console.error('Error al crear grado:', error);
            showError(`No se pudo crear el grado "${newDegree}"`);
        }
    };

    // Crear un nuevo año
    const handleCreateYear = async (e) => {
        e.preventDefault();

        try {
            const response = await executeRequest(
                async () => await PostYear(),
                {
                    loadingMessage: 'Creando año académico...',
                    errorMessage: 'Error al crear año académico'
                }
            );

            if (response && response.data) {
                setYears([...years, { ...response.data, active: true }]);
                showSuccess('Año académico creado correctamente');
            } else {
                showError('No se pudo crear el año académico');
            }

            setNewYear('');
        } catch (error) {
            console.error('Error al crear año:', error);
            showError('No se pudo crear el año académico');
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
                        await executeRequest(
                            async () => await DeleteAdvisor(itemToModify),
                            {
                                loadingMessage: 'Eliminando tutor...',
                                errorMessage: 'Error al eliminar tutor'
                            }
                        );
                        setAdvisors(advisors.filter(advisor => advisor._id !== itemToModify));
                        showSuccess('Tutor eliminado correctamente');
                        break;

                    case 'degree':
                        await executeRequest(
                            async () => await DeleteDegree({ id: itemToModify }),
                            {
                                loadingMessage: 'Eliminando grado...',
                                errorMessage: 'Error al eliminar grado'
                            }
                        );
                        setDegrees(degrees.filter(degree => degree._id !== itemToModify));
                        showSuccess('Grado eliminado correctamente');
                        break;

                    case 'year':
                        await executeRequest(
                            async () => await DeleteYear({ id: itemToModify }),
                            {
                                loadingMessage: 'Eliminando año académico...',
                                errorMessage: 'Error al eliminar año académico'
                            }
                        );
                        setYears(years.filter(year => year._id !== itemToModify));
                        showSuccess('Año académico eliminado correctamente');
                        break;

                    default:
                        break;
                }
            } else if (action === 'toggle') {
                switch (type) {
                    case 'advisor': {
                        const advisor = advisors.find(a => a._id === itemToModify);
                        const newStatus = !advisor.active;

                        await executeRequest(
                            async () => await UpdateAdvisor(itemToModify, { active: newStatus }),
                            {
                                loadingMessage: `${newStatus ? 'Activando' : 'Desactivando'} tutor...`,
                                errorMessage: `Error al ${newStatus ? 'activar' : 'desactivar'} tutor`
                            }
                        );

                        setAdvisors(advisors.map(advisor =>
                            advisor._id === itemToModify
                                ? { ...advisor, active: newStatus }
                                : advisor
                        ));

                        showSuccess(`Tutor ${newStatus ? 'activado' : 'desactivado'} correctamente`);
                        break;
                    }

                    case 'degree': {
                        const degree = degrees.find(d => d._id === itemToModify);
                        const newStatus = !degree.active;

                        await executeRequest(
                            async () => await UpdateDegree(itemToModify, { active: newStatus }),
                            {
                                loadingMessage: `${newStatus ? 'Activando' : 'Desactivando'} grado...`,
                                errorMessage: `Error al ${newStatus ? 'activar' : 'desactivar'} grado`
                            }
                        );

                        setDegrees(degrees.map(degree =>
                            degree._id === itemToModify
                                ? { ...degree, active: newStatus }
                                : degree
                        ));

                        showSuccess(`Grado ${newStatus ? 'activado' : 'desactivado'} correctamente`);
                        break;
                    }

                    case 'year': {
                        const year = years.find(y => y._id === itemToModify);
                        const newStatus = !year.active;

                        await executeRequest(
                            async () => await UpdateYear(itemToModify, { active: newStatus }),
                            {
                                loadingMessage: `${newStatus ? 'Activando' : 'Desactivando'} año académico...`,
                                errorMessage: `Error al ${newStatus ? 'activar' : 'desactivar'} año académico`
                            }
                        );

                        setYears(years.map(year =>
                            year._id === itemToModify
                                ? { ...year, active: newStatus }
                                : year
                        ));

                        showSuccess(`Año académico ${newStatus ? 'activado' : 'desactivado'} correctamente`);
                        break;
                    }

                    default:
                        break;
                }
            }
        } catch (error) {
            console.error(`Error al procesar acción ${action} en ${type}:`, error);
            showError(`No se pudo completar la acción. Por favor, inténtalo de nuevo.`);
        } finally {
            setShowModal(false);
            setItemToModify(null);
            setModalType('');
        }
    };

    // Función para filtrar elementos por estado activo/inactivo
    const getActiveFilteredItems = (items) => {
        return showInactive ? items : items.filter(item => item.active);
    };

    // Función para filtrar elementos por término de búsqueda
    const getSearchFilteredItems = (items, field) => {
        if (!searchTerm.trim()) return items;

        return items.filter(item => {
            const valueToSearch = field === 'advisor' ? item.advisor :
                field === 'degree' ? item.degree : item.year;
            return valueToSearch.toLowerCase().includes(searchTerm.toLowerCase());
        });
    };

    // Aplicar ambos filtros a los elementos
    const filteredAdvisors = getSearchFilteredItems(getActiveFilteredItems(advisors), 'advisor');
    const filteredDegrees = getSearchFilteredItems(getActiveFilteredItems(degrees), 'degree');
    const filteredYears = getSearchFilteredItems(getActiveFilteredItems(years), 'year');

    if (loading && advisors.length === 0 && degrees.length === 0 && years.length === 0) {
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
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
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

export default function ControlPanelPage() {
    return (
        <ErrorBoundary>
            <ControlPanelContent />
        </ErrorBoundary>
    );
}