const dragItem = document.querySelector('.table')
var calcWrapper = document.querySelector('.calc-wrapper')
var inputArea = calcWrapper.querySelector('.inputArea')

var active = false
let clickTime
var currentX
var currentY
var initialX
var initialY
var xOffset = 0
var yOffset = 0
const initCoord = 300
const { width, height } = dragItem.getBoundingClientRect()
const maxX = window.innerWidth - width - initCoord
const maxY = window.innerHeight - height - initCoord
const calc = {
    td: null,
    operation: '',
    op1: '',
    op2: '',
    func: {
        sum: (a, b) => Number(a) + Number(b),
        dif: (a, b) => Number(a) - Number(b),
    },
}

dragItem.addEventListener('click', openCalc)
dragItem.addEventListener('mousedown', dragStart)
dragItem.addEventListener('mouseup', dragEnd)
dragItem.addEventListener('mousemove', drag)
calcWrapper.addEventListener('click', handleCalc)

function dragStart(e) {
    clickTime = new Date()

    initialX = e.clientX - xOffset
    initialY = e.clientY - yOffset
    active = e.currentTarget === dragItem ? true : false
}

function dragEnd(e) {
    e.stopPropagation()

    initialX = currentX
    initialY = currentY
    active = false
}

function drag(e) {
    if (active) {
        e.preventDefault()

        currentX = e.clientX - initialX
        currentY = e.clientY - initialY

        if (currentX < -initCoord) currentX = -initCoord
        if (currentY < -initCoord) currentY = -initCoord
        if (currentX > maxX) currentX = maxX
        if (currentY > maxY) currentY = maxY

        xOffset = currentX
        yOffset = currentY

        setTranslate(currentX, currentY, dragItem)
    }
}

function setTranslate(xPos, yPos, el) {
    el.style.transform = 'translate3d(' + xPos + 'px, ' + yPos + 'px, 0)'
}

function openCalc(e) {
    if (new Date() - clickTime > 150) return

    if (e.target.nodeName === 'TD') {
        calcWrapper.classList.add('shown')
        const currValue = e.target.textContent
        inputArea.innerHTML = currValue
        calc.td = e.target
    }
}

function handleCalc(e) {
    const { state } = e.target.dataset
    switch (state) {
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
        case '0':
            inputArea.innerHTML += state
            break
        case 'C':
            inputArea.innerHTML = ''
            break
        case '+':
            calc.operation = 'sum'
            calc.op1 = inputArea.textContent
            inputArea.innerHTML = ''
            break
        case '-':
            calc.operation = 'dif'
            calc.op1 = inputArea.textContent
            inputArea.innerHTML = ''
            break
        case '=':
            if (!calc.operation) return
            calc.op2 = inputArea.textContent
            const res = calc.func[calc.operation](calc.op1, calc.op2)
            inputArea.innerHTML = res
            break

        case 'close':
            calcWrapper.classList.remove('shown')
            calc.td.innerHTML = inputArea.textContent
            break
        default:
            console.log(`Default`)
    }
}
