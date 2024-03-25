document.addEventListener("DOMContentLoaded", async () => {
    try {

        const userId = extractIdFromUrl();
        const userDataResponse = await fetch(`/api/users/${userId}/data`);
        if (!userDataResponse.ok) {
            throw new Error('Failed to fetch user data');
        }
        const userData = await userDataResponse.json();

    
        document.getElementById("profilePicture").src = userData.profilePicture;
        document.querySelector("#completedTasks span").textContent = userData.TaskCount.length;
        document.querySelector("#PrizeCount span").textContent = userData.Items.length;
        document.querySelector("#coinCount span").textContent = userData.Coins;

     

    } catch (error) {
        console.error('Error loading user data:', error);

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
