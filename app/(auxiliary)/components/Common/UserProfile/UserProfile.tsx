"use client"

import React, {FC, useState} from "react";

import userPhoto from "@/public/user-profile-photo.svg";
import {motion, Variants} from "framer-motion";

import styles from "./UserProfile.module.scss";
import Image from "next/image";
import NavigationText from "@/app/(auxiliary)/components/UI/TextTemplates/NavigationText";
import RegularText from "@/app/(auxiliary)/components/UI/TextTemplates/RegularText";
import {selectorUser, setAuth, setUser, useDispatch, useSelector} from "@/app/(auxiliary)/lib/redux/store";
import MainShadow from "@/app/(auxiliary)/components/UI/Borders/MainShadow/MainShadow";
import {AnimatePresence} from "framer-motion";
import {IUser} from "@/app/(auxiliary)/types/UserTypes/IUser";


const UserProfile: FC = () => {
    const dispatch = useDispatch()
    const {user, isAuth} = useSelector(selectorUser)

    const [visibleUserMenu, setVisibleUserMenu] = useState<boolean>(false)

    const menuAnimate: Variants = {
        "hidden": {
            opacity: 0,
            paddingTop: 0
        },
        "visible": {
            opacity: 1,
            paddingTop: 20
        },
    }

    const logoutHandler = () => {
        localStorage.removeItem('access')
        localStorage.removeItem('refresh')

        dispatch(setAuth(false))
        dispatch(setUser({} as IUser))
    }

    return (
        <div className={styles.userProfileWrapper}>
            <div className={styles.userProfile}
                 onMouseEnter={() => setVisibleUserMenu((prevState) => (!prevState))}
                 onMouseLeave={() => setVisibleUserMenu((prevState) => (!prevState))}
            >
                <div className={styles.userProfileName}>
                    {isAuth &&
                        <RegularText>
                            {user.username ?? "no auth"}
                        </RegularText>}
                </div>

                <div className={styles.userProfilePhoto}>
                    <Image src={userPhoto} alt={"user-photo"}/>
                </div>

                <AnimatePresence>
                    {
                        visibleUserMenu &&
                        <motion.div className={styles.menu}
                                    variants={menuAnimate}
                                    initial={"hidden"}
                                    animate={"visible"}
                                    exit={"hidden"}
                        >
                            <MainShadow>
                                <div className={styles.menuItem}
                                     onClick={logoutHandler}
                                >
                                    <NavigationText>
                                        Logout
                                    </NavigationText>
                                </div>
                            </MainShadow>
                        </motion.div>
                    }
                </AnimatePresence>
            </div>
        </div>
    );
};

export default UserProfile;