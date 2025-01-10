import React from 'react';

import _mainPage from "@/data/mainPage/mainPage.json";

import RegularText from "@/app/(auxiliary)/components/UI/TextTemplates/RegularText";
import MainTitle from "@/app/(auxiliary)/components/UI/TextTemplates/MainTitle";

import styles from "./MainPage.module.scss";
import fontsStyle from "@/styles/FontsStyle/fontsStyle.module.scss";

const MainPage = () => {
    return (
        <div className={styles.mainPage}>
            <MainTitle>
                Introduction
            </MainTitle>

            <div className={styles.contentListWrapper}>
                <div className={styles.contentList}>
                    {_mainPage.map(item => (
                        <div key={`key=${item.id}`} className={styles.contentItem}>
                            <div className={styles.content}>
                                <div className={fontsStyle.logoTextStyle}>
                                    {item.title}
                                </div>

                                <div>
                                    <RegularText>
                                        {item.description}
                                    </RegularText>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MainPage;