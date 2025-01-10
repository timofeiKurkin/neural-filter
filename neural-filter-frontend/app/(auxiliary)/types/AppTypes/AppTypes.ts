import React, {SyntheticEvent} from "react";

export type InputChangeEventHandler = React.ChangeEvent<HTMLInputElement>
// export type TextareaChangeEventHandler = React.ChangeEventHandler<HTMLTextAreaElement>

export type ChildrenType = {children: React.ReactNode};

export interface FocusEvent<T = Element> extends SyntheticEvent<T> {
    relatedTarget: EventTarget | null;
    target: EventTarget & T;
}