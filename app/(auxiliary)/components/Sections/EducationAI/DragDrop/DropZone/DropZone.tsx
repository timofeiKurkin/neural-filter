import React, {FC, useCallback, useState} from 'react';

import {useDropzone} from "react-dropzone";
import directory from "@/public/directory.svg"

import MainShadow from "@/app/(auxiliary)/components/UI/Borders/MainShadow/MainShadow";

import styles from "./DropZone.module.scss";
import Image from "next/image";
import RegularText from "@/app/(auxiliary)/components/UI/TextTemplates/RegularText";

const DropZone: FC = () => {

    const [files, setFiles] = useState<any[]>([])

    const onDrop = useCallback((acceptedFiles: any[]) => {
        if(acceptedFiles.length) {
            setFiles((prevState) => [
                ...prevState,
                ...acceptedFiles.map(file => Object.assign(file, {preview: URL.createObjectURL(file)}))
            ])
        }
    }, [])


    const {getRootProps, getInputProps, isDragActive} = useDropzone({
        onDrop,
        accept: {
            "packet": [".cap"]
        },
    })

    console.log(files)

    return (
        <MainShadow>
            <div {...getRootProps({
                // сюда можно передавать классы/стили
            })}
                 className={styles.dropZoneWrapper}>
                <input {...getInputProps()}
                       className={styles.dropInput}/>

                <div className={styles.dropTextContent}>
                    {
                        isDragActive ?
                            <div>
                                <Image src={directory} alt={"directory"}/>

                                <RegularText>
                                    Drop the dataset here ...
                                </RegularText>
                            </div>
                            :
                            <div>
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
        </MainShadow>
    );
};

export default DropZone;