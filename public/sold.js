document.addEventListener('DOMContentLoaded', async function () {
    function markItemAsSold(button) {
        button.style.backgroundColor = '#FAA0A0';
        button.style.color = '#f53d3d';
        button.style.borderColor = '#f76e6e';
        button.value = 'Sold';
        button.disabled = true;
    }

    const buyButtons = document.querySelectorAll('.buy-button');
    buyButtons.forEach(button => {
        button.addEventListener('click', async () => {
            try {
                const itemId = button.parentElement.getAttribute('data-item-id');
                const response = await fetch(`/api/items/${itemId}/buy`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'user-id': 'USER_ID' // Replace USER_ID with the actual user ID
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    console.log(data); // Handle response data accordingly
                } else {
                    console.error('Error buying item:', response.statusText);
                }
            } catch (error) {
                console.error('Error buying item:', error);
            }
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
