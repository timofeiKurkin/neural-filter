import {createLogger} from "redux-logger";
const middleware = [
    createLogger({
        duration: true,
        timestamp: false,
        collapsed: true,
        predicate: () => typeof window !== 'undefined',
    })
]

export {middleware}