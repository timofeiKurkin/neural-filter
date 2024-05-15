"use client"

export const getAccessToken = () => {
    return typeof window !== 'undefined' ?
        (localStorage.getItem('access') || "").split('"').join('') : ""
}