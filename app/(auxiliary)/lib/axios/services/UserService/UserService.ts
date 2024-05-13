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
            }
        )
    }

    static async refreshToken(refreshToken: string, csrfToken: string) {
        return $api.post(`${this.userPath}token/refresh/`, {
                refresh: refreshToken
            }
        )
    }

    static async logout(csrfToken: string) {
        return $api.post(`${this.userPath}logout/`)
    }

    static async changePassword(oldPassword: string, newPassword: string) {
        return $api.put(`${this.userPath}change-password/`, {
            old_password: oldPassword,
            new_password: newPassword
        })
    }
}