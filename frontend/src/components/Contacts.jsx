import React from "react";
import styles from "./Contacts.module.css"; // Assuming your updated CSS file is named Contact.module.css

import NavBar from './NavBar';
import Footer from './Footer';

const Contacts = () => {
  return (

    <div className="whole">
      <NavBar/>
    <div className={styles.container}>
      <div className={styles.contactSection}>
        <div className={styles.contactInfo}>
          <h2>Contact Information</h2>
          <div className={styles.infoItem}>
            <i className="fas fa-map-marker-alt"></i>
            <p>
              123 Recipe Street, Foodie Lane
              <br />
              New Delhi, India 110001
            </p>
          </div>
          <div className={styles.infoItem}>
            <i className="fas fa-phone-alt"></i>
            <p>+91 98765 43210</p>
          </div>
          <div className={styles.infoItem}>
            <i className="fas fa-envelope"></i>
            <p>info@desirecipes.com</p>
          </div>
        </div>
        <div className={styles.contactForm}>
          <h2>Contact Us</h2>
          <p>Get in touch with us for any questions or suggestions</p>
          <form>
            <input type="text" placeholder="Your Name" required />
            <input type="email" placeholder="your@email.com" required />
            <input type="text" placeholder="How can we help?" required />
            <textarea placeholder="Your message..." rows="5" required></textarea>
            <button type="submit">Send Message</button>
          </form>
        </div>
      </div>
    </div>
    <Footer/>
    </div>
  );
};

export default Contacts;
