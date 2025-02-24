import React from "react";
import styles from "./Contacts.module.css";
import NavBar from './NavBar';
import Footer from './Footer';

const Contacts = () => {
  const teamMembers = [
    {
      name: "John Smith",
      role: "Head Chef",
      image: "https://randomuser.me/api/portraits/men/1.jpg",
      contact: "john@desirecipes.com"
    },
    {
      name: "Sarah Johnson",
      role: "Recipe Curator",
      image: "https://randomuser.me/api/portraits/women/1.jpg",
      contact: "sarah@desirecipes.com"
    },
    {
      name: "Mike Chen",
      role: "Food Photographer",
      image: "https://randomuser.me/api/portraits/men/2.jpg",
      contact: "mike@desirecipes.com"
    }
  ];

  return (
    <div className="whole">
      <NavBar />
      <div className={styles.container}>
        <div className={styles.heroSection}>
          <h1>Get in Touch</h1>
          <p>We'd love to hear from you!</p>
        </div>

        <div className={styles.contactGrid}>
          {/* Contact Information */}
          <div className={styles.contactCard}>
            <div className={styles.iconWrapper}>
              <i className="fas fa-map-marker-alt"></i>
            </div>
            <h3>Visit Us</h3>
            <p>123 Recipe Street, Foodie Lane</p>
            <p>New Delhi, India 110001</p>
          </div>

          <div className={styles.contactCard}>
            <div className={styles.iconWrapper}>
              <i className="fas fa-phone-alt"></i>
            </div>
            <h3>Call Us</h3>
            <p>+91 98765 43210</p>
            <p>Mon-Fri, 9:00 AM - 6:00 PM</p>
          </div>

          <div className={styles.contactCard}>
            <div className={styles.iconWrapper}>
              <i className="fas fa-envelope"></i>
            </div>
            <h3>Email Us</h3>
            <p>info@desirecipes.com</p>
            <p>support@desirecipes.com</p>
          </div>
        </div>

        {/* Business Hours */}
        <div className={styles.businessHours}>
          <h2>Business Hours</h2>
          <div className={styles.hoursGrid}>
            <div className={styles.hourRow}>
              <span>Monday - Friday</span>
              <span>9:00 AM - 6:00 PM</span>
            </div>
            <div className={styles.hourRow}>
              <span>Saturday</span>
              <span>10:00 AM - 4:00 PM</span>
            </div>
            <div className={styles.hourRow}>
              <span>Sunday</span>
              <span>Closed</span>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className={styles.teamSection}>
          <h2>Meet Our Team</h2>
          <div className={styles.teamGrid}>
            {teamMembers.map((member, index) => (
              <div key={index} className={styles.teamCard}>
                <img src={member.image} alt={member.name} className={styles.teamImage} />
                <h3>{member.name}</h3>
                <p className={styles.role}>{member.role}</p>
                <p className={styles.contact}>{member.contact}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Social Media Links */}
        <div className={styles.socialSection}>
          <h2>Connect With Us</h2>
          <div className={styles.socialLinks}>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-facebook"></i>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-linkedin"></i>
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contacts;
