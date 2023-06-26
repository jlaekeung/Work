document.getElementById('register').addEventListener('click', async () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const name = document.getElementById('name').value;
  
    const response = await fetch('/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, name }),
    });
  
    if (response.ok) {
      alert('Registered successfully!');
    } else {
      alert('Error registering. Please try again.');
    }
  });
  
  document.getElementById('login').addEventListener('click', async () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
  
    const response = await fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
  
    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('token', data.token);
      alert('Logged in successfully!');
    } else {
      alert('Error logging in. Please try again.');
    }
  });
  
  document.getElementById('activity-form').addEventListener('submit', async (event) => {
    event.preventDefault();
  
    const name = document.getElementById('name').value;
    const activity = document.getElementById('activity').value;
    const token = localStorage.getItem('token');
  
    if (!token) {
      alert('Please log in before submitting.');
      return;
    }
  
    const response = await fetch('/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ name, activity }),
    });
  
    if (response.ok) {
      alert('Activity submitted successfully!');
    } else {
      alert('Error submitting activity. Please try again.');
    }
  });