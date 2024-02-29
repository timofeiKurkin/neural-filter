"use client"

import React, {useState} from 'react';
import Button from "@/app/(auxiliary)/components/UI/Button/Button";
import {color_1, color_white} from "@/styles/color";
import DropZone from "@/app/(auxiliary)/components/Blocks/EducationBlocks/DragDrop/DropZone/DropZone";
import styles from "./DragDrop.module.scss";
import {AnimatePresence, Variants} from "framer-motion";
import {motion} from "framer-motion";
import {useDispatch, useSelector} from "@/app/(auxiliary)/lib/redux/store";
import {selectorFiles, setFiles} from "@/app/(auxiliary)/lib/redux/store/slices/filesSlice";
import {uploadFiles} from "@/app/(routers)/(withHeader)/education-ai/func";

const DragDrop = () => {
    const dispatch = useDispatch()
    const {files} = useSelector(selectorFiles)

    const [title, setTitle] = useState<string>('')


    /**
     * Функция для изменения состояния removeAllFiles
     */
    const removeAllFilesHandler = () => {
        dispatch(setFiles([]))
    }


    /**
     * Функция для отправки пакетов на сервер
     */
    const uploadFilesHandler = async () => {
        const fromData = new FormData()

        // Изменить метод .toString
        fromData.append('file', files)
        // fromData.append('dataset-title', title)

        await uploadFiles(fromData).then((r) => console.log(r)).catch((e) => console.log(e))
    }


    const variants: Variants = {
        'visible': {opacity: 1},
        'hidden': {opacity: 0}
    }

    return (
        <div className={styles.dragDrop}>
            <DropZone/>

            <AnimatePresence>
                {
                    files.length && (
                        <motion.div
                            className={styles.dragDropResetButton}
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


            <AnimatePresence>
                {
                    files.length && (
                        <div className={styles.inputTitleDataset}>
                            <input value={title} onChange={(e) => (setTitle(e.target.value))}/>
                        </div>
                    )
                }
            </AnimatePresence>


            <div className={styles.dragDropButton}>
                <Button style={{backgroundColor: color_1, textColor: color_white}} onClick={uploadFilesHandler}>
                    Send & Start education
                </Button>
            </div>
        </div>
    );
};

export default DragDrop;