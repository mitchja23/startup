document.addEventListener('DOMContentLoaded', function() {

    fetch("https://type.fit/api/quotes")
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {

            const randomIndex = Math.floor(Math.random() * data.length);
            const quote = data[randomIndex].text;
            
            document.querySelector('.quote').textContent = quote;
        })
        .catch(function(error) {
            console.error('Error fetching quote:', error);
        });
});