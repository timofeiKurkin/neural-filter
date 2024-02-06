import React, {FC, useRef, useState} from "react";

import {motion, Variants} from "framer-motion";

import ButtonText from "@/app/(auxiliary)/components/UI/TextTemplates/ButtonText";

import styles from "./Button.module.scss"

interface buttonType {
    emoji?: string;
    disabled?: boolean;
    style: {
        backgroundColor: string;
        textColor: string;
    },
    children: string;
    tabIndex?: number;
    onClick?: () => void;
}

const Button: FC<buttonType> = ({style, emoji, disabled, children, tabIndex, onClick}) => {
    const button = useRef(null)

    const variants: Variants = {
        "initial": {
            opacity: 1,
            userSelect: "none"
        },
        "hover": {
            opacity: .8
        }
    }

    return (
        <motion.button type={"button"}
                       className={`${styles.button}`}
                       ref={button}
                       tabIndex={tabIndex}
                       disabled={disabled}
                       onClick={onClick}
                       style={{
                           backgroundColor: style.backgroundColor,
                           color: style.textColor
                       }}

                       variants={variants}
                       initial={'initial'}
                       whileHover={'hover'}
        >
            <span className={styles.buttonText}>
                <ButtonText>{children}</ButtonText>
            </span>
        </motion.button>
    );
};

export default Button;