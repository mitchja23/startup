document.getElementById('settingsForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const fileInput = document.getElementById('profilePictureInput');
    const file = fileInput.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function() {
            const imageDataUrl = reader.result;

            localStorage.setItem('profilePicture', imageDataUrl);

            window.location.href = 'home.html';
        };
        reader.readAsDataURL(file);
    }
});
