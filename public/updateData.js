document.addEventListener('DOMContentLoaded', async function() {
    try {
        // Fetch user ID from the '/cookie' endpoint
        const userIdResponse = await fetch('/register');
        if (!userIdResponse.ok) {
            throw new Error('Failed to fetch user ID');
        }
        const userData = await userIdResponse.json();
        const userId = userData.userId;

        if (userId) {
            const taskCountSpan = document.getElementById('completedTasks').querySelector('span');
            const coinCountSpan = document.getElementById('coinCount').querySelector('span');
            const soldItemsCountSpan = document.querySelectorAll('.prize-item').length;

            const data = {
                taskCount: taskCountSpan.textContent,
                coinCount: coinCountSpan.textContent,
                soldItems: soldItemsCountSpan
            };

            sendDataToBackend(userId, data);
        } else {
            console.error('Failed to fetch user ID');
        }
    } catch (error) {
        console.error('Error:', error);
    }
});

function sendDataToBackend(userId, data) {
    fetch('/data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userid: userId, ...data })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to update data');
        }
        return response.json();
    })
    .then(updatedData => {
        console.log('Data updated successfully:', updatedData);
    })
    .catch(error => {
        console.error('Error updating data:', error);
    });
}
