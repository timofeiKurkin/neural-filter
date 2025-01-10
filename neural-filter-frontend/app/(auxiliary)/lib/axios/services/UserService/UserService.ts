import {AxiosResponse} from "axios";
import {$api, $api_client, API_URL_SERVER} from "@/app/(auxiliary)/lib/axios";

export default class UserService {
    static userPath = "user/"

    static async login(
        login: string,
        password: string,
        accessToken: string
    ): Promise<AxiosResponse> {
        return $api_client.post(`login/`, {
                username: login,
                password
            }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        )
    }

    static async refreshToken(refreshToken: string, accessToken: string) {
        return $api.post(`${this.userPath}token/refresh/`, {
                refresh: refreshToken
            }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        )
    }

    static async changePassword(
        oldPassword: string,
        newPassword: string,
        accessToken: string
    ) {
        return $api.put(`${this.userPath}change-password/`, {
            old_password: oldPassword,
            new_password: newPassword
        }, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
    }
}