import { ACTIONS, ICON_CLASS, CART_EMPTY } from './constants.js'
import { fetchCSV, sendCartData } from './server.js'
import { getId, newUserId, randomIntFromInterval } from './utils.js'
import {
    renderCartHeader,
    renderCartItem,
    renderCartFooter,
    renderProductCard,
} from './render.js'

document.addEventListener('click', async (e) => {
    const { action } = e.target.dataset
    if (!action) return

    action == ACTIONS.TO_CART && addToCart(e.target)
    action == ACTIONS.ADD_ITEM && actionPlusOne(e.target)
    action == ACTIONS.SUB_ITEM && actionMinusOne(e.target)
    action == ACTIONS.DELETE_ITEM && actionDelete(e.target)
    const noResend = action == ACTIONS.LOGOUT && logOut()
    const noRerender = action == ACTIONS.OPEN_POPUP && openPopup(e.target)

    if (noRerender) return
    if (!noResend) await sendCartData(cartItems)
    renderCart()
})

const CATALOG = document.querySelector('#catalog')
const CART = document.querySelector('#cart')
const usernameDOM = document.querySelector('.username')

let DATA = []
let cartItems = []

function findProductById(id, amount) {
    const [item] = DATA.filter((el) => el.id == id)
    const cartItem = {
        id: item.id,
        amount,
    }
    return cartItem
}

function addToCart(el) {
    el.classList.add(ICON_CLASS.OPEN_POPUP)
    el.classList.remove(ICON_CLASS.TO_CART)
    el.dataset['action'] = ACTIONS.OPEN_POPUP

    const id = getId(el)
    cartItems.push(findProductById(id, 1))
}

function removeFromCart(el) {
    el.classList.remove(ICON_CLASS.OPEN_POPUP)
    el.classList.add(ICON_CLASS.TO_CART)
    el.dataset['action'] = ACTIONS.TO_CART

    const id = getId(el)
    cartItems = cartItems.filter((el) => el.id != id) || []
}

function openPopup(el) {
    ;[].forEach.call(el.parentElement.children, (icon) => {
        icon.classList.contains('pop-icon') && icon.classList.toggle('shown')
    })
    return true
}

function actionPlusOne(el) {
    const id = getId(el)
    cartItems = cartItems.map((el) =>
        el.id == id ? { ...el, amount: parseInt(el.amount) + 1 } : el
    )
}

function actionMinusOne(elDOM) {
    const id = getId(elDOM)
    cartItems = cartItems
        .map((el) =>
            el.id == id
                ? el.amount > 1
                    ? { ...el, amount: parseInt(el.amount) - 1 }
                    : actionDelete(elDOM)
                : el
        )
        .filter((el) => el)
}

function actionDelete(el) {
    ;[].forEach.call(el.parentElement.children, (icon) => {
        icon.classList.contains('pop-icon') && icon.classList.remove('shown')
        icon.classList.contains(ICON_CLASS.OPEN_POPUP) && removeFromCart(icon)
    })
}

async function randomLogIn(prevUser = null) {
    const prevUserId = prevUser ? JSON.parse(prevUser).id : -1

    const currentUserId = prevUser
        ? newUserId(prevUserId)
        : randomIntFromInterval(1, 5)

    const users = await fetchCSV('data/users.csv')
    const [currentUser] = users.filter((el) => el.id == currentUserId)

    const currentUserStr = JSON.stringify(currentUser)
    sessionStorage.setItem('currentUser', currentUserStr)
    return currentUserStr
}

async function logIn(prevUser = null) {
    const currentUser =
        sessionStorage.getItem('currentUser') || (await randomLogIn(prevUser))
    const currentUserObj = JSON.parse(currentUser)

    usernameDOM.innerHTML = currentUserObj.username

    await loadCartData()
    renderCatalog()
}

async function logOut() {
    usernameDOM.classList.add('animated')
    setTimeout(() => usernameDOM.classList.remove('animated'), 500)

    const prevUser = sessionStorage.getItem('currentUser')
    await sendCartData(cartItems)
    sessionStorage.removeItem('currentUser')
    logIn(prevUser)

    return true
}

function renderCatalog() {
    CATALOG.innerHTML = ''
    DATA.map((el) => CATALOG.appendChild(renderProductCard(cartItems, el)))
}

function renderCart() {
    if (!cartItems.length) return (CART.innerHTML = CART_EMPTY)

    CART.innerHTML = ''
    sessionStorage.setItem('totalCartCost', 0)
    CART.appendChild(renderCartHeader())

    cartItems.map(({ id, amount }, i) => {
        const [{ cost, name }] = DATA.filter((el) => id == el.id)
        const cartObj = {
            id,
            cost,
            name,
            amount: parseInt(amount),
        }
        CART.appendChild(renderCartItem(cartObj, i))
    })

    CART.appendChild(renderCartFooter())
}

async function loadProductsData() {
    let productsData = sessionStorage.getItem('productsData')

    if (productsData) {
        console.log('products data loaded from session storage')
        productsData = JSON.parse(productsData)
    } else {
        console.log('fetching products data from server')
        productsData = await fetchCSV('data/products.csv')
        sessionStorage.setItem('productsData', JSON.stringify(productsData))
    }

    DATA = productsData
}

async function loadCartData() {
    const currUser = sessionStorage.getItem('currentUser')
    const cartId = JSON.parse(currUser).cartId
    const cartData = await fetchCSV(`data/carts/cart${cartId}.csv`)
    cartItems = cartData
    renderCart()
}

loadProductsData()
logIn()
