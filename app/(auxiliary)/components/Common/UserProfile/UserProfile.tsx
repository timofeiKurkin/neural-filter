"use client"

import React from "react";

import userPhoto from "@/public/user-profile-photo.svg";

import styles from "./UserProfile.module.scss";
import Image from "next/image";
import NavigationText from "@/app/(auxiliary)/components/UI/TextTemplates/NavigationText";
import RegularText from "@/app/(auxiliary)/components/UI/TextTemplates/RegularText";
import {selectorUser, useSelector} from "@/app/(auxiliary)/lib/redux/store";


const UserProfile = () => {
    const {user, isAuth} = useSelector(selectorUser)

    return (
        <div className={styles.userProfileWrapper}>
            <div className={styles.userProfile}>
                <div className={styles.userProfileName}>
                    {isAuth &&
                        <RegularText>
                            {user.name}
                        </RegularText>}
                </div>

                <div className={styles.userProfilePhoto}>
                    <Image src={userPhoto} alt={"user-photo"}/>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;