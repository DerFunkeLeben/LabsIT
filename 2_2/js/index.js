import { sendCartData, loadProductsData } from './server.js'
import { logIn, logOut } from './auth.js'
import { Catalog } from './catalog.js'
import { Cart } from './cart.js'
import { ACTIONS } from './constants.js'

document.addEventListener('click', async (e) => {
    const { action } = e.target.dataset
    if (!action) return

    action == ACTIONS.TO_CART && Cart.addToCart(e.target)
    action == ACTIONS.ADD_ITEM && Cart.actionPlusOne(e.target)
    action == ACTIONS.SUB_ITEM && Cart.actionMinusOne(e.target)
    action == ACTIONS.DELETE_ITEM && Cart.actionDelete(e.target)
    
    if (action == ACTIONS.LOGOUT) {
        await logOut()
        Cart.render()
        Catalog.render()
        return
    }
    if (action == ACTIONS.OPEN_POPUP) return openPopup(e.target)

    await sendCartData()
    Cart.render()
})

function openPopup(el) {
    ;[].forEach.call(el.parentElement.children, (icon) => {
        icon.classList.contains('pop-icon') && icon.classList.toggle('shown')
    })
}

;(async () => {
    loadProductsData()
    await logIn()
    Cart.render()
    Catalog.render()
})()
