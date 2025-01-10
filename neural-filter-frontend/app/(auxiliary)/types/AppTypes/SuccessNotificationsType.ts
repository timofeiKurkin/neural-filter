export interface SuccessNotificationsType {
    id: number;
    page: string;
    typeSuccess: "Upload success";
    expansion: {
        message: string;
    }
}
