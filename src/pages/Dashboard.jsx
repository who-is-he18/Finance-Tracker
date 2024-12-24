import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css"; // Import AOS styles
import "../styles/Dashboard.css";

const Dashboard = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000, // Animation duration in milliseconds
      easing: "ease-in-out", // Easing function
      once: true, // Whether animation should happen only once
    });
  }, []);

  return (
    <div className="dashboard-container">
      {/* Main Content */}
      <main className="dashboard-main">
        <section
          className="card income-card"
          data-aos="fade-up" // Animation for this section
        >
          <h3 className="card-title">TOTAL INCOME</h3>
          <ul className="card-details">
            <li>M-PESA: -------</li>
            <li>Equity Bank: -------</li>
            <li>Family Bank: -------</li>
            <li>TOTAL: -------</li>
          </ul>
          <img
            src="/images/Revenue-rafiki.png"
            alt="Income"
            className="card-image"
          />
        </section>

        <section
          className="card expenses-card"
          data-aos="fade-right" // Animation for this section
        >
          <h3 className="card-title">TOTAL EXPENSES</h3>
          <ul className="card-details">
            <li>Housing: -------</li>
            <li>Food: -------</li>
            <li>Recreational: -------</li>
            <li>Clothing: -------</li>
          </ul>
          <img
            src="/images/Personal finance-bro.png"
            alt="Expenses"
            className="card-image"
          />
        </section>

        <section
          className="card savings-card"
          data-aos="fade-left" // Animation for this section
        >
          <h3 className="card-title">CURRENT SAVINGS</h3>
          <ul className="card-details">
            <li>M-Shwari: -------</li>
            <li>Equity Bank: -------</li>
            <li>Family Bank: -------</li>
            <li>TOTAL: -------</li>
          </ul>
          <img
            src="/images/Savings-pana.png"
            alt="Savings"
            className="card-image"
          />
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
