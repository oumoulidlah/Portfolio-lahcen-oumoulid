// FORMSPREE CONTACT FORM CODE
// Replace the contact form code in main.js with this code when you set up Formspree

// Contact form validation + AJAX (Formspree compatible)
(function() {
  const form = document.getElementById('contactForm');
  const toast = document.getElementById('toast');
  if (!form) return;
  
  function showToast(message, ok = true) {
    if (!toast) return alert(message);
    toast.textContent = message;
    toast.style.borderColor = ok ? 'var(--outline)' : '#d9534f';
    toast.style.backgroundColor = ok ? 'var(--bg)' : '#fee';
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 4000);
  }
  
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = new FormData(form);
    
    // Honeypot check
    if (data.get('company')) return;
    
    const name = (data.get('name') || '').toString().trim();
    const email = (data.get('email') || '').toString().trim();
    const message = (data.get('message') || '').toString().trim();
    
    // Validation
    if (!name || !email || !message) {
      return showToast('Please fill in all fields', false);
    }
    if (!isValidEmail(email)) {
      return showToast('Please enter a valid email address', false);
    }
    if (message.length < 10) {
      return showToast('Please enter a more detailed message', false);
    }
    
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    
    try {
      const res = await fetch(form.action, { 
        method: 'POST', 
        body: data, 
        headers: { 'Accept': 'application/json' } 
      });
      
      if (res.ok) {
        form.reset();
        showToast('Message sent successfully! I\'ll get back to you soon.');
      } else {
        const errorData = await res.json();
        if (errorData.errors) {
          showToast(errorData.errors.map(error => error.message).join(', '), false);
        } else {
          showToast('Failed to send message. Please try again.', false);
        }
      }
    } catch (err) {
      console.error('Contact form error:', err);
      showToast('Network error. Please check your connection and try again.', false);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Message';
    }
  });
})();

// SETUP INSTRUCTIONS:
// 1. Go to https://formspree.io and create a free account
// 2. Create a new form and copy your form endpoint
// 3. In index.html, replace action="#" with action="https://formspree.io/f/YOUR_FORM_ID"
// 4. Replace the contact form code in main.js with this code
// 5. Test the form - first submission will require email verification

