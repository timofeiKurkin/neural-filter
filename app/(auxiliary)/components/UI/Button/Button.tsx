import React, {FC, useRef} from "react";

import {motion, Variants} from "framer-motion";

import ButtonText from "@/app/(auxiliary)/components/UI/TextTemplates/ButtonText";

import styles from "./Button.module.scss"

interface buttonType {
    disabled?: boolean;
    style: {
        backgroundColor: string;
        color: string;
    },
    children: string;
    tabIndex?: number;
    onClick?: () => void;
    type?: "button" | "reset" | "submit"
}

const Button: FC<buttonType> = ({
                                    style,
                                    disabled,
                                    children,
                                    tabIndex,
                                    onClick,
                                    type
                                }) => {
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
        <motion.button type={type ?? "button"}
                       className={`${styles.button}`}
                       ref={button}
                       tabIndex={tabIndex}
                       disabled={disabled}
                       onClick={onClick}
                       style={style}

                       variants={variants}
                       initial={'initial'}
                       whileHover={'hover'}
        >
            <span>
                <ButtonText>{children}</ButtonText>
            </span>
        </motion.button>
    );
};

export default Button;