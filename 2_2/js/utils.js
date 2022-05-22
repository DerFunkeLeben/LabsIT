import { Catalog } from './catalog.js'

export function getId(el) {
    return el.parentElement.parentElement.dataset['id']
}

export function findProductById(id) {
    let productsData = Catalog.get()
    const [product] = productsData.filter((el) => el.id == id)
    return product
}

export function newUserId(prevUserId) {
    return (1 + parseInt(prevUserId)) % 6 || 1
}

export function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

export function CSVtoJSON(csv) {
    let [headers, ...arr] = csv.toString().replaceAll('\n', '').split('\r')

    let result = []
    headers = headers.split(',')

    result = arr.map((user) => {
        const fields = user.split(',')
        const obj = {}
        fields.map((field, index) => (obj[headers[index]] = field))
        return obj
    })

    return result
}

export function JSONtoCSV(json) {
    if (!json.length) return 'id,amount'

    const header = Object.keys(json[0]).join(',')

    const result = json.reduce(
        (acc, item) => (acc += '\n' + [item.id, item.amount].join(',')),
        header
    )

    return result
}
