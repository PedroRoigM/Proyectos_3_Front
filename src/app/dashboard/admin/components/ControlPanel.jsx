import React from 'react';
import ToggleSwitch from './ToggleSwitch';
import CategoryList from './CategoryList';
import CreateForm from './CreateForm';

const ControlPanel = ({
    activeTab,
    showInactive,
    setShowInactive,
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
            {/* Controles superiores: filtro y formulario de creación */}
            <div className={styles.panel.controlers}>
                {/* Toggle para mostrar inactivos */}
                <ToggleSwitch
                    checked={showInactive}
                    onChange={() => setShowInactive(!showInactive)}
                    label="Mostrar elementos inactivos"
                    styles={styles}
                />

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
                />
            )}
        </div>
    );
};

export default ControlPanel;