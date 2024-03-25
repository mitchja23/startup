document.addEventListener('DOMContentLoaded', async function () {
    function markItemAsSold(button) {
        button.style.backgroundColor = '#FAA0A0';
        button.style.color = '#f53d3d';
        button.style.borderColor = '#f76e6e';
        button.value = 'Sold';
        button.disabled = true;
    }

    async function purchaseItem(itemId, itemPrice, userId, button) {
        try {
            const userDataResponse = await fetch(`/api/users/${userId}/data`);
            if (!userDataResponse.ok) {
                throw new Error('Failed to fetch user data');
            }
            const userData = await userDataResponse.json();
            const coinCount = userData.Coins;

            if (coinCount >= itemPrice) {
                // Call the markAsSold endpoint to mark the item as sold
                const markSoldResponse = await fetch(`/api/items/${itemId}/markAsSold`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ userId: userId }) // Pass the userId to the endpoint
                });
                if (!markSoldResponse.ok) {
                    throw new Error('Failed to mark item as sold');
                }

                // Mark item as sold in the UI
                markItemAsSold(button);
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
            let itemId = button.parentNode.dataset.itemId; // Extract item ID from data-item-id attribute
            let itemPrice = parseInt(button.parentNode.querySelector('p').textContent);

            const userId = extractIdFromUrl();
            if (!userId) {
                console.error('User ID not found in URL');
                return;
            }

            await purchaseItem(itemId, itemPrice, userId, button);
        });
    });

    // Function to extract user ID from the URL
    function extractIdFromUrl() {
        const url = window.location.href;
        const urlParts = url.split('/');
        if (urlParts.length >= 4) {
            return urlParts[3];
        }
        return null;
    }

    // Fetch user data and mark purchased items in the UI
    try {
        const userId = extractIdFromUrl();
        if (userId) {
            const userDataResponse = await fetch(`/api/users/${userId}/data`);
            if (userDataResponse.ok) {
                const userData = await userDataResponse.json();
                const soldItems = userData.Items; // Get the purchased items directly from user data

                // Mark purchased items as sold in the UI
                soldItems.forEach(function (item) {
                    const itemId = item._id; // Assuming item IDs are stored in the user data
                    let itemButton = document.querySelector('.prize-item[data-item-id="' + itemId + '"] input[type="button"]');
                    if (itemButton) {
                        markItemAsSold(itemButton);
                        itemButton.disabled = true; // Disable button for purchased items
                    }
                });
            } else {
                console.error('Failed to fetch user data');
            }
        } else {
            console.error('User ID not found in URL');
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
});
