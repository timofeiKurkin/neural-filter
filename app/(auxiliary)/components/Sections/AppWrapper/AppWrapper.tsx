"use client"

import React, {FC, useEffect, useState} from 'react';
import {ChildrenType} from "@/app/(auxiliary)/types/AppTypes/AppTypes";
import {selectorUser, setAuth, setUser, useDispatch, useSelector} from "@/app/(auxiliary)/lib/redux/store";
import {useRouter} from "next/navigation";
import {getCSRFToken, refreshToken} from "@/app/func";
import {AuthTokens} from "@/app/(auxiliary)/types/AppTypes/AuthTokens";
import {AxiosResponse} from "axios";
import {jwtDecode} from "jwt-decode";
import {JwtPayloadExtended} from "@/app/(auxiliary)/types/AppTypes/JWT";

interface PropsType {
    children: React.ReactNode;
    CSRFToken: string;
}

const AppWrapper: FC<PropsType> = ({children, CSRFToken}) => {
    const dispatch = useDispatch()

    const route = useRouter()

    const {user, isAuth} = useSelector(selectorUser)
    const tokenFromLS = typeof window !== 'undefined' ? localStorage.getItem('authTokens') : null

    /**
     * Токены авторизации из localStorage.
     */
    const [tokens, setTokens] = useState<
        AuthTokens |
        null
    >(() => {
        if (tokenFromLS) {
            return JSON.parse(tokenFromLS)
        } else {
            return null
        }
    })


    /**
     * Эффект для получения токена CSRF с сервера
     */
    useEffect(() => {
        let active = true

        const fetchData = async () => {
            if (active) {
                return await getCSRFToken()
            }
        }


        fetchData().then()

        return () => {
            active = false
        }
    }, [dispatch]);


    /**
     * Эффект для обновления токена авторизации
     */
    useEffect(() => {
        let active = true

        const fetchData = async (refToken: string, csrfToken: string) => {
            const response = await refreshToken(refToken, csrfToken)

            if (active) {
                if ((response as AxiosResponse).status === 200) {
                    const data: { access: string } = (response as AxiosResponse).data
                    const decodeJWT: JwtPayloadExtended = jwtDecode(data.access)

                    if (decodeJWT) {
                        setTokens((prevState) => {
                            if (prevState?.refresh && prevState.access) {
                                const newToken = {
                                    refresh: prevState?.refresh,
                                    access: data.access
                                }
                                localStorage.setItem('authTokens', JSON.stringify(newToken))
                                return newToken
                            } else {
                                return null
                            }
                        })

                        dispatch(setUser({
                            id: decodeJWT.user_id,
                            username: decodeJWT.username
                        }))
                        dispatch(setAuth(true))
                    }
                }
            }
        }

        if (tokens && Object.keys(tokens).length) {
            fetchData(tokens.refresh, CSRFToken).then()
        }

        const intervalGettingTokens = setInterval(() => {
            if (tokens && isAuth && user.id) {
                fetchData(tokens.refresh, CSRFToken).then()
            }
        }, 240000)

        return () => {
            active = false
            clearInterval(intervalGettingTokens)
            setTokens(() => ({} as AuthTokens))
        }
    }, [isAuth, user.id, dispatch]);


    /**
     * Эффект на проверку авторизации
     */
    useEffect(() => {
        if (!isAuth && !user.id) {
            route.push('/login')
        }
    }, [isAuth, user.id]);


    return (children)
};

export default AppWrapper;