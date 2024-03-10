"use client"

import React, {useState} from 'react';
import Button from "@/app/(auxiliary)/components/UI/Button/Button";
import {color_1, color_white} from "@/styles/color";
import DropZone from "@/app/(auxiliary)/components/Blocks/EducationBlocks/DragDrop/DropZone/DropZone";
import styles from "./DragDrop.module.scss";
import {AnimatePresence, Variants} from "framer-motion";
import {motion} from "framer-motion";
import {useDispatch, useSelector} from "@/app/(auxiliary)/lib/redux/store";
import {selectorFiles, setDatasets, setFiles} from "@/app/(auxiliary)/lib/redux/store/slices/filesSlice";
import {uploadFiles} from "@/app/(routers)/(withHeader)/education-ai/func";
// import {FileType} from "@/app/(auxiliary)/types/FilesType/FilesType";
import {AxiosResponse} from "axios";
import {DatasetType, UploadFilesResponse} from "@/app/(auxiliary)/types/FilesType/UploadFilesResponse";
// import {DatasetType} from "@/app/(auxiliary)/types/FilesType/DatasetsType";
import {AxiosErrorType} from "@/app/(auxiliary)/types/AxiosTypes/AxiosTypes";
import Input from "@/app/(auxiliary)/components/UI/Inputs/Input/Input";
import {InputChangeEventHandler} from "@/app/(auxiliary)/types";
import {startEducation} from "@/app/(auxiliary)/func/educationNeuralNetwork/startEducation";

const DragDrop = () => {
    const dispatch = useDispatch()

    const {files, datasets} = useSelector(selectorFiles)

    const [lastDataset, setLastDataset] = useState<DatasetType>({} as DatasetType)

    const [datasetTitle, setDatasetTitle] = useState<string>('')
    const titleHandler = (e: InputChangeEventHandler) => {
        setDatasetTitle(e.target.value)
    }


    /**
     * Функция для изменения состояния removeAllFiles
     */
    const removeAllFilesHandler = () => {
        dispatch(setFiles([]))
    }


    /**
     * Функция для отправки пакетов на сервер
     */
    const uploadFilesHandler = async (files: File[], datasetTitle: string) => {
        if (files.length && datasetTitle) {
            let formData = new FormData()

            files.forEach((file) => {
                formData.append("file", file)
            })
            formData.append('dataset_title', datasetTitle)

            let accessToken = typeof window !== "undefined" ? localStorage.getItem('access') ?? "" : ""
            accessToken = accessToken.split('"').join('')

            const response = await uploadFiles(formData, accessToken)

            if ((response as AxiosResponse<UploadFilesResponse>).status === 201) {
                const dataset = (response as AxiosResponse<UploadFilesResponse>).data.dataset
                setDatasetTitle('')
                setLastDataset(() => (dataset))

                dispatch(setFiles([]))
                dispatch(setDatasets([...datasets, dataset]))
            } else if ((response as AxiosErrorType).message && (response as AxiosErrorType).statusCode) {
            }
        }
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
                            <Button style={{backgroundColor: color_1, color: color_white}}
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
                        <motion.div className={styles.inputTitleDataset}>
                            <Input value={datasetTitle}
                                   placeholder={"dataset title..."}
                                   maxLength={20}
                                   tabIndex={1}
                                   onFocus={() => {
                                   }}
                                   onBlur={() => {
                                   }}
                                   onChange={titleHandler}/>
                        </motion.div>
                    )
                }
            </AnimatePresence>


            {
                Object.keys(lastDataset).length ? (
                    <div className={styles.dragDropButton}>
                        <Button style={{backgroundColor: color_1, color: color_white}}
                                onClick={() => startEducation(lastDataset.group_file_id)}>
                            Start education
                        </Button>
                    </div>
                ) : (
                    <div className={styles.dragDropButton}>
                        <Button style={{backgroundColor: color_1, color: color_white}} disabled={!datasetTitle}
                                onClick={() => uploadFilesHandler(files, datasetTitle)}>
                            Send and save file{files.length > 1 ? "s" : ""} to dataset
                        </Button>
                    </div>
                )
            }
        </div>
    );
};

export default DragDrop;