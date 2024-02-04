import {useEffect, useState} from "react";
import {ValidationsKeyType} from "@/app/(auxiliary)/types/AppTypes/HooksTypes";

const UseLocalStorage = (key: ValidationsKeyType['key'], initialValue: string | boolean | {}) => {
	const getStorageValue = (key: ValidationsKeyType['key'], initialValue: string | number | {} | boolean) => {
		if(typeof window !== 'undefined') {
			const value: any = localStorage.getItem(key)
			const parse = JSON.parse(value)
			return parse || initialValue
		}
	}

	const [value, setValue] = useState(() => {
		return getStorageValue(key, initialValue)
	})

	useEffect(() => {
		localStorage.setItem(key, JSON.stringify(value))
	}, [key, value])

	return [value, setValue]
};

export default UseLocalStorage;