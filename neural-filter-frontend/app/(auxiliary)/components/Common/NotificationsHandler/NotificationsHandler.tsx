import React, {useEffect} from 'react';
import styles from "./NotificationsHandler.module.scss";
import {useDispatch, useSelector} from "@/app/(auxiliary)/lib/redux/store";
import {
    clearSuccessNotifications,
    deleteLastSuccessNotification,
    InitialApplicationStateType,
    selectorApplication,
    setError
} from "@/app/(auxiliary)/lib/redux/store/slices/applicationSlice";
import {CustomErrorType} from "@/app/(auxiliary)/types/AppTypes/Errors";
import CustomError from "@/app/(auxiliary)/components/Common/NotificationsHandler/CustomError/CustomError";
import CustomSuccess from "@/app/(auxiliary)/components/Common/NotificationsHandler/CustomSuccess/CustomSuccess";

const NotificationsHandler = () => {
    const dispatch = useDispatch()

    const {errorList, successNotificationList}: InitialApplicationStateType = useSelector(selectorApplication)

    useEffect(() => {
        if (errorList.length) {
            setTimeout(() => {
                dispatch(setError(errorList.slice(0, -1)))
            }, 6000)
        }
    }, [dispatch, errorList]);

    useEffect(() => {
        if (successNotificationList.length) {
            setTimeout(() => {
                dispatch(deleteLastSuccessNotification())
            }, 6000)
        }
    }, [dispatch, successNotificationList]);

    return (
        <>
            <div className={styles.errorsHandlerList} style={{
                gridTemplateRows: `repeat(${errorList.length}, min-content)`
            }}>
                {errorList.map((error, index) => (
                    <CustomError key={`key=${index}`} error={error}/>
                ))}
            </div>

            <div className={styles.errorsHandlerList} style={{
                gridTemplateRows: `repeat(${successNotificationList.length}, min-content)`
            }}>
                {successNotificationList.map((notification, index) => (
                    <CustomSuccess key={`key=${index}`} successNotification={notification}/>
                ))}
            </div>
        </>
    );
};

export default NotificationsHandler;