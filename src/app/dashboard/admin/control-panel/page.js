'use client';
import React, { useState, useEffect } from 'react';
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
        <div className="flex flex-col min-h-screen bg-gray-100 p-6">
            {/* Encabezado */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Panel de Control</h1>
                <p className="text-gray-600 mt-2">
                    Administra tutores, grados académicos y años lectivos para la plataforma de TFGs.
                </p>
            </div>

            {/* Contenedor principal con tabs */}
            <div className="bg-white rounded-lg shadow-md mb-6">
                {/* Navegación por pestañas */}
                <div className="flex border-b border-gray-200">
                    <button
                        className={`flex-1 py-4 px-6 font-medium ${activeTab === 'advisors'
                            ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                            : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                            }`}
                        onClick={() => setActiveTab('advisors')}
                    >
                        Tutores
                    </button>
                    <button
                        className={`flex-1 py-4 px-6 font-medium ${activeTab === 'degrees'
                            ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                            : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                            }`}
                        onClick={() => setActiveTab('degrees')}
                    >
                        Grados
                    </button>
                    <button
                        className={`flex-1 py-4 px-6 font-medium ${activeTab === 'years'
                            ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                            : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                            }`}
                        onClick={() => setActiveTab('years')}
                    >
                        Años
                    </button>
                </div>

                {/* Contenido del panel */}
                <div className="p-6">
                    {/* Controles superiores: filtro y formulario de creación */}
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 space-y-4 md:space-y-0">
                        {/* Toggle para mostrar inactivos */}
                        <div className="flex items-center">
                            <label className="inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={showInactive}
                                    onChange={() => setShowInactive(!showInactive)}
                                    className="sr-only peer"
                                />
                                <div className="relative w-11 h-6 bg-gray-200 rounded-full peer 
                                    peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 
                                    peer-checked:after:translate-x-full peer-checked:after:border-white 
                                    after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                                    after:bg-white after:border-gray-300 after:border after:rounded-full 
                                    after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                <span className="ml-3 text-sm font-medium text-gray-700">
                                    Mostrar elementos inactivos
                                </span>
                            </label>
                        </div>

                        {/* Formularios de creación según la pestaña activa */}
                        {activeTab === 'advisors' && (
                            <form onSubmit={handleCreateAdvisor} className="flex space-x-2">
                                <input
                                    type="text"
                                    value={newAdvisor}
                                    onChange={(e) => setNewAdvisor(e.target.value)}
                                    placeholder="Nombre del tutor"
                                    className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                                >
                                    Añadir
                                </button>
                            </form>
                        )}

                        {activeTab === 'degrees' && (
                            <form onSubmit={handleCreateDegree} className="flex space-x-2">
                                <input
                                    type="text"
                                    value={newDegree}
                                    onChange={(e) => setNewDegree(e.target.value)}
                                    placeholder="Nombre del grado"
                                    className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                                >
                                    Añadir
                                </button>
                            </form>
                        )}

                        {activeTab === 'years' && (
                            <form onSubmit={handleCreateYear} className="flex space-x-2">
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                                >
                                    Añadir
                                </button>
                            </form>
                        )}
                    </div>

                    {/* Contenido específico de cada pestaña - Usando CategoryCard */}
                    {activeTab === 'advisors' && (
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Gestión de Tutores</h2>

                            {filteredAdvisors.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                                <div className="bg-gray-50 rounded-lg p-8 text-center">
                                    <p className="text-gray-500">
                                        {showInactive
                                            ? "No hay tutores disponibles."
                                            : "No hay tutores activos. Activa el interruptor para ver todos los tutores."}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'degrees' && (
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Gestión de Grados</h2>

                            {filteredDegrees.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                                <div className="bg-gray-50 rounded-lg p-8 text-center">
                                    <p className="text-gray-500">
                                        {showInactive
                                            ? "No hay grados disponibles."
                                            : "No hay grados activos. Activa el interruptor para ver todos los grados."}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'years' && (
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Gestión de Años Académicos</h2>

                            {filteredYears.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                                <div className="bg-gray-50 rounded-lg p-8 text-center">
                                    <p className="text-gray-500">
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
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                        <h3 className="text-xl font-semibold mb-4">
                            {modalType.startsWith('delete')
                                ? '¿Confirmar eliminación?'
                                : '¿Confirmar cambio de estado?'}
                        </h3>
                        <p className="mb-6 text-gray-600">
                            {modalType.startsWith('delete')
                                ? 'Esta acción eliminará este elemento de forma permanente.'
                                : 'Esta acción cambiará la visibilidad del elemento en el sistema.'}
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={confirmModalAction}
                                className={`px-4 py-2 text-white rounded-md transition ${modalType.startsWith('delete')
                                    ? 'bg-red-600 hover:bg-red-700'
                                    : 'bg-blue-600 hover:bg-blue-700'
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