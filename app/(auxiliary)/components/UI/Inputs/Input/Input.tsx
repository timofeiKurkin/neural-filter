"use client"

import React, {FC, useState} from "react";

import {PropsType} from "@/app/(auxiliary)/components/UI/Inputs/InputPropsType";

import border from "./InputBorder.module.scss"
import fontStyle from "@/styles/FontsStyle/fontsStyle.module.scss";
import styles from "./Input.module.scss"
import {InputChangeEventHandler} from "@/app/(auxiliary)/types";

const Input: FC<PropsType> = ({
                                  value,
                                  onChange,
                                  onFocus,
                                  onBlur,
                                  placeholder,
                                  type = "text",
                                  disabled,
                                  maxLength,
                                  tabIndex
                              }) => {
    const [activeInput, setActiveInput] = useState(false)

    const activeFocusHandler = () => {
        onFocus()
        setActiveInput((prevState) => (!prevState))
    }

    const activeBlurHandler = () => {
        onBlur()
        setActiveInput((prevState) => (!prevState))
    }

    const changeHandler = (e: InputChangeEventHandler) => {
        onChange(e)
    }

    return (
        <div className={styles.inputWrapper}>
            <div className={styles.inputBox}>
                <input
                    className={`${fontStyle.regularTextStyle} ${styles.inputStyle}`}
                    type={type}
                    value={value}
                    onChange={(e: InputChangeEventHandler) => changeHandler(e)}
                    onFocus={() => activeFocusHandler()}
                    onBlur={() => activeBlurHandler()}
                    placeholder={placeholder}
                    maxLength={maxLength}
                    disabled={disabled ? disabled : false}
                    tabIndex={tabIndex}
                />
            </div>
            <span className={activeInput ? border.inputActive : border.inputBorder}></span>
        </div>
    );
};

export default Input;