"use client"

import React, {FC, useState} from "react";

import {PropsTypePassword} from "@/app/(auxiliary)/components/UI/Inputs/InputPropsType";
import {InputChangeEventHandler} from "@/app/(auxiliary)/types/AppTypes/AppTypes";

import fontStyle from "@/styles/FontsStyle/fontsStyle.module.scss";
import inputStyles from "@/app/(auxiliary)/components/UI/Inputs/Input/Input.module.scss";
import border from "@/app/(auxiliary)/components/UI/Inputs/Input/InputBorder.module.scss";

const InputPassword: FC<PropsTypePassword> = ({inputData, placeholder, setPassword, tabIndex}) => {
    const [showPassword, setShowPassword] = useState(false)
    const [activeInput, setActiveInput] = useState(false)

    const activeFocusHandler = () => {
        if (!activeInput) {
            setActiveInput((prev) => (!prev))
        }
    }

    const activeBlurHandler = () => {
        if (activeInput) {
            setActiveInput((prev) => (!prev))
        }
        return inputData.onBlur()
    }

    const hoverHandler = () => {
        if (!activeInput) {
            setActiveInput((prev) => (!prev))
        } else {
            setActiveInput((prev) => (!prev))
        }
    }

    const changeHandler = (e: InputChangeEventHandler) => {
        if (!!setPassword) {
            setPassword(e.target.value)
        }
        return inputData.onChange(e)
    }

    return (
        <div className={inputStyles.inputWrapper}
             onMouseEnter={() => hoverHandler()}
             onMouseLeave={() => hoverHandler()}
        >
            <div className={inputStyles.inputBox}>
                <input
                    className={`${inputStyles.inputStyle} ${fontStyle.regularText}`}
                    type={"password"}
                    value={inputData.value}
                    tabIndex={tabIndex}
                    onChange={(e: InputChangeEventHandler) => changeHandler(e)}
                    onFocus={() => activeFocusHandler()}
                    onBlur={() => activeBlurHandler()}
                    placeholder={placeholder}
                />
            </div>
            <span className={activeInput ? border.inputActive : border.inputBorder}></span>
        </div>

    );
};

export default InputPassword;