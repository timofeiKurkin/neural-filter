"use client"

import React, {useState} from 'react';
import Button from "@/app/(auxiliary)/components/UI/Button/Button";
import {color_1, color_white} from "@/styles/color";
import DropZone from "@/app/(auxiliary)/components/Sections/EducationAI/DragDrop/DropZone/DropZone";
import styles from "./DragDrop.module.scss";
import {AnimatePresence, Variants} from "framer-motion";
import {motion} from "framer-motion";
import {useSelector} from "@/app/(auxiliary)/lib/redux/store";
import {selectorFiles} from "@/app/(auxiliary)/lib/redux/store/slices/filesSlice";

const DragDrop = () => {
    const {files} = useSelector(selectorFiles)

    /**
     * Состояние, хранящее boolean значение, которое обозначает есть ли файл в области загрузки
     */
    const [hasFiles, setHasFiles] = useState<boolean>(false)

    /**
     * Состояние для удаления всех файлов из области загрузки
     */
    const [removeAllFiles, setRemoveAllFiles] = useState<boolean>(false)

    const variants: Variants = {
        'visible': {opacity: 1},
        'hidden': {opacity: 0}
    }

    /**
     * Функция для изменения состояния hasFiles
     * @param state
     */
    const hasFilesHandler = (state: boolean) => {
        setHasFiles(state)
    }

    /**
     * Функция для изменения состояния removeAllFiles
     */
    const removeAllFilesHandler = () => {
        setRemoveAllFiles((prevState) => (!prevState))
    }

    console.log(files)

    /**
     * Функция для отправки пакетов на сервер
     */
    const uploadFilesHandler = () => {
        const fromData = new FormData()

        // Изменить метод .toString
        fromData.append('files', files.toString())
    }

    return (
        <div className={styles.dragDrop}>
            <DropZone setHasFiles={hasFilesHandler} removeFiles={removeAllFiles}/>

            <AnimatePresence>
                {
                    hasFiles && (
                        <motion.div
                            variants={variants}
                            initial={'hidden'}
                            animate={'visible'}
                            exit={'hidden'}
                        >
                            <Button style={{backgroundColor: color_1, textColor: color_white}}
                                    onClick={() => removeAllFilesHandler()}
                            >
                                Remove all files
                            </Button>
                        </motion.div>
                    )
                }
            </AnimatePresence>


            <div className={styles.dragDropButton}>
                <Button style={{backgroundColor: color_1, textColor: color_white}}>
                    Send & Start education
                </Button>
            </div>
        </div>
    );
};

export default DragDrop;