import "./Contact.css";

function Contact() {
  return (
    <div className="contact-page">
      <h2>📩 Contact Us</h2>
      <p>We’d love to hear from you! Please fill out the form below or reach us directly.</p>

      <form className="contact-form">
        <label>Name:</label>
        <input type="text" placeholder="Your Name" required />

        <label>Email:</label>
        <input type="email" placeholder="you@example.com" required />

        <label>Message:</label>
        <textarea placeholder="Write your message here..." required></textarea>

        <button type="submit">Send Message</button>
      </form>

      <div className="contact-info">
        <h3>Our Info</h3>
        <p>📍 123 Beauty Lane, Lagos, Nigeria</p>
        <p>📞 +234 800 123 4567</p>
        <p>✉️ info@ManesBySplash.com</p>
      </div>
    </div>
  );
}

export default Contact;
