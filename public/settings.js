document.getElementById('settingsForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const fileInput = document.getElementById('profilePictureInput');
    const file = fileInput.files[0];

    if (file) {
        const formData = new FormData();
        formData.append('profilePicture', file);

        try {
            const userId = extractIdFromUrl(); 
            const response = await fetch(`/api/users/${userId}/uploadProfilePicture`, {
                method: 'POST',
                body: formData,
         
                headers: {
                    'User-ID': userId
                }
            });

            if (response.ok) {
                const imageURL = await response.text();

                localStorage.setItem('profilePicture', imageURL);

           
                await updateProfilePictureInDatabase(userId, imageURL);

             
                window.location.href = 'home.html';
            } else {
                console.error('Failed to upload profile picture');
            }
        } catch (error) {
            console.error('Error uploading profile picture:', error);
        }
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

async function updateProfilePictureInDatabase(userId, imageURL) {
    try {
   
        await fetch(`/api/users/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ profilePicture: imageURL })
        });
    } catch (error) {
        console.error('Error updating profile picture in the database:', error);
    }
}
