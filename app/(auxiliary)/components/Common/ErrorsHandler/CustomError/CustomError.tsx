import React, {FC} from 'react';
import styles from "./CustomError.module.scss";
import RegularText from "@/app/(auxiliary)/components/UI/TextTemplates/RegularText";
import {AnimatePresence, motion, Variants} from "framer-motion";
import {CustomErrorType, ErrorFilesType, JustErrorType} from "@/app/(auxiliary)/types/AppTypes/Errors";


interface PropsType {
    error: CustomErrorType;
}

const CustomError: FC<PropsType> = ({error}) => {

    const variants: Variants = {
        "initial": {
            opacity: 1
        },
        "hide": {
            opacity: 0
        }
    }

    return (
        <AnimatePresence>
            {
                Object.keys(error).length && (
                    <motion.div
                        variants={variants}
                        initial={"initial"}
                        exit={"hide"}
                        className={`${styles.customErrorWrapper} ${styles.customErrorBorder}`}>
                        <div className={styles.customErrorTitle}>
                            <RegularText>{error.typeError}</RegularText>

                            <div className={styles.customErrorTitleLine}></div>

                            <RegularText>{error.page}</RegularText>
                        </div>

                        <div className={styles.customError}>
                            <RegularText>
                                <span className={styles.customErrorHighlighting}>Code: </span>
                                <span className={styles.customErrorText}>
                                    {(error.expansion as ErrorFilesType).errors ?
                                        (error.expansion as ErrorFilesType).errors[0].code
                                        :
                                        (error.expansion as JustErrorType).code
                                    }
                                </span>
                            </RegularText>

                            <RegularText>
                                <span className={styles.customErrorHighlighting}>Message: </span>
                                <span className={styles.customErrorText}>
                                    {(error.expansion as ErrorFilesType).errors ?
                                        (error.expansion as ErrorFilesType).errors[0].message
                                        :
                                        (error.expansion as JustErrorType).message
                                    }
                                </span>
                            </RegularText>
                        </div>
                    </motion.div>
                )
            }
        </AnimatePresence>
    );
};

export default CustomError;