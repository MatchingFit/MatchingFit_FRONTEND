import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// === PDF 설정 상수 ===
const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;
const MARGIN_MM = 20;
const TOP_MARGIN_MM = 20;
const BOTTOM_MARGIN_MM = 30;
const CONTENT_WIDTH_MM = A4_WIDTH_MM - MARGIN_MM * 2; // 170mm
const CONTENT_HEIGHT_MM = A4_HEIGHT_MM - TOP_MARGIN_MM - BOTTOM_MARGIN_MM; // 247mm
const PX_PER_MM = 96 / 25.4; // 약 3.78px/mm
const SCALE = 3;

// === DOM 클론 생성 ===
const createClonedElement = (src: HTMLElement): HTMLElement => {
  const wrapper = document.createElement('div');
  wrapper.style.position = 'fixed';
  wrapper.style.left = '-100000px';
  wrapper.style.top = '0';
  wrapper.style.overflow = 'hidden';

  const clone = src.cloneNode(true) as HTMLElement;
  const contentWidthPx = Math.round(CONTENT_WIDTH_MM * PX_PER_MM);
  clone.style.width = `${contentWidthPx}px`;

  wrapper.appendChild(clone);
  document.body.appendChild(wrapper);

  return wrapper;
};

// === 페이지 단위 캔버스 자르기 ===
const getCanvasSlice = (
  canvas: HTMLCanvasElement,
  srcY: number,
  sliceHeightPx: number,
): HTMLCanvasElement => {
  const sliceCanvas = document.createElement('canvas');
  sliceCanvas.width = canvas.width;
  sliceCanvas.height = sliceHeightPx;

  const ctx = sliceCanvas.getContext('2d')!;
  ctx.drawImage(
    canvas,
    0,
    srcY,
    canvas.width,
    sliceHeightPx,
    0,
    0,
    canvas.width,
    sliceHeightPx,
  );

  return sliceCanvas;
};

// === 메인 함수 ===
const downloadPDF = async () => {
  const src = document.getElementById('pdf-section');
  if (!src) return;

  const wrapper = createClonedElement(src);
  const clone = wrapper.firstElementChild as HTMLElement;

  const canvas = await html2canvas(clone, {
    scale: SCALE,
    useCORS: true,
  });

  const pxPerMm = canvas.width / CONTENT_WIDTH_MM;
  const pageHeightPx = Math.floor(CONTENT_HEIGHT_MM * pxPerMm);
  const totalPages = Math.ceil(canvas.height / pageHeightPx);

  const pdf = new jsPDF('p', 'mm', 'a4');

  for (let i = 0; i < totalPages; i++) {
    if (i !== 0) pdf.addPage();

    const srcY = i * pageHeightPx;
    const sliceHeightPx = Math.min(pageHeightPx, canvas.height - srcY);
    const sliceHeightMm = sliceHeightPx / pxPerMm;

    const sliceCanvas = getCanvasSlice(canvas, srcY, sliceHeightPx);
    const imgData = sliceCanvas.toDataURL('image/png');

    pdf.addImage(
      imgData,
      'PNG',
      MARGIN_MM,
      TOP_MARGIN_MM,
      CONTENT_WIDTH_MM,
      sliceHeightMm,
    );
  }

  document.body.removeChild(wrapper);
  pdf.save('download.pdf');
};

export default downloadPDF;
