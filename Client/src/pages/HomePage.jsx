import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../styles/HomePage.css';

const HomePage = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 }); 
  }, []);

  return (
    <>
      {/* Navbar */}
      <header className="navbar1">
        <div className="logo" data-aos="fade-right">PENNYWISE</div>
        <nav>
          <ul className="nav-links1" data-aos="fade-down">
            <li><a href="#">About Us</a></li>
            <li><a href="#">Contact Us</a></li>
            <li><a href="#">Privacy Policy</a></li>
          </ul>
        </nav>
        <div className="auth-buttons" data-aos="fade-left">
          <Link to="/signup">
            <button className="signup-btn">SignUp</button>
          </Link>
          <Link to="/login">
            <button className="login-btn">Login</button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content" data-aos="fade-right">
          <h1 className="hero-title">PENNYWISE</h1>
          <p className="hero-description">
            Take control of your financial journey with Pennywise.<br />
            Easily track your income, expenses, and savings in one place.<br />
            Visualize your spending patterns with detailed graphs, and make smarter decisions.<br />
            Start today and experience the simplicity of managing your finances!
          </p>
          <div className="hero-buttons">
            <Link to="/signup">
              <button className="hero-signup-btn">Sign Up</button>
            </Link>
            <Link to="/login">
              <button className="hero-login-btn">Login</button>
            </Link>
          </div>
        </div>
        <div className="hero-image" data-aos="fade-left">
          <img src="/images/Revenue-bro.png" alt="Financial Illustration" />
        </div>
      </section>

      {/* What We Offer Section */}
      <section className="offer-section">
        <h2 className="section-title" data-aos="fade-up">What We Offer</h2>
        <div className="cards-container">
          <div className="offer-card" data-aos="zoom-in">
            <img src="/images/Revenue-rafiki.png" alt="Easy Tracking" />
            <h3>Easy Income and Expense Tracking</h3>
            <p>
              Effortlessly log your income and expenses to keep a clear view of your financial health.
            </p>
          </div>
          <div className="offer-card" data-aos="zoom-in" data-aos-delay="200">
            <img src="/images/Revenue-pana.png" alt="Visualizations" />
            <h3>Intuitive Visualizations</h3>
            <p>
              Understand your spending patterns with dynamic graphs and charts, making budgeting a breeze.
            </p>
          </div>
          <div className="offer-card" data-aos="zoom-in" data-aos-delay="400">
            <img src="/images/Revenue-amico.png" alt="Secure Experience" />
            <h3>Secure and Personalized Experience</h3>
            <p>
              Enjoy a safe, personalized finance tracker with real-time updates tailored to your financial journey.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <ul className="footer-links">
          <li><a href="#">Home</a></li>
          <li><a href="#">About Us</a></li>
          <li><a href="#">Contact Us</a></li>
          <li><a href="#">Privacy Policy</a></li>
          <li><a href="#">Terms of Service</a></li>
        </ul>
        <p>© 2024 PennyWise. All rights reserved.</p>
      </footer>
    </>
  );
};

export default HomePage;