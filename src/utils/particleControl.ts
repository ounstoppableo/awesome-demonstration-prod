export function setParticle() {
  const theme =
    document.documentElement.className === 'dark' ? 'dark' : 'light';
  (window as any).particlesJS.load(
    'particles-js',
    theme === 'dark' ? '/particles-dark.json' : '/particles-light.json',
    function () {},
  );
}

export function removeParticle() {
  (window as any)?.pJSDom[0]?.pJS?.fn.particlesEmpty();
  (window as any)?.pJSDom[0]?.pJS?.fn.canvasClear();
  (window as any)?.pJSDom && ((window as any).pJSDom.length = 0);
}
