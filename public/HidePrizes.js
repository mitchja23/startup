document.addEventListener('DOMContentLoaded', function() {
    const searchButton = document.querySelector('.searchButton');
    searchButton.addEventListener('click', function() {
        const searchTerm = document.querySelector('.searchTerm').value.trim().toLowerCase();
        if (searchTerm === 'mitchja') {
            window.location.href = 'mitchja.html';
        }
    });
    
    function getUserName() {
        return localStorage.getItem('userName');
    }

    const playerNameEl = document.querySelector('.user-name');
    playerNameEl.textContent = getUserName();

    function hideAllPrizeItems() {
        const prizeItems = document.querySelectorAll('.prize-item');
        prizeItems.forEach(item => {
            item.style.display = 'none';
        });
    }

    hideAllPrizeItems();

    function showSoldItems() {
        let soldItems = JSON.parse(localStorage.getItem('soldItems')) || [];
        soldItems.forEach(function(itemId) {
            let item = document.querySelector('.prize-item[data-item-id="' + itemId + '"]');
            if (item) {
                item.style.display = 'table-cell';
            }
        });
    }

    showSoldItems();
});