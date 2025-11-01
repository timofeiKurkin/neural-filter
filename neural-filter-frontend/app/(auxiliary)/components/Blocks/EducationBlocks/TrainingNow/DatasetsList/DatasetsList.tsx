import React, {FC} from 'react';
import {DatasetType} from "@/app/(auxiliary)/types/FilesType/DatasetsType";
import Dataset from "@/app/(auxiliary)/components/Blocks/EducationBlocks/TrainingNow/DatasetsList/Dataset/Dataset";


/**
 * Блок со списком из datasets
 *
 * Страница: localhost/education-ai
 * @param datasets
 * @constructor
 */
interface PropsType {
    datasets: DatasetType[];
}

const DatasetsList: FC<PropsType> = ({datasets}) => {
    const formattedDataset = [...datasets].concat(new Array(6 - datasets.length).fill([]))

    return (
        <div
            style={{
                display: "grid",
                gridTemplateRows: "repeat(6, 41px)",
                gridTemplateColumns: "1fr",
                rowGap: 19,
            }}
        >
            {formattedDataset.map((dataset: DatasetType, index) => (
                <Dataset key={`key=${index}`}
                         dataset={dataset}/>
            ))}
        </div>
    );
};

export default DatasetsList;