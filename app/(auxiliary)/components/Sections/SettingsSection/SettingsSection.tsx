"use client"

import React, {useEffect, useState} from 'react';
import Button from "@/app/(auxiliary)/components/UI/Button/Button";
import {color_1, color_5} from "@/styles/color";
import Input from "@/app/(auxiliary)/components/UI/Inputs/Input/Input";
import {axiosHandler} from "@/app/(auxiliary)/func/axiosHandler/axiosHandler";
import UserService from "@/app/(auxiliary)/lib/axios/services/UserService/UserService";
import {AxiosResponse} from "axios";
import styles from "./SettingsSection.module.scss"
import RegularText from "@/app/(auxiliary)/components/UI/TextTemplates/RegularText";
import MainTitle from "@/app/(auxiliary)/components/UI/TextTemplates/MainTitle";
import {getAccessToken} from "@/app/(auxiliary)/func/app/getAccessToken";

const SettingsSection = () => {
    const accessToken = getAccessToken()

    const [oldPassword, setOldPassword] = useState<string>("")
    const [newPassword, setNewPassword] = useState<string>("")
    const [comparePasswords, setComparePasswords] =
        useState<boolean>(() => false)

    const changePasswordHandler = async (args: {
        oldPassword: string;
        newPassword: string;
        accessToken: string;
    }) => {
        const response = await axiosHandler(UserService.changePassword(
            args.oldPassword,
            args.newPassword,
            args.accessToken
        ))

        if ((response as AxiosResponse).status === 200) {
            const data = (response as AxiosResponse<{success: boolean}>).data
            if(data.success) {
            } else {

            }
        }
    }

    useEffect(() => {
        if (oldPassword !== newPassword) {
            if (oldPassword.length > 8 && newPassword.length > 8) {
                setComparePasswords(() => true)
            }
        } else {
            setComparePasswords(() => false)
        }
    }, [
        oldPassword,
        newPassword
    ]);

    return (
        <div className={styles.settingsSection}>
            <MainTitle>Settings</MainTitle>

            <div className={styles.changePassword}>
                <RegularText>Change password</RegularText>

                <div className={styles.changePasswordInputs}>
                    <Input
                        type={"password"}
                        value={oldPassword}
                        placeholder={"Old password"}
                        maxLength={20}
                        tabIndex={1}
                        onFocus={() => {
                        }}
                        onBlur={() => {
                        }}
                        onChange={(e) => setOldPassword(e.target.value)}/>

                    <Input
                        type={"password"}
                        value={newPassword}
                        placeholder={"New password"}
                        maxLength={20}
                        tabIndex={2}
                        onFocus={() => {
                        }}
                        onBlur={() => {
                        }}
                        onChange={(e) => setNewPassword(e.target.value)}/>
                </div>

                <div className={styles.changePasswordButton}>
                    <Button
                        style={{backgroundColor: color_1, color: color_5}}
                        onClick={() => changePasswordHandler({
                            oldPassword,
                            newPassword,
                            accessToken
                        })}
                        disabled={!comparePasswords}>
                        Save
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default SettingsSection;