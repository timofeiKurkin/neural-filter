"use client"

import React, {FC, useEffect, useState} from "react";

import useInput from "@/app/(auxiliary)/hooks/useInput";

import MainShadow from "@/app/(auxiliary)/components/UI/Borders/MainShadow/MainShadow";
import InputPassword from "@/app/(auxiliary)/components/UI/Inputs/InputPassword/InputPassword";
import Button from "@/app/(auxiliary)/components/UI/Button/Button";
import MainTitle from "@/app/(auxiliary)/components/UI/TextTemplates/MainTitle";
import Input from "@/app/(auxiliary)/components/UI/Inputs/Input/Input";

import {passwordValidations, usernameValidations} from "@/app/(routers)/(withoutHeader)/login/validationInput";

import {color_1, color_white} from "@/styles/color";
import styles from "./LoginBlock.module.scss"
import {selectorUser, setAuth, setUser, useDispatch, useSelector} from "@/app/(auxiliary)/lib/redux/store";
import {useRouter} from "next/navigation";
import {login} from "@/app/(routers)/(withoutHeader)/login/login";
import {AxiosResponse} from "axios";
import {jwtDecode} from "jwt-decode";
import {JwtPayloadExtended} from "@/app/(auxiliary)/types/AppTypes/JWT";

interface PropsType {
    csrfToken: string;
}

const LoginBlock: FC<PropsType> = ({csrfToken}) => {
    const router = useRouter()
    const dispatch = useDispatch()

    const {isAuth, user} = useSelector(selectorUser)

    const [hasLogin, setHasLogin] = useState<boolean>(true)

    const loginKey = "u-l"
    const loginValue = useInput("", loginKey, usernameValidations)

    const passwordKey = "p-l"
    const passwordValue = useInput("", passwordKey, passwordValidations)

    useEffect(() => {
        let firstAuth = localStorage.getItem("f-auth")
        if (firstAuth) {
            firstAuth = JSON.parse(firstAuth ?? '')
            // if (firstAuth && loginValue.value) {
            //     setHasLogin(false)
            // }
        }
    }, []);


    const formHandler = async (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault()

        const response = await login(loginValue.value, passwordValue.value, csrfToken)

        if ((response as AxiosResponse).status === 200) {
            const data = (response as AxiosResponse).data
            const accessToken = data.access
            const refreshToken = data.refresh
            const decodeJWT: JwtPayloadExtended = jwtDecode(data.access)

            dispatch(setUser({
                id: decodeJWT.user_id,
                username: decodeJWT.username
            }))
            dispatch(setAuth(true))

            localStorage.setItem('access', JSON.stringify(accessToken))
            localStorage.setItem('refresh', JSON.stringify(refreshToken))
        }
    }

    useEffect(() => {
        if (isAuth && user.id) {
            router.push('/')
        }
    }, [isAuth, user.id]);

    return (
        <div className={styles.loginBlockWrapper}>
            <MainShadow>
                <div className={styles.loginBlock}>
                    <div className={styles.loginTitle}>
                        <MainTitle>Log in</MainTitle>
                    </div>

                    <form>
                        <div className={styles.loginInputs}>
                            {
                                hasLogin &&
                                <div>
                                    <Input inputData={loginValue}
                                           placeholder={"login"}
                                           maxLength={10}
                                           tabIndex={1}/>
                                </div>
                            }

                            <div>
                                <InputPassword inputData={passwordValue}
                                               placeholder={"password"}
                                               maxLength={20}
                                               tabIndex={2}/>
                            </div>
                        </div>

                        <div className={styles.loginButton}
                             onClick={(e: React.MouseEvent<HTMLDivElement>) => formHandler(e)}>
                            <Button style={{backgroundColor: color_1, textColor: color_white}}
                                    tabIndex={3}
                                    type={'submit'}
                            >Continue</Button>
                        </div>
                    </form>
                </div>
            </MainShadow>
        </div>
    );
};

export default LoginBlock;