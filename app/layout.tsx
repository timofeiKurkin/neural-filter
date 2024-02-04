import type {Metadata} from "next"
import "./globals.scss"
import React from "react";
import {kanit} from "@/font/font"
import Providers from "@/app/(auxiliary)/lib/redux/Providers";
import AppWrapper from "@/app/(auxiliary)/components/Sections/AppWrapper/AppWrapper";


export const metadata: Metadata = {
    title: "Neural filter",
}

interface PropsType {
    children: React.ReactNode
}

export default function RootLayout({children}: PropsType) {
    return (
        <html lang="en">
        <body className={`${kanit.className}`}>
        <Providers>
            <AppWrapper>
                {children}
            </AppWrapper>
        </Providers>
        </body>
        </html>
    )
}