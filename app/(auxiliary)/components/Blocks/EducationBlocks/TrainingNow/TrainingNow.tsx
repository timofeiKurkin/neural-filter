"use client"

import React, {FC, useEffect} from 'react';
import MainShadow from "@/app/(auxiliary)/components/UI/Borders/MainShadow/MainShadow";
import RegularText from "@/app/(auxiliary)/components/UI/TextTemplates/RegularText";

import styles from "./TrainingNow.module.scss";
import {useDispatch, useSelector} from "@/app/(auxiliary)/lib/redux/store";
import {InitialFilesStateType, selectorFiles, setDatasets} from "@/app/(auxiliary)/lib/redux/store/slices/filesSlice";
import {AxiosErrorType} from "@/app/(auxiliary)/types/AxiosTypes/AxiosTypes";
import {AxiosResponse} from "axios";
import {DatasetsType, DatasetType} from "@/app/(auxiliary)/types/FilesType/DatasetsType";
import DatasetsList from "@/app/(auxiliary)/components/Blocks/EducationBlocks/TrainingNow/DatasetsList/DatasetsList";
import {axiosHandler} from "@/app/(auxiliary)/func/axiosHandler/axiosHandler";
import FileService from "@/app/(auxiliary)/lib/axios/services/FileService/FileService";
import {getAccessToken} from "@/app/(auxiliary)/func/app/getAccessToken";


/**
 * Блок с мгновенным обучением. Т.е. не нужно загружать файлы, а можно обучить уже по готовым
 *
 * Страница: localhost/education-ai
 * @constructor
 */
const TrainingNow: FC = () => {
    const dispatch = useDispatch()
    const {datasets}: InitialFilesStateType = useSelector(selectorFiles)
    const accessToken = getAccessToken()

    useEffect(() => {
        let active = true

        const fetchData = async (args: {
            accessToken: string
        }) => {
            const response = await axiosHandler(FileService.getDatasets(args.accessToken))

            if (active) {
                if ((response as AxiosResponse<DatasetsType>).status === 200) {
                    dispatch(setDatasets((response as AxiosResponse<DatasetsType>).data.datasets))
                } else if ((response as AxiosErrorType).message && (response as AxiosErrorType).statusCode) {
                }
            }
        }

        fetchData({
            accessToken
        }).then()

        return () => {
            active = false
        }
    }, [
        accessToken,
        dispatch
    ]);

    return (
        <MainShadow>
            <div className={styles.trainingNowWrapper}>
                <RegularText>Your datasets:</RegularText>

                <DatasetsList datasets={datasets}/>
            </div>
        </MainShadow>
    );
};

export default TrainingNow;