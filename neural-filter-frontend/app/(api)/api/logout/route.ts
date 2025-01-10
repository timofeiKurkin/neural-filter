import {NextRequest, NextResponse} from "next/server";

export async function POST(request: NextRequest) {
    const response = NextResponse.json({message: "Logout"})
    // response.cookies.delete("access")
    response.cookies.delete("refresh")
    return response
}