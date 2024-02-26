"use client"

import React, {FC, useEffect, useState} from 'react';
import {selectorUser, setAuth, setPath, setUser, useDispatch, useSelector} from "@/app/(auxiliary)/lib/redux/store";
import {usePathname, useRouter} from "next/navigation";
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

    const pathname = usePathname()
    const route = useRouter()

    const {user, isAuth, rememberPath} = useSelector(selectorUser)
    const accessTokenFromLS = typeof window !== 'undefined' ? localStorage.getItem('access') : null
    const refreshTokenFromLS = typeof window !== 'undefined' ? localStorage.getItem('refresh') : null


    console.log("rememberPath", rememberPath)


    useEffect(() => {
        if(!rememberPath) {
            dispatch(setPath(pathname))
        }
    });


    /**
     * Токены авторизации из localStorage.
     */
    const [tokens, setTokens] = useState<
        AuthTokens
    >(() => {
        if (accessTokenFromLS && refreshTokenFromLS) {
            return {
                access: JSON.parse(accessTokenFromLS),
                refresh: JSON.parse(refreshTokenFromLS)
            }
        } else {
            return {
                access: "",
                refresh: ""
            } as AuthTokens
        }
    })

    // console.log(tokens)

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
                                // localStorage.setItem('refresh', JSON.stringify(newToken.refresh))

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
    }, [
        isAuth,
        user.id,
        dispatch,
        tokens.refresh,
        tokens.access
    ]);


    /**
     * Эффект на проверку авторизации
     */
    useEffect(() => {
        if (!isAuth && !user.id) {
            route.push(rememberPath)
        }
    }, [isAuth, user.id]);


    return (children)
};

export default AppWrapper;