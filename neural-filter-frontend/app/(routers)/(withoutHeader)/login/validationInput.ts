interface ValidationInput {
    isEmpty: boolean,
    minLength: number,
    maxLength: number,
    emailValidate?: boolean
}

const usernameValidations: ValidationInput = {
    isEmpty: true,
    minLength: 0,
    maxLength: 25,
}
const passwordValidations: ValidationInput = {
    isEmpty: true,
    minLength: 8,
    maxLength: 32
}

export {
    usernameValidations,
    passwordValidations
}