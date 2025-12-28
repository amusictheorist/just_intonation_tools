const FormatSet = ({ arr, braces = '{}', underline = false }) => {
  const [open, close] = braces.split('');
  return (
    <span>
      {open}
      {arr.map((x, i) => (
        <span key={i} className={underline ? 'underline' : ''}>
          {x}{i < arr.length - 1 ? ', ' : ''}
        </span>
      ))}
      {close}
    </span>
  );
};

export default FormatSet;