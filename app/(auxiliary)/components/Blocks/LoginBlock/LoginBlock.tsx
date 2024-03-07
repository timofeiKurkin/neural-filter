"use client"

import React, {FC, useEffect, useState} from "react";

import useInput from "@/app/(auxiliary)/hooks/useInput";

import MainShadow from "@/app/(auxiliary)/components/UI/Borders/MainShadow/MainShadow";
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

            // router.push('/')
        }
    }

    useEffect(() => {
        let firstAuth = localStorage.getItem("f-auth")
        if (firstAuth) {
            firstAuth = JSON.parse(firstAuth ?? '')
            // if (firstAuth && loginValue.value) {
            //     setHasLogin(false)
            // }
        }
    }, []);

    useEffect(() => {
        if (isAuth && user.username) {
            router.push('/')
        }
    }, [isAuth, user.username]);

    console.log(isAuth)
    console.log(user)

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
                                    <Input
                                        value={loginValue.value}
                                        placeholder={"login"}
                                        // disabled={}
                                        maxLength={10}
                                        tabIndex={1}

                                        onFocus={loginValue.onBlur}
                                        onBlur={loginValue.onBlur}
                                        onChange={loginValue.onChange}/>
                                </div>
                            }

                            <div>

                                <Input
                                    value={passwordValue.value}
                                    placeholder={"password"}
                                    // disabled={}
                                    type={'password'}
                                    maxLength={20}
                                    tabIndex={2}

                                    onFocus={passwordValue.onBlur}
                                    onBlur={passwordValue.onBlur}
                                    onChange={passwordValue.onChange}/>
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