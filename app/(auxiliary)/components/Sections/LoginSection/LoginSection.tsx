import React, {FC} from "react";
import Image from "next/image";

import LoginBlock from "@/app/(auxiliary)/components/Blocks/LoginBlock/LoginBlock";

import styles from "./LoginSection.module.scss";

const LoginSection: FC = () => {
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
            </div>

            <div className={styles.loginSectionBorder}></div>

            <div className={styles.loginSectionInputsWrapper}>
                <LoginBlock/>
            </div>
        </div>
    );
};

export default LoginSection;