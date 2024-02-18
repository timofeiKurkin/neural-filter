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


interface PropsType {
    setHasFiles: (state: boolean) => void;
    removeFiles: boolean
}

const DropZone: FC<PropsType> = ({setHasFiles, removeFiles}) => {

    const [files, setFiles] = useState<File[]>([])

    const onDrop = useCallback((acceptedFiles: any[]) => {
        if (acceptedFiles.length) {
            setFiles((prevState) => [
                ...prevState,
                ...acceptedFiles.map((file) => Object.assign(file, {preview: URL.createObjectURL(file)})),
            ])
        }
    }, [])

    const noRepeatFiles = <T extends File>(file: T): FileError | FileError[] | null => {
        if (file.name.split('.')[1] !== 'pcap') {
            return {
                code: "",
                message: "only pcap files"
            }
        }

        return null
    }

    const {
        acceptedFiles,
        fileRejections,
        getRootProps,
        getInputProps,
        isDragActive
    } = useDropzone({
        validator: noRepeatFiles,
        onDrop,
        accept: {},
        maxFiles: 10
    })

    const removeFileHandler = (fileName: string) => {
        setFiles((prevState) => {
            return prevState.filter(file => file.name !== fileName)
        })
    }

    useEffect(() => {
        if (files.length > 0) {
            setHasFiles(true)
        } else {
            setHasFiles(false)
        }
    }, [files]);

    useEffect(() => {
        setFiles([])
    }, [removeFiles]);

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
                    style: {userSelect: "none", cursor: "pointer"}
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
                                    files.map((file, index) => (
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