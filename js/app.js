const display = document.querySelector('.display')
const symbolBtns = document.querySelectorAll('.btn--symbol')
const operatorBtns = document.querySelectorAll('.btn--operator')

// Special Buttons
const clearBtn = document.querySelector('.btn--special[data-func="clear"]')
const backBtn = document.querySelector('.btn--special[data-func="backspace"]')
const negateBtn = document.querySelector('.btn--special[data-func="negate"]')

const add = (a, b) => a + b
const subtract = (a, b) => a - b
const multiply = (a, b) => a * b
const divide = (a, b) => (b == 0 ? 'Error!' : a / b)
const negate = (num) => -num

const activeClass = 'btn--operator--active'

let updated = true
let previousNum = 0
let currentFunction = null

function getCurrentNum() {
  let currentText = display.textContent

  if (currentText == 'Error!') return 0
  if (currentText.includes(',')) currentText = currentText.replace(',', '.')

  return +currentText
}

function clearOperators() {
  currentFunction = null

  for (let btn of operatorBtns) {
    if (btn.classList.contains(activeClass)) {
      btn.classList.remove(activeClass)
    }
  }
  updated = true
}

function clear() {
  clearOperators()
  previousNum = 0

  display.textContent = previousNum
}

function runFunc(a, b) {
  switch (currentFunction) {
    case 'add':
      return add(a, b)
    case 'subtract':
      return subtract(a, b)
    case 'multiply':
      return multiply(a, b)
    case 'divide':
      return divide(a, b)
    default:
      return null
  }
}

function addClickAnimation(node) {
  let className = null

  if (node.classList.contains('btn--special')) {
    className = 'btn--special--active'
  } else if (node.classList.contains('btn--symbol')) {
    className = 'btn--symbol--active'
  }
  if (className == null) return

  node.addEventListener('click', () => {
    if (!node.classList.contains(className)) {
      node.classList.add(className)
    }
  })

  node.addEventListener('transitionend', () => {
    if (node.classList.contains(className)) {
      node.classList.remove(className)
    }
  })
}

function animateError() {
  const container = document.querySelector('.container')

  container.classList.add('container--animate')
  setTimeout(() => {
    container.classList.remove('container--animate')
  }, 200)
}

operatorBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    const attr = btn.getAttribute('data-func')

    if (attr == 'equals') {
      if (currentFunction != null) {
        const func = runFunc(previousNum, getCurrentNum())
        if (func != null) {
          if (func % 1 != 0 && func != 'Error!') {
            const text = (Math.round((func + Number.EPSILON) * 100) / 100)
              .toString()
              .replace('.', ',')

            if (text.length > 7) {
              animateError()
              return
            }
            display.textContent = text
          } else {
            if (func.toString().length > 7) {
              animateError()
              return
            }
            display.textContent = func
          }

          previousNum = func
        }
        clearOperators()
      }
    } else {
      clearOperators()
      btn.classList.add(activeClass)

      previousNum = getCurrentNum()
      currentFunction = attr
    }
  })
})

symbolBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    const currentText = display.textContent
    if (!updated && currentText.length > 7) {
      animateError()
      return
    }

    const btnValue = btn.textContent.trim()
    if (updated || currentText == 0 || currentText == 'Error!') {
      display.textContent = btnValue != ',' ? btnValue : '0,'
      updated = false
      return
    }

    if (
      btnValue == ',' &&
      (currentText.includes(',') || currentText.length < 1)
    )
      return
    display.textContent += btnValue
    updated = false
  })
  addClickAnimation(btn)
})

clearBtn.addEventListener('click', clear)
addClickAnimation(clearBtn)

backBtn.addEventListener('click', () => {
  const currentText = display.textContent

  if (currentText == 0) return
  if (currentText.length == 1) {
    display.textContent = 0
    return
  }

  display.textContent = currentText.substring(0, currentText.length - 1)
})
addClickAnimation(backBtn)

negateBtn.addEventListener('click', () => {
  const currentText = display.textContent
  if (currentText == 0) return

  display.textContent = negate(getCurrentNum())
})
addClickAnimation(negateBtn)

window.addEventListener('keydown', (e) => {
  const btn = document.querySelector(`.btn[data-key="${e.key}"]`)
  if (btn) btn.click()
})
