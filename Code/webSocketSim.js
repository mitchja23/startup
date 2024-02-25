
function getRandomText() {
    const options = ["cook", "clean", "homework"];
    const randomIndex = Math.floor(Math.random() * options.length);
    return options[randomIndex];
}

function createNewBox() {
    const prizeContainer = document.querySelector('.prize-container');
    const newBox = document.createElement('div');
    newBox.classList.add('box', 'corner');
    const randomText = getRandomText();
    newBox.textContent = `User just finished their goal "${randomText}"`;
    prizeContainer.appendChild(newBox);
}

setInterval(createNewBox, 5000);
