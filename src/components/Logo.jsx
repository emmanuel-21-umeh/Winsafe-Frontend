const Logo = ({ size = 'large' }) => {
  const width = size === 'large' ? 180 : 120;

  return (
    <div style={{ textAlign: 'center', marginBottom: 20 }}>
      <img
        src="/logo.png"
        alt="WinSafe Logo"
        style={{ width, height: 'auto', objectFit: 'contain' }}
      />
    </div>
  );
};

export default Logo;