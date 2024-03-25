document.addEventListener("DOMContentLoaded", async () => {
    try {
        // Fetch user data from the backend API
        const userId = extractIdFromUrl();
        const userDataResponse = await fetch(`/api/users/${userId}/data`);
        if (!userDataResponse.ok) {
            throw new Error('Failed to fetch user data');
        }
        const userData = await userDataResponse.json();

        // Update HTML elements with user data
        document.getElementById("profilePicture").src = userData.profilePicture;
        document.querySelector("#completedTasks span").textContent = userData.TaskCount.length;
        document.querySelector("#PrizeCount span").textContent = userData.Items.length;
        document.querySelector("#coinCount span").textContent = userData.Coins;

        // You can update other HTML elements with additional user data here

    } catch (error) {
        console.error('Error loading user data:', error);
        // Handle error loading user data
    }
});

function extractIdFromUrl() {
    const url = window.location.href;
    const urlParts = url.split('/');
    if (urlParts.length >= 4) { 
        return urlParts[3];
    }
    return null; 
}
