import React from 'react';
import '../styles/movie.css';
import { Heading , Paragraph } from '@innovaccer/design-system';
import "@innovaccer/design-system/css";

const Footer = () => {
    return (
        <footer className="footer">
            <hr className="horLine"/>
            <div className="footer-bottom">
                <p>Copyright © 2024 All Rights Reserved by Divyanshu</p>
            </div>
        </footer>
    );
}

export default Footer;
