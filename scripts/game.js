let bigGuy = document.querySelector('.game__cards');
let body = document.querySelector('.game');

let newDeck = [];
let flippedCards = [];
let flippedCardsUrl = [];

let matches = 0;
let clickCount = 0;


axios.get('https://api.thecatapi.com/v1/images/search?limit=6')
    .then( response => {
        populateDeck(response.data);
    })
    .catch( response => {
        if( response === undefined ) {
            location.reload();
        }
    })


function populateDeck(deck) {
    for(let i = 0; i < 6; i++ ) {
        newDeck.push(deck[i].url);
        newDeck.push(deck[i].url);
    }
    
    newGame();
}

function newGame() {
    flippedCards = [];
    shuffleCards();
    makeDeck();
}

function shuffleCards() {

    for( let i = newDeck.length-1; i > 0; i-- ){
        let j = Math.floor(Math.random() * (i + 1) );
        let temp = newDeck[i];
        newDeck[i] = newDeck[j];
        newDeck[j] = temp;
    }

}

function makeDeck() {

    for( let i = 0; i < 12; i++ ) {
        
        let card = document.createElement('li');
        card.classList.add('game__card');

        let cardBack = document.createElement('div');
        cardBack.classList.add('game__card-back');
        card.appendChild(cardBack);

        let catPicBack = document.createElement('img');
        catPicBack.classList.add('game__card-back-img');
        catPicBack.setAttribute('src', '../assets/images/paw copy.png');
        cardBack.appendChild(catPicBack);

        let cardFront = document.createElement('div');
        cardFront.classList.add('game__card-front');
        card.appendChild(cardFront);

        let catPic = document.createElement('img');
        catPic.classList.add('game__card-front-img');
        cardFront.appendChild(catPic);
        catPic.setAttribute('src', newDeck[i]);

        card.addEventListener('click', () => {
            cardSelect(card, newDeck[i]);
        });

        bigGuy.appendChild(card);

    }
}

function cardSelect(curCard, cardUrl) {

    if(flippedCards.length < 2) {
        updateClickCount();
        clickCount++;
        curCard.classList.add('flip');
        flippedCards.push(curCard);
        flippedCardsUrl.push(cardUrl);

        if( flippedCards.length === 2 ) {
            compare();
        }
    }
}

function updateClickCount() {
    let cCount = document.querySelector('.game__click-count');
    cCount.innerText = 'click count: ' + (clickCount + 1);
}

function compare() {
    if( flippedCards.length === 2 && flippedCardsUrl[0] != flippedCardsUrl[1] ) {
        flipCard();
        flippedCards = [];
        flippedCardsUrl = [];
    }
    else {
        matches++;
        flippedCards.forEach( car => {
            car.removeEventListener('click', () => {
                //do something
            })
        });
        flippedCards = [];
        flippedCardsUrl = [];
        if( matches === 6 ) {

            let overlay = document.createElement('div');
            overlay.classList.add('overlay');
            body.appendChild(overlay);

            let winningMessage = document.createElement('h2');
            winningMessage.classList.add('overlay__message');
            overlay.appendChild(winningMessage);
            winningMessage.innerText = 'YOU WON!!';

            let clickCountMessage = document.createElement('p');
            clickCountMessage.classList.add('overlay__click-message');
            winningMessage.appendChild(clickCountMessage);
            clickCountMessage.innerText =  `You finished in ${clickCount} clicks! Meow meow!`;

            setTimeout( () => {
                let aTag = document.createElement('a');
                aTag.setAttribute('href', '../index.html');
                winningMessage.appendChild(aTag);

                let homeButton = document.createElement('button');
                homeButton.classList.add('overlay__button');
                aTag.appendChild(homeButton);
                homeButton.innerText = 'HOME';
            }, 2000);
        }
    }
}

function flipCard() {
    flippedCards.forEach( car => {
        setTimeout( () => {
            car.classList.remove('flip');
        }, 900);
    })
}

function resetGame() {
    bigGuy.innerHTML = '';
    newGame();
}