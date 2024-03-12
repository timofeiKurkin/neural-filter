import React, {useEffect} from 'react';
import styles from "./ErrorsHandler.module.scss";
import {useDispatch, useSelector} from "@/app/(auxiliary)/lib/redux/store";
import CustomError from "@/app/(auxiliary)/components/Common/ErrorsHandler/CustomError/CustomError";
import {selectorApplication, setError} from "@/app/(auxiliary)/lib/redux/store/slices/applicationSlice";
import {CustomErrorType} from "@/app/(auxiliary)/types/AppTypes/Errors";

const ErrorsHandler = () => {
    const dispatch = useDispatch()
    // const {errorFiles} = useSelector(selectorFiles)

    const {errorList}: {errorList: CustomErrorType[]} = useSelector(selectorApplication)

    // console.log(errorFiles)

    useEffect(() => {
        if (errorList.length) {
            setInterval(() => {
                dispatch(setError(errorList.slice(0, -1)))
            }, 6000)
        }

        // return () => {
        //     if(errorList.length) {
        //         dispatch(setError([]))
        //     }
        // }
    }, [errorList]);

    if (errorList.length) {
        return (
            <div className={styles.errorsHandlerList} style={{
                gridTemplateRows: `repeat(${errorList.length}, min-content)`
            }}>
                {errorList.map((error, index) => (
                    <CustomError key={`key=${index}`} error={error}/>
                ))}
            </div>
        );
    }
};

export default ErrorsHandler;