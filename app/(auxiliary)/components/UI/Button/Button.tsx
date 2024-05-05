"use client"

import React, {FC, useRef} from "react";

import ButtonText from "@/app/(auxiliary)/components/UI/TextTemplates/ButtonText";

import styles from "./Button.module.scss"
import {AnimationControls, AnimationProps, HTMLMotionProps, motion, Target, VariableTransitions} from "framer-motion";


interface buttonType {
    disabled?: boolean;
    style: React.CSSProperties,
    children: string;
    tabIndex?: number;
    onClick?: () => void;
    type?: "button" | "reset" | "submit",


    motionAnimate?: {
        transition: any;
        animate: any;
        initial: any;
    }
}

const Button: FC<buttonType> = ({
                                    style,
                                    disabled,
                                    children,
                                    tabIndex,
                                    onClick,
                                    type,
                                    motionAnimate
                                }) => {
    const button = useRef(null)

    return (
        <motion.button
            type={type ?? "button"}
            className={`${styles.button}`}
            ref={button}
            tabIndex={tabIndex}
            disabled={disabled}
            onClick={onClick}
            style={style}

            initial={motionAnimate?.initial}
            animate={motionAnimate?.animate}
            transition={motionAnimate?.transition}
        >
            <ButtonText>{children}</ButtonText>
        </motion.button>
    );
};

export default Button;