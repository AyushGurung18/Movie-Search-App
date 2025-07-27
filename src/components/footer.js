import React from "react";
import "../styles/footer.css";

function Footer() {

  return (
    <footer className="footer">
      <div className="footer-site">
        <div className="">
          <p style={{ color: "grey" }}>Questions? Call 000-800-919-1694</p>
        </div>
        <ul className="footer-link">
          <li className="footer-link-item">
            <span>FAQ</span>
          </li>
          <li className="footer-link-item">
            <span>Help Centre</span>
          </li>
          <li className="footer-link-item">
            <span>Terms of Use</span>
          </li>
          <li className="footer-link-item">
            <span>Privacy</span>
          </li>
          <li className="footer-link-item">
            <span>Corporate Information</span>
          </li>
        </ul>
        <div>
          <p className="copyright">
            &copy; 2025 &nbsp; <a href="https://ayushgurung.com" target="_blank" className="custom-link"> Ayush Gurung.</a>&nbsp; All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
export default Footer;
