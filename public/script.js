document.getElementById('greetingForm').addEventListener('submit', async (event) => {
    event.preventDefault();
  
    const name = document.getElementById('name').value;
    const message = document.getElementById('message').value;
    try {
      const response = await fetch('/api/greetings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, message }),
      });
      
      if (response.ok) {
        alert('Greeting submitted successfully!');
        document.getElementById('greetingForm').reset();
      }
    } catch (error) {
      alert('Failed to submit greeting. Please try again.');
    }
  });