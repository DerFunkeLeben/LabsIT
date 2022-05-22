import { CSVtoJSON, JSONtoCSV } from './utils.js'
import { Catalog } from './catalog.js'
import { Cart } from './cart.js'

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

export async function sendCartData() {
    let cartItems = JSON.parse(sessionStorage.getItem('cartItems'))

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

export async function loadProductsData() {
    let productsData = Catalog.get()

    if (productsData) {
        console.log('products data loaded from session storage')
    } else {
        console.log('fetching products data from server')
        productsData = await fetchCSV('data/products.csv')
    }

    Catalog.set(productsData)
}

export async function loadCartData() {
    const currUser = sessionStorage.getItem('currentUser')
    const cartId = JSON.parse(currUser).cartId
    const cartData = await fetchCSV(`data/carts/cart${cartId}.csv`)
    Cart.set(cartData)
}
