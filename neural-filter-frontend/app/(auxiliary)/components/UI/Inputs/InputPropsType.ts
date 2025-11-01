import React from "react";
import {InputChangeEventHandler} from "@/app/(auxiliary)/types/AppTypes/AppTypes";

export interface PropsType {
    // inputData: UseInputType;
    // placeholder: string;
    // type?: "text" | "password";
    // disabled?: boolean;
    // maxLength: number;
    // tabIndex: number;

    value: string;
    placeholder: string;
    type?: "text" | "password";
    disabled?: boolean;
    maxLength: number;
    tabIndex: number;

    onFocus: () => void;
    onBlur: () => void;
    onChange: (e: InputChangeEventHandler) => void;
}

export interface PropsTypePassword extends PropsType {
    setPassword?: React.Dispatch<React.SetStateAction<string>>
}