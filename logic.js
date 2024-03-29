document.addEventListener('DOMContentLoaded', () => {
    let currentCatIndex = 0;
    let cats = [];
    let attempts = 5;

    fetch('cats.json')
        .then(response => response.json())
        .then(data => {
            cats = data;
            populateCatSuggestions(cats);
            startNewGame();
        })
        .catch(error => console.error('Error loading cat data:', error));

    function populateCatSuggestions(cats) {
        const dataList = document.getElementById('catList');
        dataList.innerHTML = '';
        cats.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.name;
            dataList.appendChild(option);
        });
    }

    function startNewGame() {
        if (currentCatIndex >= cats.length) {
            currentCatIndex = 0;
        }
        const currentCat = cats[currentCatIndex];
        displayNextCat(currentCat);
        attempts = 5;
        updateAttemptsDisplay();
        hidePlayAgainButton();
        clearGuessInput();
    }

    function displayNextCat(cat) {
        const catInfoDiv = document.querySelector('.cat-info');
        catInfoDiv.innerHTML = `<div class="attribute"><h2>Cat Breed</h2><p id="catBreedName">&nbsp;</p></div>`;

        for (const key of Object.keys(cat.attributes)) {
            const sanitizedKey = key.replace(/\s+/g, '_');
            catInfoDiv.innerHTML += `<div class="attribute"><h2>${key}</h2><p id="${sanitizedKey}">&nbsp;</p></div>`;
        }
        
        displayTestingBreed(cat.name); // For testing purposes
    }

    function updateAttemptsDisplay() {
        const attemptsDiv = document.getElementById('attempts');
        attemptsDiv.textContent = `Attempts: ${attempts}`;
    }

    window.checkGuess = () => {
        const guessInput = document.getElementById('catGuess');
        const userGuess = guessInput.value.trim();
        const currentCat = cats[currentCatIndex];

        if (userGuess === currentCat.name) {
            alert('Correct! You win!!!');
            revealAttributes();
            showPlayAgainButton();
        } else {
            attempts--;
            updateAttemptsDisplay();
            if (attempts > 0) {
                alert(`Incorrect, ${attempts} attempts left.`);
            } else {
                alert('Incorrect. No attempts left. You lose!');
                revealAttributes();
                showPlayAgainButton();
            }
        }

        clearGuessInput();
    };

    function revealAttributes() {
        const currentCat = cats[currentCatIndex];
    
        // Reveal the cat breed name
        document.getElementById('catBreedName').textContent = currentCat.name;
    
        // Reveal other attributes
        for (const [key, value] of Object.entries(currentCat.attributes)) {
            const sanitizedKey = key.replace(/\s+/g, '_');
            const attributeDiv = document.getElementById(sanitizedKey);
            if (attributeDiv) {
                attributeDiv.querySelector('p').textContent = value;
            }
        }
    }

    function showPlayAgainButton() {
        const playAgainButton = document.getElementById('playAgainButton') || document.createElement('button');
        playAgainButton.id = 'playAgainButton';
        playAgainButton.textContent = 'Play Again';
        playAgainButton.onclick = () => {
            currentCatIndex++;
            startNewGame();
        };

        document.querySelector('.guess-container').appendChild(playAgainButton);
    }

    function hidePlayAgainButton() {
        const playAgainButton = document.getElementById('playAgainButton');
        if (playAgainButton) {
            playAgainButton.remove();
        }
    }

    function displayTestingBreed(breedName) {
        let testingDiv = document.getElementById('testingBreed');
        if (!testingDiv) {
            testingDiv = document.createElement('div');
            testingDiv.id = 'testingBreed';
            document.body.appendChild(testingDiv);
        }
        testingDiv.textContent = `Testing: ${breedName}`;
    }

    function clearGuessInput() {
        document.getElementById('catGuess').value = '';
    }
});
