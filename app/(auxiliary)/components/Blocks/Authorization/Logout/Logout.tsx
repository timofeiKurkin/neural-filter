import React from 'react';
import {color_white} from "@/styles/color";
import NavigationText from "@/app/(auxiliary)/components/UI/TextTemplates/NavigationText";
import MainShadow from "@/app/(auxiliary)/components/UI/Borders/MainShadow/MainShadow";
import {setAuth, setUser, useDispatch, useSelector} from "@/app/(auxiliary)/lib/redux/store";
import {IUser} from "@/app/(auxiliary)/types/UserTypes/IUser";
import {
    InitialNeuralNetworkStateType,
    selectorNeuralNetwork
} from "@/app/(auxiliary)/lib/redux/store/slices/neuralNetwork";
import {$api_client} from "@/app/(auxiliary)/lib/axios";

const Logout = () => {
    const dispatch = useDispatch()
    const {ws}: InitialNeuralNetworkStateType = useSelector(selectorNeuralNetwork)

    const logoutHandler = async () => {
        localStorage.removeItem('access')
        await $api_client.post("logout/")

        if (ws instanceof WebSocket) {
            ws.close()
        }

        dispatch(setAuth(false))
        dispatch(setUser({} as IUser))
    }

    return (
        <MainShadow>
            <div style={{
                backgroundColor: color_white,
                padding: "16px 32px"
            }}
                 onClick={logoutHandler}>
                <NavigationText>
                    Logout
                </NavigationText>
            </div>
        </MainShadow>
    );
};

export default Logout;