document.addEventListener('DOMContentLoaded', async function() {
    try {
        const userId = getUserIdFromUrl();
        const userData = await fetchUserData(userId);

        updateProfile(userData);
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
});

function getUserIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    console.log(urlParams)
    return urlParams.get('id');
}

async function fetchUserData(userId) {
    try {
        const response = await fetch(`/api/users/${userData._id}`);
        if (!response.ok) {
            throw new Error('Failed to fetch user data');
        }
        return await response.json();
    } catch (error) {
        throw new Error('Failed to fetch user data: ' + error.message);
    }
}

function updateProfile(userData) {
    document.querySelector('.user-name').textContent = userData.username;
    document.querySelector('.userid').textContent = userData._id;
    document.querySelector('.completedTasks').textContent = userData.TaskCount.length; 
    document.querySelector('.PrizeCount').textContent = userData.Items.length; 
    document.querySelector('.friendCount').textContent = userData.followers.length; 
    document.querySelector('.coinCount').textContent = userData.Coins.length; 
}


