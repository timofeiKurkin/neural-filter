import {Kanit} from "next/font/google"
import localFont from "next/font/local";

export const kanit = Kanit({
    weight: ['500', '600'],
    style: "normal",
    preload: true,
    subsets: ['latin']
})

export const KanitLocalFont = localFont({
    variable: "--localKanit-font",
    display: "swap",
    src: [
        {
            path: "./Kanit/Kanit-Medium.woff2",
            weight: "500",
            style: "normal"
        },
        {
            path: "./Kanit/Kanit-MediumItalic.woff2",
            weight: "500",
            style: "italic"
        },
        {
            path: "./Kanit/Kanit-SemiBold.woff2",
            weight: "600",
            style: "normal"
        },
        {
            path: "./Kanit/Kanit-SemiBoldItalic.woff2",
            weight: "600",
            style: "italic"
        }
    ]
})