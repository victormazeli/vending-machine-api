
export const generateOtp = () => {
    let str = '0123456789'
    let code = ""

    for (let index = 0; index < 6; index++) {
        code += str[Math.floor(Math.random() * str.length)];
        
    }
    return code
}

export const generatePassword = () => {
    let str = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ!@£$%&#'
    let code = ""

    for (let index = 0; index < 8; index++) {
        code += str[Math.floor(Math.random() * str.length)];
        
    }
    return code
}