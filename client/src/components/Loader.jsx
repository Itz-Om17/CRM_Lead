import React from 'react';

function Loader({ size = '36px', color = 'var(--color-primary)', message = 'Loading leads...' }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '3rem 1.5rem',
      width: '100%'
    }}>
      <div style={{
        width: size,
        height: size,
        border: '3px solid var(--border-color)',
        borderTop: `3px solid ${color}`,
        borderRadius: '50%',
        animation: 'loader-spin 0.8s linear infinite'
      }} />
      {message && (
        <p style={{
          marginTop: '1rem',
          color: 'var(--text-secondary)',
          fontSize: '14px'
        }}>
          {message}
        </p>
      )}
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes loader-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}} />
    </div>
  );
}

export default Loader;
