"use client"

import React, {FC, useState} from "react";

import {PropsType} from "@/app/(auxiliary)/components/UI/Inputs/InputPropsType";

import border from "./InputBorder.module.scss"
import fontStyle from "@/styles/FontsStyle/fontsStyle.module.scss";
import styles from "./Input.module.scss"

const Input: FC<PropsType> = ({
                                  inputData,
                                  placeholder,
                                  type = "text",
                                  disabled,
                                  maxLength,
                                  tabIndex
                              }) => {
    const [activeInput, setActiveInput] = useState(false)

    const activeFocusHandler = () => {
        // if (!activeInput) {
        setActiveInput((prev) => (!prev))
        // }
    }

    const activeBlurHandler = () => {
        if (activeInput) {
            setActiveInput((prev) => (!prev))
        }
        return inputData.onBlur()
    }

    return (
        <div className={styles.inputWrapper}>
            <div className={styles.inputBox}>
                <input
                    className={`${fontStyle.regularTextStyle} ${styles.inputStyle}`}
                    type={type}
                    value={inputData.value}
                    tabIndex={tabIndex}
                    onChange={(e) => inputData.onChange(e)}
                    onFocus={() => activeFocusHandler()}
                    // onBlur={() => activeBlurHandler()}
                    placeholder={placeholder}
                    maxLength={maxLength}
                    disabled={disabled ? disabled : false}
                />
            </div>
            <span className={activeInput ? border.inputActive : border.inputBorder}></span>
        </div>
    );
};

export default Input;