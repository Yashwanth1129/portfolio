import React from 'react';

const Logo = ({ size = 40 }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        fontFamily: 'sans-serif',
        fontSize: `${size}px`,
        fontWeight: '100',
        lineHeight: '0.8',
        letterSpacing: '-1px',
      }}>
        Y
      </div>
      <div style={{
        fontFamily: 'sans-serif',
        fontSize: `${size * 0.12}px`,
        fontWeight: '300',
        letterSpacing: `${size * 0.08}px`,
        textTransform: 'uppercase',
        marginTop: `${size * 0.15}px`,
      }}>
        Yashwanth
      </div>
    </div>
  );
};

export default Logo;