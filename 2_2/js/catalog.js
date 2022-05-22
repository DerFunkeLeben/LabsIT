import { renderProductCard } from './render.js'

export class Catalog {
    static get() {
        const catalog = sessionStorage.getItem('productsData')
        return catalog ? JSON.parse(catalog) : null
    }
    static set(productsData) {
        sessionStorage.setItem('productsData', JSON.stringify(productsData))
    }

    static render() {
        const CATALOG = document.querySelector('#catalog')
        CATALOG.innerHTML = ''
        this.get().map((el) => CATALOG.appendChild(renderProductCard(el)))
    }
}
