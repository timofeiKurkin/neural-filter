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
import {AxiosError, AxiosResponse} from "axios";
import {jwtDecode} from "jwt-decode";
import {JwtPayloadExtended} from "@/app/(auxiliary)/types/AppTypes/JWT";
import {AxiosErrorType} from "@/app/(auxiliary)/types/AxiosTypes/AxiosTypes";
import ErrorsHandler from "@/app/(auxiliary)/components/Common/ErrorsHandler/ErrorsHandler";
import {selectorApplication, setError} from "@/app/(auxiliary)/lib/redux/store/slices/applicationSlice";
import {CustomErrorType, JustErrorType} from "@/app/(auxiliary)/types/AppTypes/Errors";
import {axiosHandler} from "@/app/(auxiliary)/func/axiosHandler/axiosHandler";
import UserService from "@/app/(auxiliary)/lib/axios/services/UserService/UserService";
import {getAccessToken} from "@/app/(auxiliary)/func/app/getAccessToken";

const LoginBlock: FC = () => {
    const router = useRouter()
    const dispatch = useDispatch()

    const {isAuth, user} = useSelector(selectorUser)
    const {errorList, rememberPath}: {
        errorList: CustomErrorType[];
        rememberPath: string
    } = useSelector(selectorApplication)

    const [hasLogin, setHasLogin] = useState<boolean>(true)

    const accessToken = getAccessToken()

    const loginKey = "u-l"
    const loginValue = useInput("", loginKey, usernameValidations)

    const passwordKey = "p-l"
    const passwordValue = useInput("", passwordKey, passwordValidations)


    const authorizationHandler = async (args: {
        e: React.MouseEvent<HTMLDivElement>;
        login: string;
        password: string;
        accessToken: string;
    }) => {
        args.e.preventDefault()
        const response = await axiosHandler(UserService.login(
            args.login,
            args.password,
            args.accessToken
        ))

        console.log("RESPONSE: ", response)

        if ((response as AxiosResponse).status === 200 && (response as AxiosResponse).data.access) {
            const data = (response as AxiosResponse).data
            const decodeJWT: JwtPayloadExtended = jwtDecode(data.access)
            const accessToken = data.access

            dispatch(setUser({
                id: decodeJWT.user_id,
                username: decodeJWT.username
            }))
            dispatch(setAuth(true))

            localStorage.setItem('access', JSON.stringify(accessToken))
        } else if ((response as AxiosResponse<AxiosErrorType>).data.statusCode === 401 && (response as AxiosResponse<AxiosErrorType>).data.message) {
            const errorResponse = response as AxiosResponse<AxiosErrorType>

            dispatch(setError([...errorList, {
                id: errorList.length,
                typeError: "Login error",
                page: "/login",
                expansion: {
                    code: errorResponse.data.statusCode,
                    message: "Incorrect username or password. Please, check your data."
                } as JustErrorType
            }]))
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
        if (isAuth && user.username && !rememberPath) {
            router.push('/')
        }
    }, [
        isAuth,
        user.username,
        rememberPath,
        router
    ]);


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
                                        placeholder={"Login"}
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
                                    placeholder={"Password"}
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
                             onClick={(e: React.MouseEvent<HTMLDivElement>) => authorizationHandler({
                                 e,
                                 login: loginValue.value,
                                 password: passwordValue.value,
                                 accessToken
                             })}>
                            <Button style={{backgroundColor: color_1, color: color_white}}
                                    tabIndex={3}
                                    type={'submit'}
                            >Continue</Button>
                        </div>
                    </form>
                </div>
            </MainShadow>

            <ErrorsHandler/>
        </div>
    );
};

export default LoginBlock;