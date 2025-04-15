import React from 'react';

const TabNavigation = ({ activeTab, setActiveTab, styles }) => {
    return (
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
    );
};

export default TabNavigation;