import React, {FC, useCallback, useState} from "react";

import {useDropzone} from "react-dropzone";
import directory from "@/public/directory.svg";
import directoryOpen from "@/public/directory-open.svg";
import filePreview from "@/public/file.svg";
import cross from "@/public/cross.svg";
import {motion, Variants} from "framer-motion";

import styles from "./DropZone.module.scss";
import Image from "next/image";
import RegularText from "@/app/(auxiliary)/components/UI/TextTemplates/RegularText";

const DropZone: FC = () => {
    const [filesUnique, setFilesUnique] = useState(new Set())

    const files: any[] = Array.from(filesUnique)

    const onDrop = useCallback((acceptedFiles: any[]) => {
        if (acceptedFiles.length) {
            setFilesUnique(() => {
                const newSet = new Set(files)
                acceptedFiles.forEach((acceptedFile) => {
                    if (acceptedFile.name.split('.')[1] === 'pcap') {
                        newSet.add(Object.assign(acceptedFile, {preview: URL.createObjectURL(acceptedFile)}))
                    }
                })
                return newSet
            })
        }
    }, [])

    const {getRootProps, getInputProps, isDragActive} = useDropzone({
        onDrop,
        accept: {},
    })

    const removeFileHandler = (index: number) => {
        setFilesUnique(() => {
            const newSet = new Set()
            files.forEach((file, i) => {
                if(i !== index) {
                    newSet.add(file)
                }
            })
            return newSet
        })
    }

    const listVariants: Variants = {
        'visible': {
            y: 0, opacity: 1
        },
        'hidden': {
            y: -10, opacity: 0
        }
    }

    const substrateVariants: Variants = {
        'open': {},
        'hidden': {}
    }

    return (
        <motion.div className={styles.substrateDropZone}
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
                            {
                                files.map((file, index) => (
                                    <motion.div key={`key=${file.path}`}
                                                className={styles.dropFilePreview}
                                                variants={listVariants}
                                                initial={'hidden'}
                                                animate={'visible'}
                                    >
                                        <Image src={filePreview} alt={"file"}/>

                                        <RegularText>{file.name}</RegularText>

                                        <div className={styles.removeFile} onClick={() => removeFileHandler(index)}>
                                            <Image src={cross} alt={'cross'}/>
                                        </div>
                                    </motion.div>
                                ))
                            }
                        </div>
                    </div> : ''
                }
            </div>
        </motion.div>
    );
};

export default DropZone;