document.addEventListener('DOMContentLoaded', function() {
    var totalPlayers = 2;
    var currentPlayer = 1;
    var scores = { 1: 0, 2: 0 };
    var timeLeft = 20;
    var timerId;
    
    var timeLeftDisplay = document.getElementById('timeLeft');
    var scoreDisplays = {
        1: document.getElementById('score1'),
        2: document.getElementById('score2')
    };
    var messageDisplay = document.getElementById('messageDisplay');

    function shuffleCards() {
        var cardsContainer = document.querySelector('.cards-container');
        var cards = Array.prototype.slice.call(cardsContainer.children);
        while (cards.length) {
            cardsContainer.appendChild(cards.splice(Math.floor(Math.random() * cards.length), 1)[0]);
        }
    }

    function switchPlayer() {
        currentPlayer = currentPlayer % totalPlayers + 1;
        shuffleCards(); // Shuffle the cards on player switch
        resetTurn();
        startTimer();
        messageDisplay.textContent = "Player " + currentPlayer + "'s turn!";
    }

    function startTimer() {
        timeLeft = 20;
        timeLeftDisplay.textContent = timeLeft;
        
        clearInterval(timerId);
        timerId = setInterval(function() {
            timeLeft--;
            timeLeftDisplay.textContent = timeLeft;
            if (timeLeft === 0) {
                clearInterval(timerId);
                messageDisplay.textContent = "Time's up! Next player's turn.";
                setTimeout(switchPlayer, 2000);
            }
        }, 1000);
    }

    function resetTurn() {
        var cards = document.querySelectorAll('.card-inner');
        for (var i = 0; i < cards.length; i++) {
            cards[i].style.transform = 'rotateY(0deg)';
        }
        document.getElementById('placeGuess').value = '';
    }

    var cards = document.querySelectorAll('.card');
    for (var i = 0; i < cards.length; i++) {
        cards[i].addEventListener('click', function() {
            var alreadyFlipped = document.querySelector('.card-inner[style*="rotateY(180deg)"]');
            if (!alreadyFlipped) {
                this.querySelector('.card-inner').style.transform = 'rotateY(180deg)';
            }
        });
    }

    document.getElementById('guessButton').addEventListener('click', function() {
        var selectedCard = document.querySelector('.card-inner[style*="rotateY(180deg)"]');
        if (!selectedCard) {
            messageDisplay.textContent = "No card selected!";
            return;
        }

        var guessedPlace = document.getElementById('placeGuess').value;
        var correctPlace = selectedCard.parentNode.getAttribute('data-place');

        if (guessedPlace === correctPlace) {
            scores[currentPlayer]++;
            messageDisplay.textContent = "Correct! You get a point.";
        } else {
            messageDisplay.textContent = "Wrong! The correct place was " + correctPlace + ".";
        }

        scoreDisplays[currentPlayer].textContent = scores[currentPlayer];
        clearInterval(timerId);
        setTimeout(switchPlayer, 2000); // Shuffle will occur in this function
    });

    shuffleCards(); // Initial shuffle when the DOM is loaded
    startTimer();
});
