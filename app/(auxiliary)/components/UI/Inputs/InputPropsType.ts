import {UseInputType} from "@/app/(auxiliary)/types/AppTypes/HooksTypes";
import React from "react";

export interface PropsType {
    inputData: UseInputType;
    placeholder: string;
    type?: "text" | "password";
    disabled?: boolean;
    maxLength: number;
    tabIndex: number;
}

export interface PropsTypePassword extends PropsType {
    setPassword?: React.Dispatch<React.SetStateAction<string>>
}