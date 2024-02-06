"use client"

import React, {useEffect, useState} from "react";

import useInput from "@/app/(auxiliary)/hooks/useInput";

import MainShadow from "@/app/(auxiliary)/components/UI/Borders/MainShadow/MainShadow";
import InputPassword from "@/app/(auxiliary)/components/UI/Inputs/InputPassword/InputPassword";
import Button from "@/app/(auxiliary)/components/UI/Button/Button";
import MainTitle from "@/app/(auxiliary)/components/UI/TextTemplates/MainTitle";
import Input from "@/app/(auxiliary)/components/UI/Inputs/Input/Input";

import {passwordValidations, usernameValidations} from "@/app/(routers)/(withoutHeader)/login/validationInput";

import {color_1, color_white} from "@/styles/color";
import styles from "./LoginBlock.module.scss"
import {useDispatch} from "@/app/(auxiliary)/lib/redux/store";
import {useRouter} from "next/navigation";
import {login} from "@/app/(routers)/(withoutHeader)/login/login";

const LoginBlock = () => {
    const router = useRouter()
    const dispatch = useDispatch()

    const [hasLogin, setHasLogin] = useState<boolean>(true)

    const loginKey = "u-l"
    const loginValue = useInput("", loginKey, usernameValidations)

    const passwordKey = "p-l"
    const passwordValue = useInput("", passwordKey, passwordValidations)

    const firstAuth = localStorage.getItem("f-auth")

    useEffect(() => {
        if(firstAuth && loginValue.value) {
            setHasLogin(false)
        }
    }, []);

    const clickHandler = async () => {
        const response = await login(loginValue.value, passwordValue.value)
        console.log(response)

        // const userName = _user.name
        // const userPassword = _user.password
        //
        // if(userName === loginValue.value && userPassword === passwordValue.value) {
        //     dispatch(setAuth(true))
        //     const user: IUser = {
        //         id: _user.id,
        //         userID: _user.userID,
        //         name: _user.name,
        //     }
        //     dispatch(setUser(user))
        //     localStorage.setItem("f-auth", JSON.stringify(1))
        //     localStorage.removeItem("p-l")
        //     router.push('/')
        // }


    }



    return (
        <div className={styles.loginBlockWrapper}>
            <MainShadow>
                <div className={styles.loginBlock}>
                    <div className={styles.loginTitle}>
                        <MainTitle>Log in</MainTitle>
                    </div>

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

                    <div className={styles.loginButton}>
                        <Button style={{backgroundColor: color_1, textColor: color_white}}
                                onClick={clickHandler}
                                tabIndex={3}
                        >Continue</Button>
                    </div>
                </div>
            </MainShadow>
        </div>
    );
};

export default LoginBlock;