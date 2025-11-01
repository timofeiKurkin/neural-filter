import React, {FC} from "react";
import Image from "next/image";
import Link from "next/link";

import LoginBlock from "@/app/(auxiliary)/components/Blocks/Authorization/LoginBlock/LoginBlock";

import styles from "./LoginSection.module.scss";
import LogoText from "@/app/(auxiliary)/components/UI/TextTemplates/LogoText";

const LoginSection: FC = () => {
    return (
        <div className={styles.wrapper}>
            <div className={styles.logoBody}>
                <div className={styles.logoWrapper}>
                    <Image src={"/neural-filter-logo.svg"}
                           alt={"neural filter logo"}
                           className={styles.logo}
                           unoptimized
                           fill
                           quality={100}
                           priority={true}
                           sizes="(max-width: 1279px) 50%, (min-width: 1280px) 70%"
                    />
                </div>

                <Link href={"https://kurkin.vercel.app/"} className={styles.linkToMe}>
                    <LogoText>by kurkin_digital</LogoText>
                </Link>
            </div>

            <div className={styles.sectionBorder}></div>

            <div className={styles.sectionInputsWrapper}>
                <LoginBlock/>
            </div>
        </div>
    );
};

export default LoginSection;