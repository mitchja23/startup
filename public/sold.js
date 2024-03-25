document.addEventListener('DOMContentLoaded', async function () {
    function markItemAsSold(button) {
        button.style.backgroundColor = '#FAA0A0';
        button.style.color = '#f53d3d';
        button.style.borderColor = '#f76e6e';
        button.value = 'Sold';
        button.disabled = true;
    }

    async function purchaseItem(itemId, itemPrice, userId) {
        try {
            const userDataResponse = await fetch(`/api/users/${userId}/data`);
            if (!userDataResponse.ok) {
                throw new Error('Failed to fetch user data');
            }
            const userData = await userDataResponse.json();
            const coinCount = userData.Coins.length;

            if (coinCount >= itemPrice) {
                const newCoinCount = coinCount - itemPrice;
                const updateResponse = await fetch(`/api/users/${userId}/coins`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ coinCount: newCoinCount })
                });
                if (!updateResponse.ok) {
                    throw new Error('Failed to update coin count');
                }

                const markSoldResponse = await fetch(`/api/items/${itemId}/markAsSold`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                if (!markSoldResponse.ok) {
                    throw new Error('Failed to mark item as sold');
                }


                document.getElementById('coinCount').querySelector('span').textContent = newCoinCount;

                localStorage.setItem('coinCount', newCoinCount);

                let soldItems = JSON.parse(localStorage.getItem('soldItems')) || [];
                soldItems.push(itemId);
                localStorage.setItem('soldItems', JSON.stringify(soldItems));


                let purchasedItem = document.querySelector('.prize-item[data-item-id="' + itemId + '"]');
                if (purchasedItem) {
                    markItemAsSold(purchasedItem.querySelector('input[type="button"]'));
                    purchasedItem.classList.add('purchased');
                }
            } else {
                console.error('Insufficient funds to purchase item');

            }
        } catch (error) {
            console.error('Error:', error);

        }
    }

    let buyButtons = document.querySelectorAll('.prize-item input[type="button"]');

    buyButtons.forEach(function (button) {
        button.addEventListener('click', async function () {
            let itemId = button.parentNode.dataset.itemId;
            let itemPrice = parseInt(button.parentNode.querySelector('p').textContent); 


            const userId = extractIdFromUrl();
            if (!userId) {
                console.error('User ID not found in URL');
                return;
            }


            await purchaseItem(itemId, itemPrice, userId);
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

function extractIdFromUrl() {
    const url = window.location.href;
    const urlParts = url.split('/');
    if (urlParts.length >= 4) { 
        return urlParts[3];
    }
    return null; 
}
