import {FileError} from "react-dropzone";

export interface ErrorFilesType {
    fileName: string;
    errors: FileError[];
    fileSize?: number;
}

export interface JustErrorType {
    code: number;
    message: string;
}

export interface CustomErrorType {
    id: number;
    page: string;
    typeError: "Upload error" | "Login error" | "Education error";
    expansion: ErrorFilesType | JustErrorType;
}