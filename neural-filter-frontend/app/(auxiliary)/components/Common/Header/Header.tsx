import React, {FC} from "react";
import Image from "next/image";
import Link from "next/link";

import navigationData from "@/data/navigation/navigation.json";

import NavigationText from "@/app/(auxiliary)/components/UI/TextTemplates/NavigationText";

import {NavigationType} from "@/app/(auxiliary)/types/DataTypes/NavigationType";

import styles from "./Header.module.scss";
import MainShadow from "@/app/(auxiliary)/components/UI/Borders/MainShadow/MainShadow";
import {usePathname} from "next/navigation";
import {color_2} from "@/styles/color";
import NotificationsHandler from "@/app/(auxiliary)/components/Common/NotificationsHandler/NotificationsHandler";

const Header: FC = () => {
    const navigation: NavigationType[] = navigationData

    const pathname = usePathname()
    const currentPath = pathname.split('/').filter(Boolean)[0]

    return (
        <header className={styles.headerWrapper}>
            <div className={styles.headerFixed}>
                <div className={styles.header}>

                    <div className={styles.headerLogoWrapper}>
                        <div className={styles.headerLogo}>
                            <Link href={"/"}
                                  style={{position: 'relative', display: "block", width: "100%", height: "100%"}}>
                                <Image
                                    src={"/neural-filter-logo.svg"}
                                    alt={"neural filter logo"}
                                    priority={true}
                                    fill
                                    unoptimized
                                    quality={100}
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, (max-width: 1920px) 33vw"
                                    // style={{userSelect: "none", pointerEvents: "none"}}
                                />
                            </Link>
                        </div>
                    </div>

                    <MainShadow>
                        <div className={styles.headerNavigationWrapper}>
                            <nav className={styles.headerNavigationList}>
                                {navigation.map(navItem => (
                                    <div key={navItem.id} className={styles.headerNavigationItem}>
                                        <NavigationText>
                                            <Link href={navItem.href}>
                                                {navItem.id === navigation.length - 1 &&
                                                    <span className={styles.settingsGear}>
                                                        <Image src={"/settings-gear.svg"}
                                                               unoptimized
                                                               alt={"s-g"}
                                                               width={21}
                                                               height={21}/>
                                                    </span>}
                                                <span style={{color: currentPath === navItem.href ? color_2 : "black"}}>
                                                        {navItem.title}
                                                    </span>
                                            </Link>
                                        </NavigationText>
                                    </div>
                                ))}
                            </nav>
                        </div>
                    </MainShadow>

                    <NotificationsHandler/>
                </div>
            </div>
        </header>
    );
};

export default Header;