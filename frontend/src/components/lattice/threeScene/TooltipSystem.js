export const showTooltip = (data, x, y) => {
  const div = document.getElementById('lattice-tooltip');
  if (!div) return;

  let extra = '';
  if (data.rawValue && data.octaveValue) {
    const octaveShift = Math.log2(data.rawValue / data.octaveValue);
    extra = `<div><b>Octave shift:</b>${octaveShift}</div>`;
  }

  div.innerHTML = `
    <div><b>Input:</b> ${data.rawInput ?? ''}</div>
    <div><b>Placed:</b> ${data.octaveLabel ?? ''}</div>
    ${extra}
  `;

  div.style.left = `${x + 10}px`;
  div.style.top = `${y + 10}px`;
  div.style.display = 'block';
};

export const hideTooltip = () => {
  const div = document.getElementById('lattice-tooltip');
  if (div) div.style.display = 'none';
};