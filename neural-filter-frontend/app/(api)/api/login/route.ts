import {NextRequest, NextResponse} from "next/server";
import {$api} from "@/app/(auxiliary)/lib/axios";
import axios, {AxiosResponse} from "axios";
import {AxiosErrorType, UnknownError} from "@/app/(auxiliary)/types/AxiosTypes/AxiosTypes";

export async function POST(request: NextRequest) {
    try {
        const {
            username,
            password
        } = await request.json()

        const csrftoken = request.cookies.get("csrftoken")
        if (csrftoken?.value) {
            axios.defaults.headers.common['X-CSRFToken'] = csrftoken.value
        }

        const res = await $api.post("user/token/", {
            username,
            password
        })

        const data: { refresh: string; access: string } = (res as AxiosResponse).data

        const response = NextResponse.json(data)
        response.cookies.set({
            name: "refresh",
            value: data.refresh
        })

        return response
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return NextResponse.json({
                message: error.response?.data || error.message,
                statusCode: error.response?.status || 500
            } as AxiosErrorType)
        } else {
            return NextResponse.json({
                errorText: "Unknown error"
            } as UnknownError)
        }
    }
}