import React from 'react';
import $api from "@/app/(auxiliary)/lib/axios";
import {cookies} from "next/headers";

const Page = () => {
    const cookiesStore = cookies()
    const token = cookiesStore.get('csrftoken')

    const changePasswordHandler = async (csrfToken: string) => {
        const response = await $api.post("user/change-password", {
            "new_password": "123"
        }, {
            headers: {
                "X-CSRFToken": csrfToken
            }
        })

        console.log(response)
    }

    return (
        <div>
            {
                token?.value &&
                <div onClick={() => changePasswordHandler(token?.value)}>
                    settings
                </div>
            }


        </div>
    );
};

export default Page;