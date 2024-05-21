"use client"

import React from 'react';
import styles from "./SettingsSection.module.scss"
import MainTitle from "@/app/(auxiliary)/components/UI/TextTemplates/MainTitle";
import ChangePasswordBlock
    from "@/app/(auxiliary)/components/Blocks/SettingsBlocks/ChangePasswordBlock/ChangePasswordBlock";

const SettingsSection = () => {
    return (
        <div className={styles.settingsSection}>
            <MainTitle>Settings</MainTitle>

            <ChangePasswordBlock/>
        </div>
    );
};

export default SettingsSection;