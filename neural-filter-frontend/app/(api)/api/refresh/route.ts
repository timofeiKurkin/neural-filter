import {NextRequest, NextResponse} from "next/server";
import {$api} from "@/app/(auxiliary)/lib/axios";
import {AxiosResponse} from "axios";

export async function POST(request: NextRequest) {
    const refresh = request.cookies.get("refresh")

    if(refresh?.value) {
        const res = await $api.post("user/token/refresh/", {
            refresh
        })

        if((res as AxiosResponse).status === 200) {
            const data: {access: string} = (res as AxiosResponse).data
            return NextResponse.json(data)
        }
    }

    return Response.json({
        message: "No authorization"
    })
}