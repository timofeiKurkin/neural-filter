"use client"

import React, {FC, useEffect, useState} from 'react';
import {selectorUser, setAuth, setUser, useDispatch, useSelector} from "@/app/(auxiliary)/lib/redux/store";
import {usePathname, useRouter} from "next/navigation";
import {AuthTokens} from "@/app/(auxiliary)/types/AppTypes/AuthTokens";
import axios, {AxiosResponse} from "axios";
import {jwtDecode} from "jwt-decode";
import {JwtPayloadExtended} from "@/app/(auxiliary)/types/AppTypes/JWT";
import {selectorApplication, setPath} from "@/app/(auxiliary)/lib/redux/store/slices/applicationSlice";
import {getAccessToken} from "@/app/(auxiliary)/func/app/getAccessToken";
import {axiosHandler} from "@/app/(auxiliary)/func/axiosHandler/axiosHandler";
import UserService from "@/app/(auxiliary)/lib/axios/services/UserService/UserService";
import AppService from "@/app/(auxiliary)/lib/axios/services/AppService/AppService";


interface CSRFTokenType {
    csrftoken: string;
}

interface PropsType {
    children: React.ReactNode;
    CSRFToken: string;
    refreshToken?: string;
}

const AppWrapper: FC<PropsType> = ({
                                       children,
                                       CSRFToken,
                                       refreshToken = ""
                                   }) => {
    const dispatch = useDispatch()

    const pathname = usePathname()
    const route = useRouter()

    const {user, isAuth} = useSelector(selectorUser)
    const {rememberPath}: { rememberPath: string } = useSelector(selectorApplication)

    if (CSRFToken) {
        axios.defaults.headers.common['X-CSRFToken'] = CSRFToken
    }

    useEffect(() => {
        if (!rememberPath && pathname !== "/login" && pathname !== "/settings") {
            dispatch(setPath(pathname))
        }
    }, [dispatch, pathname, rememberPath]);


    /**
     * Токены авторизации из localStorage.
     */
    const [tokens, setTokens] = useState<AuthTokens>(() => {
        const accessToken = getAccessToken()
        if (accessToken && refreshToken) {
            return {
                access: accessToken,
                refresh: refreshToken
            }
        } else {
            return {
                access: "",
                refresh: ""
            }
        }
    })

    /**
     * Эффект для получения токена CSRF с сервера
     */
    useEffect(() => {
        let active = true

        const fetchData = async () => {
            const response = await axiosHandler(AppService.getCSRFToken())

            if (active) {
                if ((response as AxiosResponse<CSRFTokenType>).status === 200) {
                    axios.defaults.headers.common['X-CSRFToken'] = (response as AxiosResponse<CSRFTokenType>).data.csrftoken
                }
            }
        }

        if (!CSRFToken) {
            fetchData().then()
        }

        return () => {
            active = false
        }
    }, [
        CSRFToken
    ]);


    /**
     * Эффект для обновления токена авторизации
     */
    useEffect(() => {
        let active = true

        const fetchData = async (refToken: string, accToken: string) => {
            const response =
                await axiosHandler(UserService.refreshToken(refToken, accToken))

            if (active) {
                if ((response as AxiosResponse).status === 200) {
                    const data: { access: string } = (response as AxiosResponse).data
                    const decodeJWT: JwtPayloadExtended = jwtDecode(data.access)

                    if (decodeJWT) {
                        dispatch(setUser({
                            id: decodeJWT.user_id,
                            username: decodeJWT.username
                        }))
                        dispatch(setAuth(true))

                        setTokens((prevState) => {
                            if (prevState?.refresh) {
                                const newToken: AuthTokens = {
                                    access: data.access,
                                    refresh: prevState.refresh,
                                }
                                localStorage.setItem('access', JSON.stringify(newToken.access))

                                return newToken
                            } else {
                                return {
                                    access: "",
                                    refresh: ""
                                } as AuthTokens
                            }
                        })
                    }
                }
            }
        }

        if (tokens.access && tokens.refresh) {
            fetchData(tokens.refresh, tokens.access).then()
        }

        const intervalGettingTokens = setInterval(() => {
            if (tokens.refresh && isAuth && user.id) {
                fetchData(tokens.refresh, tokens.access).then()
            }
        }, 2400)

        return () => {
            active = false
            clearInterval(intervalGettingTokens)
            setTokens(() => ({} as AuthTokens))
        }
    }, [
        isAuth,
        user.id,
        dispatch,
        tokens.refresh,
        tokens.access,
        CSRFToken
    ]);


    /**
     * Эффект на проверку авторизации
     */
    useEffect(() => {
        if (!isAuth && !user.id && !user.username) {
            route.push('/login')
        } else if (rememberPath) {
            route.push(rememberPath)
        }
    }, [
        isAuth,
        user.id,
        rememberPath,
        user.username,
        route
    ]);


    return children
};

export default AppWrapper;