import {JwtPayload} from "jwt-decode";

export interface JwtPayloadExtended extends JwtPayload {
    user_id: number;
    username: string;
}