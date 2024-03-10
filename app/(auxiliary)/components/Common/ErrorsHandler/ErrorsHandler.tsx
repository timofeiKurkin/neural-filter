import React from 'react';
import styles from "./ErrorsHandler.module.scss";
import {useSelector} from "@/app/(auxiliary)/lib/redux/store";
import {selectorFiles} from "@/app/(auxiliary)/lib/redux/store/slices/filesSlice";
import CustomError from "@/app/(auxiliary)/components/Common/ErrorsHandler/CustomError/CustomError";

const ErrorsHandler = () => {

    const {errorFiles} = useSelector(selectorFiles)

    if (errorFiles.length || true) {
        return (
            <div className={styles.errorsHandlerList} style={{
                gridTemplateRows: `repeat(${errorFiles.length}, min-content)`
            }}>
                {errorFiles.map((error, index) => (
                    <CustomError key={`key=${index}`} error={error}/>
                ))}
            </div>
        );
    }
};

export default ErrorsHandler;