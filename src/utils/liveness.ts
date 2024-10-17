export function livenessFn(isMobile: boolean, bg: string) {
  const modiDocumentReader = document.getElementById('liveness');
  if (modiDocumentReader) {
    const shadowRoot = modiDocumentReader.shadowRoot;
    const documentReader = shadowRoot?.querySelector('.my-custom-style');
    const viewportHeight = window.innerHeight;
    const viewPercent = isMobile ? 0.8 : 0.6;
    const newHeight = viewportHeight * viewPercent;
    const className =
      documentReader?.shadowRoot?.querySelector('div')?.className;
    const style = document.createElement('style');
    style.textContent = `
        .${className} {
           height: ${newHeight - 100}px !important;
           width:100%;
        }
        
        ._instruction-window_wzfb4_1 button {
          background: ${bg};
        }
     `;
    documentReader?.shadowRoot?.appendChild(style);
  }
}
