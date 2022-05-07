import { setBalanceField, changeBalance, animateOnce } from "./functions.js";

if (!localStorage.getItem('balance_joker')) {
    localStorage.setItem('balance_joker', 1000)
}

if (!localStorage.getItem('chosen_joker')) {
    localStorage.setItem('chosen_joker', 'thin')
}

setBalanceField()

let items = [
    { name: "thin", price: 0 },
    { name: "pink", price: 15000 },
    { name: "wide", price: 25000 }
]

let balance = document.querySelector('.balance')
let cardCont = document.querySelector('.card_cont')

for (let item of items) {
    let card = document.createElement('div')
    card.classList.add('card')

    let pic = document.createElement('div')
    pic.classList.add('block', 'shop')

    let innerPic1 = document.createElement('img')
    let innerPic2 = document.createElement('img')
    innerPic1.src = '../png/cards/queen_' + item.name + '.png'
    innerPic2.src = '../png/cards/ace_' + item.name + '.png'
    pic.appendChild(innerPic1)
    pic.appendChild(innerPic2)

    card.appendChild(pic)

    let buyButton = document.createElement('div')
    buyButton.classList.add('shop_button')
    buyButton.dataset.item = item.name

    if (localStorage.getItem(item.name + '_joker') == 1 || !item.price) {
        buyButton.innerHTML = 'SELECT'
        buyButton.classList.add('select')
    } else {
        buyButton.innerHTML = 'BUY ' + item.price
        buyButton.classList.add('buy')
    }

    card.appendChild(buyButton)

    buyButton.onclick = () => {
        if (buyButton.innerHTML != 'SELECT') {
            if (Number(balance.innerHTML) <= item.price) {
                buyButton.style.color = 'red'
                setTimeout(() => {
                    buyButton.style.color = 'white'
                }, 500);
                return
            }
            changeBalance(-Number(item.price))

            buyButton.innerHTML = 'SELECT'
            buyButton.classList.remove('buy')
            buyButton.classList.add('select')
            localStorage.setItem('chosen_joker', item.name)

            localStorage.setItem(buyButton.dataset.item + '_joker', 1)
        } else {
            localStorage.setItem('chosen_joker', item.name)
        }
    }
    cardCont.appendChild(card)
}

appendButton()

let input = document.querySelector('input')
input.value = localStorage.getItem('name_joker') ?? ''
input.onblur = () => {
    localStorage.setItem('name_joker', input.value)
}

function appendButton() {
    let link = document.createElement('a')
    link.href = './game.html'

    let button = document.createElement('div')
    button.classList.add('button')
    button.innerHTML = 'PLAY GAME'

    link.appendChild(button)
    cardCont.appendChild(link)
}