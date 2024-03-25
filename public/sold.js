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
            // Fetch the user's coin count from the backend API
            const userDataResponse = await fetch(`/api/users/${userId}/data`);
            if (!userDataResponse.ok) {
                throw new Error('Failed to fetch user data');
            }
            const userData = await userDataResponse.json();
            const coinCount = userData.Coins.length;

            if (coinCount >= itemPrice) {
                // Deduct the item price from the user's coin count
                const newCoinCount = coinCount - itemPrice;

                // Update the user's coin count in the database
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

                // Mark the item as sold in the database and increment its count
                const markSoldResponse = await fetch(`/api/items/${itemId}/markAsSold`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                if (!markSoldResponse.ok) {
                    throw new Error('Failed to mark item as sold');
                }

                // Update the UI with the new coin count
                document.getElementById('coinCount').querySelector('span').textContent = newCoinCount;

                // Update the local storage (optional)
                localStorage.setItem('coinCount', newCoinCount);

                // Record the purchased item
                let soldItems = JSON.parse(localStorage.getItem('soldItems')) || [];
                soldItems.push(itemId);
                localStorage.setItem('soldItems', JSON.stringify(soldItems));

                // Mark the purchased item in the UI
                let purchasedItem = document.querySelector('.prize-item[data-item-id="' + itemId + '"]');
                if (purchasedItem) {
                    markItemAsSold(purchasedItem.querySelector('input[type="button"]'));
                    purchasedItem.classList.add('purchased');
                }
            } else {
                console.error('Insufficient funds to purchase item');
                // Handle case where user does not have enough coins
            }
        } catch (error) {
            console.error('Error:', error);
            // Handle error fetching or updating coin count
        }
    }

    let buyButtons = document.querySelectorAll('.prize-item input[type="button"]');

    buyButtons.forEach(function (button) {
        button.addEventListener('click', async function () {
            let itemId = button.parentNode.dataset.itemId;
            let itemPrice = parseInt(button.parentNode.querySelector('p').textContent); 

            // Extract userId from URL
            const userId = extractIdFromUrl();
            if (!userId) {
                console.error('User ID not found in URL');
                return;
            }

            // Purchase the item
            await purchaseItem(itemId, itemPrice, userId);
        });
    });

    // Mark items as sold based on local storage
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
