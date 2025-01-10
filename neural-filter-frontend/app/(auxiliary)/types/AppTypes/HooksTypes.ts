import React from "react";

export interface ValidationsType {
    isEmpty: boolean,
    minLength: number,
    maxLength: number,
    emailValidate?: boolean,
    nameValid?: boolean,
}

export interface ValidationsKeyType  {
    key: "emailLogin" | "passwordLogin" | "nameRegistration" | "emailRegistration" | "passwordRegistration" | "repeatPasswordRegistration" | "confirmationCode" | string
}

export interface ValidationReturnDataType {
    isEmpty: boolean,
    minLength: boolean,
    maxLength: boolean,
    nameError: boolean,
    emailError: boolean,
    inputValid: boolean,

    minLengthError: string,
    maxLengthError: string,
    nameValidError: string,
    emailValidError: string,
    isEmptyError: string
}

export interface UseInputType extends ValidationReturnDataType{
    value: string,
    onChange(e: React.ChangeEvent<HTMLInputElement>): void,
    onBlur: () => void,
    isDirty: boolean,
    key: string,
}