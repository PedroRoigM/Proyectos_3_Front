import React from 'react';
import { styles } from './styles/components';
const ToggleSwitch = ({ checked, onChange, label, styles }) => {
    return (
        <div className={styles.panel.toggle.container}>
            <label className={styles.panel.toggle.label}>
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={onChange}
                    className={styles.panel.toggle.input}
                />
                <div className={styles.panel.toggle.switch}></div>
                <span className={styles.panel.toggle.text}>
                    {label}
                </span>
            </label>
        </div>
    );
};

export default ToggleSwitch;