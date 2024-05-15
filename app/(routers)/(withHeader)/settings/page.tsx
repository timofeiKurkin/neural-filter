import React from 'react';
import {cookies} from "next/headers";
import SettingsSection from "@/app/(auxiliary)/components/Sections/SettingsSection/SettingsSection";

const Page = () => {
    const cookiesStore = cookies()
    const token = cookiesStore.get('csrftoken')

    return (
        token?.value && <SettingsSection/>
    );
};

export default Page;