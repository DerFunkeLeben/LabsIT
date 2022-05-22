import { ACTIONS, ICON_CLASS, CART_EMPTY } from './constants.js'
import { getId, findProductById } from './utils.js'
import { renderCartHeader, renderCartFooter, renderCartItem } from './render.js'

export class Cart {
    static get() {
        return JSON.parse(sessionStorage.getItem('cartItems'))
    }
    static set(cartItems) {
        sessionStorage.setItem('cartItems', JSON.stringify(cartItems))
    }

    static addToCart(el) {
        el.classList.add(ICON_CLASS.OPEN_POPUP)
        el.classList.remove(ICON_CLASS.TO_CART)
        el.dataset['action'] = ACTIONS.OPEN_POPUP

        const id = getId(el)
        const product = findProductById(id)

        let cartItems = this.get()
        cartItems.push({ id: product.id, amount: 1 })
        this.set(cartItems)
    }

    static removeFromCart(el) {
        el.classList.remove(ICON_CLASS.OPEN_POPUP)
        el.classList.add(ICON_CLASS.TO_CART)
        el.dataset['action'] = ACTIONS.TO_CART

        const id = getId(el)

        let cartItems = this.get()
        cartItems = cartItems.filter((el) => el.id != id) || []
        this.set(cartItems)
    }

    static actionPlusOne(el) {
        const id = getId(el)

        let cartItems = this.get()
        cartItems = cartItems.map((el) =>
            el.id == id ? { ...el, amount: parseInt(el.amount) + 1 } : el
        )
        this.set(cartItems)
    }

    static actionMinusOne(elDOM) {
        const id = getId(elDOM)
        let cartItems = this.get()
        cartItems = cartItems
            .map((el) =>
                el.id == id
                    ? el.amount > 1
                        ? { ...el, amount: parseInt(el.amount) - 1 }
                        : this.actionDelete(elDOM)
                    : el
            )
            .filter((el) => el)

        this.set(cartItems)
    }

    static actionDelete(el) {
        ;[].forEach.call(el.parentElement.children, (icon) => {
            icon.classList.contains('pop-icon') &&
                icon.classList.remove('shown')
            icon.classList.contains(ICON_CLASS.OPEN_POPUP) &&
                this.removeFromCart(icon)
        })
    }

    static render() {
        const CART = document.querySelector('#cart')

        let cartItems = this.get()

        if (!cartItems.length) return (CART.innerHTML = CART_EMPTY)

        CART.innerHTML = ''
        sessionStorage.setItem('totalCartCost', 0)
        CART.appendChild(renderCartHeader())

        cartItems.map(({ id, amount }, i) => {
            const { cost, name } = findProductById(id)
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
}
