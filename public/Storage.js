document.addEventListener('DOMContentLoaded', function() {
    const profilePicture = localStorage.getItem('profilePicture');

    if (profilePicture) {
        document.getElementById('profilePicture').src = profilePicture;
    }

});