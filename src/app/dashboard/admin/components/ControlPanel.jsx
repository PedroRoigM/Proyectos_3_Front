import React from 'react';
import ToggleSwitch from './ToggleSwitch';
import CategoryList from './CategoryList';
import CreateForm from './CreateForm';
import SearchInput from './SearchInput';

const ControlPanel = ({
    activeTab,
    showInactive,
    setShowInactive,
    searchTerm,
    setSearchTerm,
    newAdvisor,
    setNewAdvisor,
    newDegree,
    setNewDegree,
    newYear,
    handleCreateAdvisor,
    handleCreateDegree,
    handleCreateYear,
    filteredAdvisors,
    filteredDegrees,
    filteredYears,
    handleDeleteItem,
    handleToggleStatus,
    styles
}) => {
    return (
        <div className={styles.panel.container}>
            {/* Controles superiores: filtro, búsqueda y formulario de creación */}
            <div className={styles.panel.controlers}>
                <div className="flex flex-col md:flex-row w-full gap-4 mb-4">
                    {/* Toggle para mostrar inactivos */}
                    <div className="md:w-1/3">
                        <ToggleSwitch
                            checked={showInactive}
                            onChange={() => setShowInactive(!showInactive)}
                            label="Mostrar elementos inactivos"
                            styles={styles}
                        />
                    </div>

                    {/* Barra de búsqueda */}
                    <div className="md:w-2/3">
                        <SearchInput
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            placeholder={`Buscar ${activeTab === 'advisors' ? 'tutores' : activeTab === 'degrees' ? 'grados' : 'años'}...`}
                        />
                    </div>
                </div>

                {/* Formularios de creación según la pestaña activa */}
                {activeTab === 'advisors' && (
                    <CreateForm
                        type="advisor"
                        value={newAdvisor}
                        onChange={setNewAdvisor}
                        onSubmit={handleCreateAdvisor}
                        placeholder="Nombre del tutor"
                        styles={styles}
                    />
                )}

                {activeTab === 'degrees' && (
                    <CreateForm
                        type="degree"
                        value={newDegree}
                        onChange={setNewDegree}
                        onSubmit={handleCreateDegree}
                        placeholder="Nombre del grado"
                        styles={styles}
                    />
                )}

                {activeTab === 'years' && (
                    <CreateForm
                        type="year"
                        value={newYear}
                        onChange={() => { }} // No se usa para años
                        onSubmit={handleCreateYear}
                        showInput={false}
                        styles={styles}
                    />
                )}
            </div>

            {/* Contenido específico de cada pestaña */}
            {activeTab === 'advisors' && (
                <CategoryList
                    items={filteredAdvisors}
                    type="advisor"
                    title="Gestión de Tutores"
                    showInactive={showInactive}
                    onDelete={handleDeleteItem}
                    onToggleStatus={handleToggleStatus}
                    styles={styles}
                    searchTerm={searchTerm}
                />
            )}

            {activeTab === 'degrees' && (
                <CategoryList
                    items={filteredDegrees}
                    type="degree"
                    title="Gestión de Grados"
                    showInactive={showInactive}
                    onDelete={handleDeleteItem}
                    onToggleStatus={handleToggleStatus}
                    styles={styles}
                    searchTerm={searchTerm}
                />
            )}

            {activeTab === 'years' && (
                <CategoryList
                    items={filteredYears}
                    type="year"
                    title="Gestión de Años Académicos"
                    showInactive={showInactive}
                    onDelete={handleDeleteItem}
                    onToggleStatus={handleToggleStatus}
                    styles={styles}
                    searchTerm={searchTerm}
                />
            )}
        </div>
    );
};

export default ControlPanel;