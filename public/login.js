document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault(); 
    
    const formData = new FormData(this);
    const requestData = {};
    
    for (var [key, value] of formData.entries()) {
      requestData[key] = value;
    }
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });
      
      if (!response.ok) {
        throw new Error('Login failed');
      }
      
      const userData = await response.json();
      console.log('User logged in successfully:', userData);

      
      window.location.href =  `${userData._id}/home.html`; 
      
    } catch (error) {
      console.error('Error logging in:', error.message);
      alert('Error logging in. Please try again.');
    }
});
