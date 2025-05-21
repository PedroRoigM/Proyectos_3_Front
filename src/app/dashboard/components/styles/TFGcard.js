const styles = {
  card: {
    borderRadius: '6px',
    width: '100%',
    marginBottom: 'clamp(10px, 2vw, 16px)', // Margen adaptable
    fontFamily: 'Arial, sans-serif',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    border: '1px solid #e1e5e9',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
  },

  header: {
    marginBottom: 'clamp(2px, 0.6vw, 6px)',
    fontWeight: '600',
    fontSize: 'clamp(14px, 2vw, 18px)', // Tamaño adaptativo
    color: '#14192c',
    lineHeight: '1.3',
    display: '-webkit-box',
    WebkitLineClamp: 1,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },

  description: {
    marginTop: 'clamp(2px, 0.6vw, 6px)',
    fontSize: 'clamp(12px, 1.8vw, 14px)',
    color: '#4a5568',
    lineHeight: '1.4',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },

  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginTop: 'clamp(6px, 1vw, 10px)',
    padding: 'clamp(4px, 0.8vw, 8px) 0',
  },

  meta: {
    fontSize: 'clamp(11px, 1.6vw, 13px)',
    color: '#555',
  },

  tags: {
    display: 'flex',
    gap: 'clamp(4px, 1vw, 8px)',
    flexWrap: 'wrap',
    marginTop: 'clamp(4px, 1vw, 8px)',
    padding: 'clamp(6px, 1.5vw, 10px)', // padding adaptativo para el contenedor de tags
  },

  tag: {
    backgroundColor: '#e6edff',
    color: '#0065ef',
    padding: 'clamp(2px, 0.5vw, 4px) clamp(6px, 1.5vw, 10px)',
    borderRadius: '12px',
    fontSize: 'clamp(10px, 1.4vw, 12px)',
    fontWeight: '500',
    cursor: 'default',
    border: '1px solid #b5c9ff',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    maxWidth: '120px',
    overflow: 'hidden',
  },
};

export default styles;
