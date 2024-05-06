"use client"

import React, {useState} from 'react';
import Button from "@/app/(auxiliary)/components/UI/Button/Button";
import {color_1, color_white} from "@/styles/color";
import DropZone from "@/app/(auxiliary)/components/Blocks/EducationBlocks/DragDrop/DropZone/DropZone";
import styles from "./DragDrop.module.scss";
import {AnimatePresence, motion, Variants} from "framer-motion";
import {useDispatch, useSelector} from "@/app/(auxiliary)/lib/redux/store";
import {
    InitialFilesStateType,
    selectorFiles,
    setDatasets,
    setFiles
} from "@/app/(auxiliary)/lib/redux/store/slices/filesSlice";
import {uploadFiles} from "@/app/(routers)/(withHeader)/education-ai/func";
import {AxiosResponse} from "axios";
import {UploadFilesResponse} from "@/app/(auxiliary)/types/FilesType/UploadFilesResponse";
import {AxiosErrorType} from "@/app/(auxiliary)/types/AxiosTypes/AxiosTypes";
import Input from "@/app/(auxiliary)/components/UI/Inputs/Input/Input";
import {InputChangeEventHandler} from "@/app/(auxiliary)/types/AppTypes/AppTypes";
import {DatasetType} from "@/app/(auxiliary)/types/FilesType/DatasetsType";

const DragDrop = () => {
    const dispatch = useDispatch()

    const {files, datasets}: InitialFilesStateType = useSelector(selectorFiles)

    const [lastDataset, setLastDataset] = useState<DatasetType>(() => ({} as DatasetType))

    const [datasetTitle, setDatasetTitle] = useState<string>(() => '')
    const titleHandler = (e: InputChangeEventHandler) => {
        setDatasetTitle(e.target.value)
    }


    /**
     * Функция для изменения состояния removeAllFiles
     */
    const removeAllFilesHandler = () => {
        dispatch(setFiles([]))
        setDatasetTitle("")
    }


    /**
     * Функция для отправки пакетов на сервер
     */
    const uploadFilesHandler = async (args: {
        files: File[],
        datasetTitle: string,
        datasets: DatasetType[]
    }) => {
        if (args.files.length && datasetTitle) {
            let formData = new FormData()

            args.files.forEach((file) => {
                formData.append("file", file)
            })
            formData.append('dataset_title', args.datasetTitle)

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

    const startEducationHandler = (args: {
        datasetID: string;
    }) => {
        console.log(args.datasetID)
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
                                   onChange={(event) => titleHandler(event)}/>
                        </motion.div>
                    )
                }
            </AnimatePresence>


            {
                !files.length && Object.keys(lastDataset).length ? (
                    <div className={styles.dragDropButton}>
                        <Button style={{backgroundColor: color_1, color: color_white}}
                                onClick={() => startEducationHandler({datasetID: lastDataset.modelID})}>
                            Start education
                        </Button>
                    </div>
                ) : (
                    <div className={styles.dragDropButton}>
                        <Button style={{backgroundColor: color_1, color: color_white}} disabled={!datasetTitle || !files.length}
                                onClick={() => uploadFilesHandler({
                                    files,
                                    datasetTitle,
                                    datasets
                                })}>
                            Send and save file{files.length > 1 ? "s" : ""} to dataset
                        </Button>
                    </div>
                )
            }
        </div>
    );
};

export default DragDrop;