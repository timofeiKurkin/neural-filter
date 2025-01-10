import React, {useEffect, useState} from 'react';
import styles from "./ChangePasswordBlock.module.scss";
import RegularText from "@/app/(auxiliary)/components/UI/TextTemplates/RegularText";
import Input from "@/app/(auxiliary)/components/UI/Inputs/Input/Input";
import Button from "@/app/(auxiliary)/components/UI/Button/Button";
import {color_1, color_5} from "@/styles/color";
import {getAccessToken} from "@/app/(auxiliary)/func/app/getAccessToken";
import {axiosHandler} from "@/app/(auxiliary)/func/axiosHandler/axiosHandler";
import UserService from "@/app/(auxiliary)/lib/axios/services/UserService/UserService";
import {AxiosResponse} from "axios";

const ChangePasswordBlock = () => {
    const accessToken = getAccessToken()

    const [oldPassword, setOldPassword] = useState<string>("")
    const [newPassword, setNewPassword] = useState<string>("")
    const [compareLengthPasswords, setCompareLengthPasswords] =
        useState<boolean>(() => false)
    const [successChangePassword, setSuccessChangePassword] =
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
            const data = (response as AxiosResponse<{ success: boolean }>).data
            if (data.success) {
                setSuccessChangePassword((prevState) => (!prevState))
            }
        }
    }

    useEffect(() => {
        if (oldPassword !== newPassword) {
            if (oldPassword.length > 8 && newPassword.length > 8) {
                setCompareLengthPasswords(() => true)
            }
        } else {
            setCompareLengthPasswords(() => false)
        }
    }, [
        oldPassword,
        newPassword
    ]);

    return (
        <div className={styles.changePassword}>
            <RegularText>Change password</RegularText>

            <div
                className={`${styles.changePasswordInputs} ${successChangePassword && styles.successChangePasswordInputs}`}>
                <Input
                    type={"password"}
                    value={oldPassword}
                    placeholder={"Old password"}
                    maxLength={20}
                    tabIndex={1}
                    disabled={successChangePassword}
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
                    disabled={successChangePassword}
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
                    disabled={!compareLengthPasswords || successChangePassword}>
                    Save
                </Button>
            </div>
        </div>
    );
};

export default ChangePasswordBlock;