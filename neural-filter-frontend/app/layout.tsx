import type {Metadata} from "next"
import "./globals.scss"
import React from "react";
import {KanitLocalFont} from "@/font/font";
import Providers from "@/app/(auxiliary)/lib/redux/Providers";
import AppWrapper from "@/app/(auxiliary)/components/Sections/AppWrapper/AppWrapper";
import {cookies} from "next/headers";
import axios from "axios";


export const metadata: Metadata = {
    title: "Neural filter",
}

interface PropsType {
    children: React.ReactNode
}

export default function RootLayout({children}: PropsType) {
    const cookiesStore = cookies()
    const tokenObject = cookiesStore.get('csrftoken' as any)
    const refreshToken = cookiesStore.get("refresh")

    let CSRFToken: string = ''
    if (tokenObject?.value) {
        CSRFToken = tokenObject.value
    }

    return (
        <html lang="en">
        <body className={`${KanitLocalFont.className}`}>
        <Providers>
            <AppWrapper CSRFToken={CSRFToken}
                        refreshToken={refreshToken?.value}>
                {children}
            </AppWrapper>
        </Providers>
        </body>
        </html>
    )
}