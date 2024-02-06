"use client"

import React, {FC, useState} from 'react';
import {motion, AnimatePresence, Variants} from "framer-motion"
import RegularText from "@/app/(auxiliary)/components/UI/TextTemplates/RegularText";
import MainShadow from "@/app/(auxiliary)/components/UI/Borders/MainShadow/MainShadow";

const AnimationTest: FC<{ title: string, children: React.ReactNode }> = ({title = 'click me', children}) => {

    const [isVisible, setVisible] = useState(false)

    const visibilityHandler = () => {
        setVisible((prevState) => (!prevState))
    }

    const variants: Variants = {
        'initial': {
            height: 0,
            opacity: 0
        },
        'animate': {
            height: 'auto',
            opacity: 1
        },
        'exit': {
            height: 0,
            opacity: 0
        }
    }

    return (
        <div>
            <div onClick={visibilityHandler}
                 style={{marginBottom: 10}}>
                <RegularText>
                    {title}
                </RegularText>
            </div>

            <AnimatePresence initial={false}>
                {
                    isVisible && (
                        <motion.div
                            variants={variants}
                            initial={'initial'}
                            animate={'animate'}
                            exit={'exit'}
                            style={{overflow: "hidden"}}
                        >
                            <MainShadow>
                                <div style={{padding: "10px 20px"}}>
                                    {children}
                                </div>
                            </MainShadow>
                        </motion.div>
                    )
                }
            </AnimatePresence>
        </div>
    );
};

export default AnimationTest;