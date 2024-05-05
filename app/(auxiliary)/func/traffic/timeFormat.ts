export const formattedTime = (time: number) => {
    const date = new Date(time * 1000) // умножаем на 1000, потому что в JavaScript время в миллисекундах

    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    const seconds = date.getSeconds().toString().padStart(2, '0')

    return `${hours}:${minutes}:${seconds}`
}