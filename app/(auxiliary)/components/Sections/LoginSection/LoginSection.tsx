import React, {FC} from "react";
import Image from "next/image";
import Link from "next/link";

import LoginBlock from "@/app/(auxiliary)/components/Blocks/LoginBlock/LoginBlock";

import styles from "./LoginSection.module.scss";
import {cookies} from "next/headers";
import MainTitle from "@/app/(auxiliary)/components/UI/TextTemplates/MainTitle";
import LogoText from "@/app/(auxiliary)/components/UI/TextTemplates/LogoText";

const LoginSection: FC = () => {
    const cookiesStore = cookies()
    const token = cookiesStore.get('csrftoken')

    return (
        <div className={styles.loginSectionWrapper}>
            <div className={styles.loginSectionLogoWrapper}>
                <div className={styles.loginSectionLogo}>
                    <Image src={"/neural-filter-logo.svg"}
                           alt={"neural filter logo"}
                           fill
                           quality={100}
                           priority={true}
                           sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, (max-width: 1920px) 33vw"
                    />
                </div>

                <div style={{display: "flex"}}>
                    <Link href={"https://kurkin_digital.ru"} className={styles.linkToMe}>
                        <LogoText>by kurkin_digital</LogoText>
                    </Link>
                </div>
            </div>

            <div className={styles.loginSectionBorder}></div>

            {
                token?.value && (
                    <div className={styles.loginSectionInputsWrapper}>
                        <LoginBlock csrfToken={token.value}/>
                    </div>
                )
            }

        </div>
    );
};

export default LoginSection;