import React, {FC} from 'react';
import Button from "@/app/(auxiliary)/components/UI/Button/Button";
import {color_1, color_5, color_white} from "@/styles/color";


interface PropsType {
    disabled?: boolean;
    children: string;
    tabIndex?: number;
    onClick?: () => void;
}

const AnimationButton: FC<PropsType> = ({
                                            disabled,
                                            children,
                                            tabIndex,
                                            onClick,
                                        }) => {
    return (
        <Button
            style={{
                color: color_1,
                border: "2px solid transparent",
                borderRadius: "20px",
                backgroundClip: "padding-box, border-box",
                display: "flex",
                backgroundOrigin: "padding-box, border-box",
                justifyContent: "center",
                alignItems: "center",
                padding: "14px 32px"
            }}
            motionAnimate={{
                initial: {
                    backgroundImage:
                        `linear-gradient(to right, ${color_white}, ${color_white}), linear-gradient(0deg, ${color_1}, ${color_5} 60%)`
                },
                animate: {
                    backgroundImage:
                        `linear-gradient(to right, ${color_white}, ${color_white}), linear-gradient(360deg, ${color_1}, ${color_5} 60%)`
                },
                transition: {
                    type: "tween",
                    ease: [0.17, 0.67, 0.83, 0.67],
                    duration: 2,
                    repeat: Infinity,
                },
            }}
            onClick={onClick}
            disabled={disabled}
            tabIndex={tabIndex}>
            {children}
        </Button>
    );
};

export default AnimationButton;