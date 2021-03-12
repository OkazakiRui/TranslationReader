var url = 'https://click.ecc.ac.jp/ecc/rokazaki/data/pdf/001bj.pdf';
let translation = 'ja';
const translationBtn = document.getElementById('translation');

var pdfjsLib = window['pdfjs-dist/build/pdf'];

pdfjsLib.GlobalWorkerOptions.workerSrc = 'pdfjs/build/pdf.worker.js';

var pdfDoc = null,
  pageNum = 1,
  pageRendering = false,
  pageNumPending = null,
  scale = 0.8,
  canvas = document.getElementById('the-canvas'),
  ctx = canvas.getContext('2d');

function renderPage(num) {
  pageRendering = true;
  pdfDoc.getPage(num).then(function (page) {
    var viewport = page.getViewport({ scale: scale });
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    var renderContext = {
      canvasContext: ctx,
      viewport: viewport,
    };
    var renderTask = page.render(renderContext);

    renderTask.promise.then(function () {
      pageRendering = false;
      if (pageNumPending !== null) {
        renderPage(pageNumPending);
        pageNumPending = null;
      }
    });
  });

  document.getElementById('page_num').textContent = num;
}

function queueRenderPage(num) {
  if (pageRendering) {
    pageNumPending = num;
  } else {
    renderPage(num);
  }
}

function onPrevPage() {
  if (pageNum <= 1) {
    return;
  }
  pageNum--;
  queueRenderPage(pageNum);
}
document.getElementById('prev').addEventListener('click', onPrevPage);

function onNextPage() {
  if (pageNum >= pdfDoc.numPages) {
    return;
  }
  pageNum++;
  queueRenderPage(pageNum);
}
document.getElementById('next').addEventListener('click', onNextPage);

pdfjsLib.getDocument(url).promise.then(function (pdfDoc_) {
  pdfDoc = pdfDoc_;
  document.getElementById('page_count').textContent = pdfDoc.numPages;

  renderPage(pageNum);
});

translationBtn.addEventListener('click', () => {
  if (translation === 'ja') {
    url = 'https://click.ecc.ac.jp/ecc/rokazaki/data/pdf/enbj001.pdf';
    console.log('日本語から英語');
    translation = 'en';
  } else {
    url = 'https://click.ecc.ac.jp/ecc/rokazaki/data/pdf/001bj.pdf';
    translation = 'ja';
    console.log('英語から日本語');
  }
  pdfjsLib.getDocument(url).promise.then(function (pdfDoc_) {
    pdfDoc = pdfDoc_;
    document.getElementById('page_count').textContent = pdfDoc.numPages;

    renderPage(pageNum);
  });
});
