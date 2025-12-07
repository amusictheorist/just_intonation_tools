const factor357 = n => {
  let a = 0, b = 0, c = 0;

  while (n % 3 === 0) { n /= 3; a++; }
  while (n % 5 === 0) { n /= 5; b++; }
  while (n % 7 === 0) { n /= 7; c++; }

  return { leftover: n, a, b, c };
};

export const place = (ratio) => {
  const { num, den } = ratio.octave;
  const fn = factor357(num);
  const fd = factor357(den);

  return {
    x: fn.a - fd.a,
    y: fn.b - fd.b,
    z: fn.c - fd.c
  };
};