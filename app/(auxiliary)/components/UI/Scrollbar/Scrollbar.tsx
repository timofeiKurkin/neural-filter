'use client'

import React, {FC, useEffect, useRef, useState} from "react";

import {ChildrenType} from "@/app/(auxiliary)/types/AppTypes/AppTypes";

import styles from "./Scrollbar.module.scss";

const Scrollbar: FC<{children: React.ReactNode, trigger: any}> = ({children, trigger}) => {
    const [isScroll, setIsScroll] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if(containerRef.current && !isScroll) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight - containerRef.current.clientHeight
        }
    }, [containerRef.current, trigger]);

    useEffect(() => {
        const handleScroll = () => {setIsScroll((prevState) => (!prevState))}

        window.addEventListener('scroll', handleScroll)

        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, []);

    return (
        <div className={styles.scrollbar}
             // ref={containerRef}
        >
            {children}
        </div>
    );
};

export default Scrollbar;