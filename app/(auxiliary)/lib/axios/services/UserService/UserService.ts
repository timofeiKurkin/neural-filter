import {AxiosResponse} from "axios";
import $api, {API_URL_SERVER} from "@/app/(auxiliary)/lib/axios";

export default class UserService {
    static userPath = "user/"

    static async login(
        login: string,
        password: string,
        csrfToken: string
    ): Promise<AxiosResponse> {
        return $api.post(`${this.userPath}token/`, {
                username: login,
                password
            },
            //     {
            //     headers: {
            //         "X-CSRFToken": csrfToken
            //     }
            // }
        )
    }

    static async refreshToken(refreshToken: string, csrfToken: string) {
        return $api.post(`${this.userPath}token/refresh/`, {
                refresh: refreshToken
            },
            //     {
            //     headers: {
            //         'X-CSRFToken': csrfToken
            //     }
            // }
        )
    }

    static async logout(csrfToken: string) {
        return $api.post(`${this.userPath}logout/`, {},
            // {
            //     headers: {
            //         'X-CSRFToken': csrfToken
            //     }
            // }
        )
    }
}