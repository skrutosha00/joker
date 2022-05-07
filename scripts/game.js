import { setBalanceField, randElem, changeBalance, animateOnce } from './functions.js'

let [left, right] = [document.querySelector('.left'), document.querySelector('.right')]
let betCont = document.querySelector('.bet_amount')
let betType = document.querySelector('.bet_type')
let win = document.querySelector('.win')
let totalBet = document.querySelector('.total_bet')
let bank = document.querySelector('.bank')
let warning = document.querySelector('.warning')

let playerCards = document.querySelector('.cards.player')
let bankerCards = document.querySelector('.cards.banker')
let playerExtraCards = document.querySelector('.cards.player.extra')
let bankerExtraCards = document.querySelector('.cards.banker.extra')

let coins = [5, 10, 50, 100, 500, 1000]
let betTypes = { 'PLAYER': 3, 'BANKER': 3, 'TIE': 10 }
let bankCoins = { 5: 0, 10: 0, 50: 0, 100: 0, 500: 0, 1000: 0 }
let cards = [2, 3, 4, 5, 6, 7, 8, 9, 10, 'jack', 'queen', 'king', 'ace']

let cardsType = localStorage.getItem('chosen_joker')
let active = true
let outcome = false
let currentCoin = 5
let playerScore = 0
let bankerScore = 0

let coinRow = document.createElement('div')
coinRow.classList.add('coin_row')
coinRow.style.left = 0
for (let coin of coins) {
    let coinPic = document.createElement('img')
    coinPic.src = '../png/' + coin + '.png'
    coinRow.appendChild(coinPic)
}
betCont.appendChild(coinRow)

setBalanceField()
let balance = document.querySelector('.balance')

document.querySelector('.player').innerHTML = localStorage.getItem('name_joker')

left.onclick = () => {
    if (currentCoin == 5 || !active) { return }
    coinRow.style.left = Number(coinRow.style.left.replace('px', '')) + 33 + 'px'
    currentCoin = coins[coins.indexOf(currentCoin) - 1]
}

right.onclick = () => {
    if (currentCoin == 1000 || !active) { return }
    coinRow.style.left = Number(coinRow.style.left.replace('px', '')) - 33 + 'px'
    currentCoin = coins[coins.indexOf(currentCoin) + 1]
}

document.querySelector('.bet_type_cont').onclick = () => {
    if (!active) { return }

    let betTypesNames = Object.keys(betTypes)
    let index = betTypesNames.indexOf(betType.innerHTML)
    betType.innerHTML = index == 2 ? betTypesNames[0] : betTypesNames[index + 1]

    updateWin()
}

document.querySelector('.add').onclick = () => {
    if (Number(totalBet.innerHTML) + currentCoin > Number(balance.innerHTML) || bankCoins[currentCoin] == 8) { return }

    let coinPic = document.createElement('img')
    coinPic.classList.add('bank_coin')
    coinPic.src = '../png/' + currentCoin + '.png'

    coinPic.style.left = ((7 / 246) + (26.25 / 246) * coins.indexOf(currentCoin)) * 100 + '%'
    coinPic.style.top = ((8 / 122) + bankCoins[currentCoin] * (11 / 122)) * 100 + '%'

    bank.appendChild(coinPic)

    bankCoins[currentCoin] += 1
    totalBet.innerHTML = Number(totalBet.innerHTML) + currentCoin
    updateWin()
}

document.querySelector('.clear').onclick = () => {
    for (let coin of document.querySelectorAll('.bank_coin')) {
        bank.removeChild(coin)
    }

    for (let coin of coins) {
        bankCoins[coin] = 0
    }

    totalBet.innerHTML = 0
    updateWin()
}

document.querySelector('.play').onclick = () => {
    if (!active || totalBet.innerHTML == 0 || Number(totalBet.innerHTML) > Number(balance.innerHTML)) { return }
    active = false
    changeBalance(-Number(totalBet.innerHTML))

    generateCards()
    playerCards.style.left = '25%'
    bankerCards.style.right = '25%'

    if (playerScore >= 10) { playerScore -= 10 }
    if (bankerScore >= 10) { bankerScore -= 10 }

    if (playerScore < 5) {
        setTimeout(() => {
            generateCards('extra_player')
            playerExtraCards.style.left = '10%'
        }, 500);
    }

    if (bankerScore < 5) {
        setTimeout(() => {
            generateCards('extra_banker')
            bankerExtraCards.style.right = '10%'
        }, 500);
    }

    setTimeout(() => {
        if (playerScore >= 10) { playerScore -= 10 }
        if (bankerScore >= 10) { bankerScore -= 10 }

        if (
            betType.innerHTML == 'TIE' && playerScore == bankerScore ||
            betType.innerHTML == 'PLAYER' && playerScore > bankerScore ||
            betType.innerHTML == 'BANKER' && playerScore < bankerScore
        ) {
            changeBalance(Number(totalBet.innerHTML) * betTypes[betType.innerHTML])
            animateOnce('.balance')
            outcome = true
        }

        document.querySelector('.warning .text').innerHTML = (outcome ? 'Congrats!<br/>' : 'No luck this time<br/>') + 'Your score is ' + playerScore + '<br/>' + "Banker's score is " + bankerScore
        warning.style.top = 0
    }, 1200);
}

document.querySelector('.warning .button').onclick = () => {
    playerCards.style.left = '-200px'
    bankerCards.style.right = '-200px'
    playerExtraCards.style.left = '-200px'
    bankerExtraCards.style.right = '-200px'
    
    warning.style.top = '-70px'

    setTimeout(() => {
        playerScore = 0
        bankerScore = 0
        active = true
        outcome = false

        for (let cardCont of [playerCards, bankerCards, playerExtraCards, bankerExtraCards]) {
            cardCont.innerHTML = ''
        }
    }, 300);
}

document.querySelector('.rules .button').onclick = () => {
    document.querySelector('.rules').style.left = '-100%'
}

function generateCards(mode) {
    let cardOwners

    if (!mode) { cardOwners = ['player', 'player', 'banker', 'banker'] }
    else if (mode == 'extra_player') { cardOwners = ['extra_player'] }
    else if (mode == 'extra_banker') { cardOwners = ['extra_banker'] }

    for (let cardOwner of cardOwners) {
        let cardValue = randElem(cards)

        let card = document.createElement('img')
        card.src = '../png/cards/' + cardValue + '_' + cardsType + '.png'

        if (cardOwner == 'player') {
            playerScore += getScore(cardValue)
            playerCards.appendChild(card)
        } else if (cardOwner == 'banker') {
            bankerScore += getScore(cardValue)
            bankerCards.appendChild(card)
        } else if (cardOwner == 'extra_player') {
            playerScore += getScore(cardValue)
            playerExtraCards.appendChild(card)
        } else if (cardOwner == 'extra_banker') {
            bankerScore += getScore(cardValue)
            bankerExtraCards.appendChild(card)
        }
    }
}

function getScore(cardValue) {
    if (cardValue == 'ace') { return 1 } else
        if (cardValue == 10 || !isFinite(cardValue)) { return 0 } else
            if (isFinite(cardValue)) { return cardValue }
}

function updateWin() {
    win.innerHTML = Number(totalBet.innerHTML) * betTypes[betType.innerHTML]
}
