import { ACTIONS, ICON_CLASS } from './constants.js'

function renderDiv(classList, parent, dataset, text) {
    const el = document.createElement('div')
    el.className = classList
    el.innerHTML = text ?? ''
    dataset && (el.dataset['action'] = dataset)
    parent && parent.appendChild(el)
    return el
}

export function renderProductCard(cardObj) {
    let cartItems = JSON.parse(sessionStorage.getItem('cartItems'))
    const [cartItem] = cartItems.filter((el) => el.id == cardObj.id)

    const mainIcon = {
        class: cartItem ? ICON_CLASS.OPEN_POPUP : ICON_CLASS.TO_CART,
        dataset: cartItem ? ACTIONS.OPEN_POPUP : ACTIONS.TO_CART,
    }
    const productWrapper = renderDiv('product-wrapper')
    const productLogo = renderDiv('product-logo', productWrapper)
    const productInfo = renderDiv('product-info', productWrapper)
    renderDiv(
        `product-icon ${mainIcon.class} shown`,
        productInfo,
        mainIcon.dataset
    )
    renderDiv('product-icon i-plus pop-icon', productInfo, ACTIONS.ADD_ITEM)
    renderDiv('product-icon i-minus pop-icon', productInfo, ACTIONS.SUB_ITEM)
    renderDiv(
        'product-icon i-delete pop-icon',
        productInfo,
        ACTIONS.DELETE_ITEM
    )
    renderDiv('product-cost', productInfo, null, cardObj.cost + '$')

    productLogo.style.backgroundImage = `url(${cardObj.logo})`
    productWrapper.dataset['id'] = cardObj.id
    return productWrapper
}

export function renderCartHeader() {
    const cartHeader = renderDiv('cart-header-wrapper')

    renderDiv('cart-item-num', cartHeader, null, '№')
    renderDiv('cart-item-title', cartHeader, null, 'Product')
    renderDiv('cart-item-ammount', cartHeader, null, 'Am.')
    renderDiv('cart-item-cost', cartHeader, null, 'Cost')
    renderDiv('cart-item-all-cost', cartHeader, null, 'Total')

    return cartHeader
}

export function renderCartFooter() {
    const cartFooter = renderDiv('cart-footer-wrapper')

    const totalCartCost = sessionStorage.getItem('totalCartCost')

    renderDiv('cart-result-caption', cartFooter, null, 'TOTAL: ')
    renderDiv('cart-result-summ', cartFooter, null, totalCartCost + '$')

    return cartFooter
}

export function renderCartItem(cartObj, index) {
    const cartWrapper = renderDiv('cart-item-wrapper')

    const totalCost = parseInt(cartObj.cost) * parseInt(cartObj.amount)

    let totalCartCost = parseInt(sessionStorage.getItem('totalCartCost'))
    totalCartCost += totalCost
    sessionStorage.setItem('totalCartCost', totalCartCost)

    renderDiv('cart-item-num', cartWrapper, null, index + 1)
    renderDiv('cart-item-title', cartWrapper, null, cartObj.name)
    renderDiv('cart-item-ammount', cartWrapper, null, cartObj.amount)
    renderDiv('cart-item-cost', cartWrapper, null, cartObj.cost + '$')
    renderDiv('cart-item-all-cost', cartWrapper, null, totalCost + '$')

    return cartWrapper
}
