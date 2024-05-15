import {NextRequest, NextResponse} from "next/server";
import {$api} from "@/app/(auxiliary)/lib/axios";
import axios, {AxiosResponse} from "axios";

export async function POST(request: NextRequest) {
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
    const data: {refresh: string; access: string} = (res as AxiosResponse).data

    const response = NextResponse.json(data)
    // response.cookies.set({
    //     name: "access",
    //     value: data.access
    // })
    response.cookies.set({
        name: "refresh",
        value: data.refresh
    })

    return response
}