const styles = {
  card: {
    borderRadius: '8px',
    width: '100%', // Asegura que ocupe todo el ancho disponible
    margin: 'auto',
    fontFamily: 'Arial, sans-serif',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
    marginBottom: '16px', // Añade espacio entre tarjetas
    border: '1px solid #e1e5e9'
  },
  header: {
    marginBottom: '8px',
    fontWeight: '600'
  },
  description: {
    marginTop: '8px',
    fontSize: '14px',
    color: '#333',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginTop: '12px',
  },
  meta: {
    fontSize: '14px',
    color: '#555',
  },
  tags: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
    marginTop: '8px',
  },
  tag: {
    backgroundColor: '#e6edff',
    color: '#1a3dab',
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '12px',
    cursor: 'default',
    border: '1px solid #b5c9ff'
  }
};

export default styles;