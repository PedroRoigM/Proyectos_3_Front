const styles = {
  card: {
    borderRadius: '6px',
    width: '100%',
    margin: '0 0 12px 0',
    fontFamily: 'Arial, sans-serif',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    border: '1px solid #e1e5e9',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    ':hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 3px 8px rgba(0, 0, 0, 0.12)'
    }
  },
  header: {
    marginBottom: '4px',
    fontWeight: '600',
    fontSize: '16px',
    color: '#14192c',
    lineHeight: '1.3',
    display: '-webkit-box',
    WebkitLineClamp: 1, // Limitar a una línea
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  description: {
    marginTop: '4px',
    fontSize: '13px',
    color: '#4a5568',
    lineHeight: '1.4',
    display: '-webkit-box',
    WebkitLineClamp: 2, // Limitar a dos líneas
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginTop: '8px',
    padding: '4px 0'
  },
  meta: {
    fontSize: '12px',
    color: '#555',
  },
  tags: {
    display: 'flex',
    gap: '6px',
    flexWrap: 'wrap',
    marginTop: '6px',
  },
  tag: {
    backgroundColor: '#e6edff',
    color: '#0065ef',
    padding: '2px 8px',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: '500',
    cursor: 'default',
    border: '1px solid #b5c9ff',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    maxWidth: '120px',
    overflow: 'hidden'
  }
};

export default styles;