import { newUserId, randomIntFromInterval } from './utils.js'
import { fetchCSV, sendCartData, loadCartData } from './server.js'

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

export async function logIn(prevUser = null) {
    const currentUser =
        sessionStorage.getItem('currentUser') || (await randomLogIn(prevUser))
    const currentUserObj = JSON.parse(currentUser)

    const usernameDOM = document.querySelector('.username')
    usernameDOM.innerHTML = currentUserObj.username

    await loadCartData()
}

export async function logOut() {
    const usernameDOM = document.querySelector('.username')
    usernameDOM.classList.add('animated')
    setTimeout(() => usernameDOM.classList.remove('animated'), 500)

    const prevUser = sessionStorage.getItem('currentUser')
    await sendCartData()
    sessionStorage.removeItem('currentUser')
    await logIn(prevUser)
}
