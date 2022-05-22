import { CSVtoJSON, JSONtoCSV } from './utils.js'


export async function fetchCSV(URL) {
    try {
        const res = await fetch(URL, {
            method: 'get',
            headers: {
                'content-type': 'text/csv;charset=UTF-8',
            },
        })
        if (res.status === 200) {
            const data = await res.text()
            return CSVtoJSON(data)
        } else {
            console.log(`Error code ${res.status}`)
        }
    } catch (err) {
        console.log(err)
    }
}

export async function sendCartData(cartItems) {
    const currUser = sessionStorage.getItem('currentUser')
    console.log('currentUser', currUser)
    const cartId = JSON.parse(currUser).cartId

    const FD = new FormData()
    FD.append('file', `cart${cartId}`)
    FD.append('csvData', JSONtoCSV(cartItems))

    await fetch('php/writeToFile.php', {
        method: 'post',
        body: FD,
    })
}
