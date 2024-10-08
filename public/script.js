document.getElementById('greetingForm').addEventListener('submit', async (event) => {
    event.preventDefault();
  
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const message = document.getElementById('message').value;
    const image = document.getElementById('image').files[0];
    const formData = new FormData();
    formData.append('name',name);
    formData.append('phone',phone);
    formData.append('message',message);
    formData.append('image',image);
    try {
      const response = await fetch('/api/greetings', {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        alert('Greeting submitted successfully!');
        document.getElementById('greetingForm').reset();
      }
    } catch (error) {
      alert('Failed to submit greeting. Please try again.');
    }
  });