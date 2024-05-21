import React, {FC, useCallback, useEffect, useState} from "react";

import {FileError, useDropzone} from "react-dropzone";
import directory from "@/public/directory.svg";
import directoryOpen from "@/public/directory-open.svg";
import filePreview from "@/public/file.svg";
import cross from "@/public/cross.svg";
import {AnimatePresence, motion, Variants} from "framer-motion";

import styles from "./DropZone.module.scss";
import Image from "next/image";
import RegularText from "@/app/(auxiliary)/components/UI/TextTemplates/RegularText";
import {useDispatch, useSelector} from "@/app/(auxiliary)/lib/redux/store";
import {InitialFilesStateType, selectorFiles, setFiles} from "@/app/(auxiliary)/lib/redux/store/slices/filesSlice";
import {usePathname} from "next/navigation";
import {selectorApplication, setError} from "@/app/(auxiliary)/lib/redux/store/slices/applicationSlice";
import {CustomErrorType, ErrorFilesType} from "@/app/(auxiliary)/types/AppTypes/Errors";
import {current} from "immer";


const DropZone: FC = () => {
    const pathname = usePathname()
    const page = `/${pathname.split('/').filter(Boolean)[0]}`

    const dispatch = useDispatch()
    const {files, uploadingFilesStatus}: InitialFilesStateType = useSelector(selectorFiles)
    const {errorList}: { errorList: CustomErrorType[] } = useSelector(selectorApplication)

    const [totalFilesSize, setTotalFilesSize] = useState<number>(0)

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const filteredFiles = acceptedFiles.filter((file) => !files.includes(file))

        if (filteredFiles.length) {
            dispatch(setFiles([
                ...files,
                ...filteredFiles,
            ]))
        }
    }, [dispatch, files])

    const noRepeatFiles = <T extends File>(file: T): FileError | FileError[] | null | any => {
        if (file.name && file.name.split('.')[1] !== 'pcap') {
            return {
                code: 415,
                message: "Sorry, you can upload only .pcap files."
            }
        }

        if (files.filter((fileStore) => (fileStore.name === file.name)).length) {
            return {
                code: 409,
                message: `File '${file.name}' with that name already exists. Please, rename file or upload another.`
            }
        }

        const totalSize = files.reduce((acc, current) => {
            return acc + current.size
        }, 0) + file.size
        setTotalFilesSize(() => totalSize)

        if(totalSize >= (1073741824 + 1073741824 * .1)) {
            return {
                code: 413,
                message: `The file/s has a size ${(totalSize / 1073741824).toFixed(2)}GB. The maximum allowed size of uploaded files is 1GB`
            }
        }

        return null
    }

    const {
        fileRejections,
        getRootProps,
        getInputProps,
        isDragActive
    } = useDropzone({
        validator: noRepeatFiles,
        onDrop,
        accept: {},
        maxFiles: 10,
        disabled: uploadingFilesStatus
    })


    const removeFileHandler = (fileName: string) => {
        if (!uploadingFilesStatus) {
            const removeFile = files.filter(file => file.name !== fileName)
            dispatch(setFiles(removeFile))
        }
    }


    useEffect(() => {
        if (fileRejections.length) {

            /**
             * Ошибки от библиотеки.
             * rejections - одна ошибка
             */
            fileRejections.forEach((rejections) => {
                /**
                 * errorFiles - Ошибки из состояния.
                 * error - одна ошибка
                 */
                const filteredErrors = errorList.filter((error) => ((error.expansion as ErrorFilesType).fileName === rejections.file.name))

                dispatch(setError([
                    ...filteredErrors,
                    {
                        id: errorList.length,
                        page: page,
                        typeError: "Upload error",
                        expansion: {
                            fileName: rejections.file.name,
                            fileSize: rejections.file.size,
                            errors: rejections.errors,
                        }
                    }
                ]))
            })
        }
    }, [fileRejections]);

    const listVariants: Variants = {
        'visible': {
            y: 0, opacity: 1
        },
        'hidden': {
            y: -10, opacity: 0
        },
        'exit': {}
    }

    const substrateVariants: Variants = {
        'open': {
            height: "auto"
        },
        'hidden': {
            height: "0"
        }
    }

    return (
        <motion.div className={styles.substrateDropZone}
                    initial={'hidden'}
                    animate={'open'}
                    variants={substrateVariants}
        >
            <div className={styles.dropZone}>
                <div {...getRootProps({
                    // сюда можно передавать классы/стили
                    style: {userSelect: "none", cursor: uploadingFilesStatus ? "default" : "pointer"}
                })}
                     className={styles.dropZoneWrapper}>
                    <input {...getInputProps()}
                           className={styles.dropInput}/>

                    <div className={styles.dropTextContent}>
                        <div className={styles.dropYouCanSend}>
                            {
                                isDragActive ?
                                    <div className={styles.dropTheDatasetHere}>
                                        <Image src={directoryOpen} alt={"directory-open"}/>

                                        <RegularText>
                                            Drop the dataset here ...
                                        </RegularText>
                                    </div>
                                    :
                                    <div className={styles.sendDataset}>
                                        <Image src={directory} alt={"directory"}/>
                                        <RegularText>
                                            Send dataset
                                        </RegularText>
                                        <RegularText>
                                            Note: PCAP data format
                                        </RegularText>
                                    </div>
                            }
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.filesList}>
                {files.length ?
                    <div className={styles.filesListWrapper}>
                        <div className={styles.dropFilesPreview}>
                            <AnimatePresence>
                                {
                                    files.map((file) => (
                                        <motion.div key={`key=${file.name}`}
                                                    className={styles.dropFilePreview}
                                                    variants={listVariants}
                                                    initial={'hidden'}
                                                    animate={'visible'}
                                                    exit={'hidden'}
                                        >
                                            <Image src={filePreview} alt={"file"}/>

                                            <RegularText>{file.name}</RegularText>

                                            <div className={styles.removeFile}
                                                 style={{
                                                     cursor: uploadingFilesStatus ?
                                                         "default" :
                                                         "pointer"
                                                 }}
                                                 onClick={() => removeFileHandler(file.name)}>
                                                <Image src={cross} alt={'cross'}/>
                                            </div>
                                        </motion.div>
                                    ))
                                }
                            </AnimatePresence>
                        </div>
                    </div> : ''
                }
            </div>
        </motion.div>
    );
};

export default DropZone;