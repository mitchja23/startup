document.addEventListener('DOMContentLoaded', function () {
    function markItemAsSold(button) {
        button.style.backgroundColor = '#FAA0A0';
        button.style.color = '#f53d3d';
        button.style.borderColor = '#f76e6e';
        button.value = 'Sold';
        button.disabled = true;
    }

    let buyButtons = document.querySelectorAll('.prize-item input[type="button"]');

    buyButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            let itemId = button.parentNode.dataset.itemId;
            let itemPrice = parseInt(button.parentNode.querySelector('p').textContent); 
            let coinCount = parseInt(document.getElementById('coinCount').querySelector('span').textContent);

 
            if (coinCount >= itemPrice) {

                coinCount -= itemPrice;
                document.getElementById('coinCount').querySelector('span').textContent = coinCount;


                markItemAsSold(button);

                localStorage.setItem('coinCount', coinCount);


                let soldItems = JSON.parse(localStorage.getItem('soldItems')) || [];
                soldItems.push(itemId);
                localStorage.setItem('soldItems', JSON.stringify(soldItems));

    
                let purchasedItem = document.querySelector('.prize-item[data-item-id="' + itemId + '"]');
                if (purchasedItem) {
                    purchasedItem.classList.add('purchased');
                }
            } 
        });
    });

    let soldItems = JSON.parse(localStorage.getItem('soldItems')) || [];
    soldItems.forEach(function (itemId) {
        let item = document.querySelector('.prize-item[data-item-id="' + itemId + '"]');
        if (item) {
            markItemAsSold(item.querySelector('input[type="button"]'));
            item.classList.add('purchased');
        }
    });
});
