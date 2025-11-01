import React, {FC} from 'react';
import {SuccessNotificationsType} from "@/app/(auxiliary)/types/AppTypes/SuccessNotificationsType";
import {AnimatePresence, motion, Variants} from "framer-motion";
// import styles from "@/app/(auxiliary)/components/Common/NotificationsHandler/CustomError/CustomError.module.scss";
import styles from "./CustomSuccess.module.scss";
import RegularText from "@/app/(auxiliary)/components/UI/TextTemplates/RegularText";
import {ErrorFilesType, JustErrorType} from "@/app/(auxiliary)/types/AppTypes/Errors";


interface PropsType {
    successNotification: SuccessNotificationsType;
}

const CustomSuccess: FC<PropsType> = ({successNotification}) => {
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
                Object.keys(successNotification).length && (
                    <motion.div
                        variants={variants}
                        initial={"initial"}
                        exit={"hide"}
                        className={`${styles.customSuccessWrapper} ${styles.customSuccessBorder}`}>
                        <div className={styles.customSuccessTitle}>
                            <RegularText>{successNotification.typeSuccess}</RegularText>

                            <div className={styles.customSuccessTitleLine}></div>

                            <RegularText>{successNotification.page}</RegularText>
                        </div>

                        <RegularText>
                                <span className={styles.customSuccessHighlighting}>Message: </span>
                                <span className={styles.customSuccessText}>
                                    {successNotification.expansion.message}
                                </span>
                            </RegularText>
                    </motion.div>
                )
            }
        </AnimatePresence>
    );
};

export default CustomSuccess;