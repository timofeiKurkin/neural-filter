"use client"

import React from "react";
import Header from "@/app/(auxiliary)/components/Common/Header/Header";
import styles from "./layout.module.scss";
import UserProfile from "@/app/(auxiliary)/components/Common/UserProfile/UserProfile";
import MainShadow from "@/app/(auxiliary)/components/UI/Borders/MainShadow/MainShadow";
import Scrollbar from "@/app/(auxiliary)/components/UI/Scrollbar/Scrollbar";
import NNStatus from "@/app/(auxiliary)/components/Common/NNStatus/NNStatus";
import {selectorUser, useSelector} from "@/app/(auxiliary)/lib/redux/store";
import {IUser} from "@/app/(auxiliary)/types/UserTypes/IUser";

interface PropsType {
    children: React.ReactNode
}

export default function RootLayout({children}: PropsType) {

    const {user}: { user: IUser } = useSelector(selectorUser)

    if (Object.keys(user).length) {
        return (
            <Scrollbar trigger={''}>
                <div className={styles.layoutWrapper}>
                    <Header/>

                    <div className={styles.layoutLine}></div>

                    <main className={styles.layoutContent}>
                        <div className={styles.statusAndProfile}>
                            <NNStatus/>

                            <UserProfile/>
                        </div>


                        <MainShadow>
                            <div className={styles.contentWrapper}>
                                <div className={styles.content}>
                                    {children}
                                </div>
                            </div>
                        </MainShadow>
                    </main>
                </div>
            </Scrollbar>

        )
    }
}