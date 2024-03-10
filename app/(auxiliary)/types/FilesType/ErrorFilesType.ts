import {FileError} from "react-dropzone";

export interface ErrorFilesType {
    fileName: string;
    errors: FileError[];
    fileSize?: number;
    // pageError: "/login" | "/all-traffic" | "/network-anomalies" | "/education-ai" | "/settings";
    pageError: string;
    typeError: "Upload error" | "Login error" | "Education error";
}