import React from 'react';
import HeaderComponent from '../components/Header';
import FooterComponent from '../components/Footer';
import ScrollToTop from '../components/ScrollToTop';

const MemberLayout = ({ children }) => {
  const contentStyle = {
    minHeight: "calc(100vh - 128px)",
    padding: "80px 20px 80px 20px",
    background: "#f0f2f5",
  };

  return (
    <div style={{ minHeight: "100vh" }}>
      <HeaderComponent />
      <div style={contentStyle}>
        {children}
      </div>
      <FooterComponent />
      <ScrollToTop />
    </div>
  );
};

export default MemberLayout; 