import {useEffect, useState} from "react";

interface WindowSizeType {
    width: number;
    height: number;
}

export const useWindowSize = (): WindowSizeType => {
    const [windowSize, setWindowSize] = useState<WindowSizeType>({
        width: 0,
        height: 0
    })

    const resizeHandle = () => {
        setWindowSize({
            width: window.innerWidth,
            height: window.innerHeight
        })
    }

    useEffect(() => {
        if (typeof window !== "undefined") {
            window.addEventListener('resize', resizeHandle)
            resizeHandle()

            return () => {
                window.removeEventListener('resize', resizeHandle)
            }
        }
    }, []);

    return windowSize
}
