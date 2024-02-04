import React, {FC, useRef, useState} from "react";

import ButtonText from "@/app/(auxiliary)/components/UI/TextTemplates/ButtonText";

import styles from "./Button.module.scss"

interface buttonType {
    emoji?: string;
    disabled?:boolean;
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
    const [hover, setHover] = useState<boolean>(false)

    return (
        <button type={"button"} className={`${styles.button} ${hover && styles.buttonHover}`}
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                ref={button}
                tabIndex={tabIndex}
                disabled={disabled}
                onClick={onClick}
                style={{
                    backgroundColor: style.backgroundColor,
                    color: style.textColor
                }}
        >
            <span className={styles.buttonText}>
                <ButtonText>{children}</ButtonText>
            </span>
        </button>
    );
};

export default Button;