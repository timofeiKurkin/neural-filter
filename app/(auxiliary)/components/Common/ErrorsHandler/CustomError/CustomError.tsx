import React, {FC} from 'react';
import {ErrorFilesType} from "@/app/(auxiliary)/types/FilesType/ErrorFilesType";
import styles from "./CustomError.module.scss";
import RegularText from "@/app/(auxiliary)/components/UI/TextTemplates/RegularText";


interface PropsType {
    error: ErrorFilesType;
}

const CustomError: FC<PropsType> = ({error}) => {
    return (
        <div className={`${styles.customErrorWrapper} ${styles.customErrorBorder}`}>
            <div className={styles.customErrorTitle}>
                <RegularText>{error.typeError}</RegularText>

                <div className={styles.customErrorTitleLine}></div>

                <RegularText>{error.pageError}</RegularText>
            </div>

            <div className={styles.customError}>
                <RegularText>
                    <span className={styles.customErrorHighlighting}>Code: </span>
                    <span className={styles.customErrorText}>{error.errors[0].code}</span>
                </RegularText>

                <RegularText>
                    <span className={styles.customErrorHighlighting}>Message: </span>
                    <span className={styles.customErrorText}>{error.errors[0].message}</span>
                </RegularText>
            </div>
        </div>
    );
};

export default CustomError;