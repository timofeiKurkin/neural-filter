"use client";

import React, {FC, useState} from "react";
import Image from "next/image";

import img from "@/public/loupe-search.svg"

import styles from "./Search.module.scss"
import inputStyle from "../Input/Input.module.scss";
import fontStyle from "@/styles/FontsStyle/fontsStyle.module.scss";
import border from "@/app/(auxiliary)/components/UI/Inputs/Input/InputBorder.module.scss";

const Search: FC = () => {
    const [activeInput, setActiveInput] = useState(false)

    return (
        <div className={styles.search}>
            <div className={styles.searchWrapper}>
                <div className={styles.searchBoxImage}>
                    <Image src={img} alt={'loupe search'}/>
                </div>
                <div className={inputStyle.inputBox}>
                    <input
                        className={`${fontStyle.regularTextStyle} ${inputStyle.inputStyle}`}
                        type={"text"}
                        tabIndex={1}
                        onChange={() => console.log("input's")}
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