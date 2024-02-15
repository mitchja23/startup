document.addEventListener('DOMContentLoaded', function () {

    let buyButtons = document.querySelectorAll('.prize-item input[type="button"]');

   
    buyButtons.forEach(function(button) {
      button.addEventListener('click', function() {

        button.style.backgroundColor = '#FAA0A0';
        button.style.color = '#f53d3d';
        button.style.borderColor = '#f76e6e';
        button.value = 'Sold';

        button.disabled = true;
      });
    });
  });