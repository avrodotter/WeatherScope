
import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full py-6 px-4 text-right">
      <span className="text-white/80 text-sm">
        Made by{' '}
        <a
          href="https://github.com/avrodotter"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/80 hover:text-white transition-colors duration-200 underline"
        >
          @avrodotter
        </a>
      </span>
    </footer>
  );
};

export default Footer;
