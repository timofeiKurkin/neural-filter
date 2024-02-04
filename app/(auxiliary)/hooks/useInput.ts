import {useState} from "react";
import useValidation from "./useValidation";
import useLocalStorage from "./useLocalStorage";
import {UseInputType, ValidationReturnDataType, ValidationsKeyType, ValidationsType} from "@/app/(auxiliary)/types/AppTypes/HooksTypes";
import {InputChangeEventHandler} from "@/app/(auxiliary)/types/AppTypes/AppTypes";

const UseInput = (initialValue: string, key: ValidationsKeyType['key'], validations: ValidationsType): UseInputType => {
	const [value, setValue] = useLocalStorage(key, initialValue)

	const [isDirty, setDirty] = useState<boolean>(false)
	const formValid: ValidationReturnDataType = useValidation(value, validations)

	const onChange = (e: InputChangeEventHandler) => {
		setValue(e.target.value)
	}

	const onBlur = () => {
		// setDirty((prev) => (!prev))
		setDirty(true)
	}

	return {
		value,
		onChange,
		onBlur,
		isDirty,
		...formValid,
		key,
	}
};

export default UseInput;