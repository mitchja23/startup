document.getElementById('registrationForm').addEventListener('submit', async function(event) {
    event.preventDefault(); 
    
    const formData = new FormData(this);
    const requestData = {};
    
    for (var [key, value] of formData.entries()) {
      requestData[key] = value;
    }
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });
      
      if (!response.ok) {
        throw new Error('Registration failed');
      }
      
      const data = await response.json();
      console.log('User registered successfully:', data);
      alert('User registered successfully!');
      
 
      window.location.href = '/index.html';
      
    } catch (error) {
      console.error('Error registering user:', error.message);
      alert('Error registering user. Please try again later.');
    }
});
