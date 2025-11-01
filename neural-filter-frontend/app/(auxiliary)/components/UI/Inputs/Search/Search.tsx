"use client";

import React, {FC, useState} from "react";
import Image from "next/image";

import img from "@/public/loupe-search.svg"

import styles from "./Search.module.scss"
import inputStyle from "../Input/Input.module.scss";
import fontStyle from "@/styles/FontsStyle/fontsStyle.module.scss";
import border from "@/app/(auxiliary)/components/UI/Inputs/Input/InputBorder.module.scss";
import {InputChangeEventHandler} from "@/app/(auxiliary)/types/AppTypes/AppTypes";
import {setCurrentSearchQuery, useDispatch} from "@/app/(auxiliary)/lib/redux/store";

const Search: FC = () => {
    const dispatch = useDispatch()
    const [activeInput, setActiveInput] = useState<boolean>(false)
    const [inputValue, setInputValue] = useState<string>("")

    const inputSearchHandler = (e: InputChangeEventHandler) => {
        setInputValue(() => (e.target.value))
        dispatch(setCurrentSearchQuery(e.target.value))
    }

    return (
        <div className={`${styles.search} ${activeInput && styles.searchActive}`}>
            <div className={styles.searchWrapper}>
                <div className={styles.searchBoxImage}>
                    <Image src={img} alt={'loupe search'} unoptimized/>
                </div>
                <div className={inputStyle.inputBox}>
                    <input
                        className={`${fontStyle.regularTextStyle} ${inputStyle.inputStyle} ${styles.searchInput} ${activeInput && styles.searchInputActive}`}
                        type={"text"}
                        value={inputValue}
                        tabIndex={1}
                        onChange={(e) => inputSearchHandler(e)}
                        onFocus={() => setActiveInput((prevState) => (!prevState))}
                        onBlur={() => setActiveInput((prevState) => (!prevState))}
                        placeholder={"Search"}
                        maxLength={30}
                    />
                </div>
                <span className={activeInput ? border.inputActive : border.inputBorder}></span>
            </div>
        </div>
    );
};

export default Search;