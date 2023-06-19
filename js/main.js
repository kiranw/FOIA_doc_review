$(document).ready(function() {

    // Show grouped-show elements only when page is within page group, else hide
    $(".grouped-show").show();
    $(".grouped-hide").hide();

    // Toggle visiblity based on whether page is within a group or not
    $("#is-file-group").change(function() {
    $("#possible-grouping").toggleClass("grouped", this.checked)
        $(".grouped-hide").toggle();
        $(".grouped-show").toggle();
    }).change();

    autoFormatFOIAExemptions("b1b2cdb3b4e");

    $("#foia-exemptions").on('input', (e) => { console.log(e); e.target.value = autoFormatFOIAExemptions(e,e.target.value);});
});


// Process input text for FOIA exemptions to format and separate groupings
// Input Example: "b5b6b7e"
// Output Example: "(b)(5),  (b)(6),  (b)(7)(e)"
function autoFormatFOIAExemptions(e,foiaString) {
  try {
    // if user backspaces, remove last parenthesis group
    if (e.originalEvent.inputType == 'deleteContentBackward') {
        return foiaString.match(/.*\)/g)[0];
    }
    var foiaExemptions = foiaString.replaceAll(/[ \(\),]/g,'').split("b");
    foiaExemptions.shift();
    console.log(foiaExemptions);
    
    var output = foiaExemptions.map( exemption => '(b)' + exemption.split('').map( (char, index) => index == 1 ? '(' + char.toUpperCase() + ')' : '(' + char + ')').join('')).join(',  ')
    console.log(output);
    return output;
  } catch (err) {
    return foiaString;
  }
}













$(document).ready(function() {

    // Loaded via <script> tag, create shortcut to access PDF.js exports.
    var PDFjs = window['pdfjs-dist/build/pdf'];

    // The workerSrc property shall be specified.
    // PDFjs.GlobalWorkerOptions.workerSrc = '//mozilla.github.io/pdf.js/build/pdf.worker.js';
    PDFjs.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.6.347/pdf.worker.min.js"

    var pdfDoc = null,
        pageNum = 1,
        pageRendering = false,
        pageNumPending = null,
        scale = 1.5,
        canvas = document.getElementById('pdf-canvas'),
        ctx = canvas.getContext('2d');

    /**
     * Asynchronously downloads PDF.
     */
    document.getElementById('selectedFile').onchange = function(e) {
        $("#selected-files").text(e.srcElement.files[0].name)
        readFile(e.srcElement.files[0]);
    };

    function readFile(file) {
        PDFjs.getDocument(file.name).promise.then(function(pdfDoc_) {
              pdfDoc = pdfDoc_;
              $('#page_count').show().text("/ " + pdfDoc.numPages.toString());

              // Initial/first page rendering
              renderPage(pageNum);
        });
    } 


    /**
     * Get page info from document, resize canvas accordingly, and render page.
     * @param num Page number.
     */
    function renderPage(num) {
      pageRendering = true;
      // Using promise to fetch the page
      pdfDoc.getPage(num).then(function(page) {
        var viewport = page.getViewport({scale:scale});
            canvas.height = viewport.height;
            canvas.width = viewport.width;

        var textContent = page.getTextContent().then(function (text) {
            return text.items
                .map(function (s) {
                    return s.str;
                })
                .join('');
            });
        console.log(textContent);

        // Render PDF page into canvas context
        var renderContext = {
          canvasContext: ctx,
          viewport: viewport
        };
        var renderTask = page.render(renderContext);

        // Wait for rendering to finish
        renderTask.promise.then(function() {
          pageRendering = false;
          if (pageNumPending !== null) {
            // New page rendering is pending
            renderPage(pageNumPending);
            pageNumPending = null;
          }
        });
      });

      // Update page counters
      $("#page_num").val(num);
    }


    /**
     * If another page rendering in progress, waits until the rendering is
     * finised. Otherwise, executes rendering immediately.
     */
    function queueRenderPage(num) {
      if (pageRendering) {
        pageNumPending = num;
      } else {
        renderPage(num);
      }
    }

    /**
     * Displays previous page.
     */
    function onPrevPage() {
      if (pageNum <= 1) {
        return;
      }
      pageNum--;
      queueRenderPage(pageNum);
    }


    /**
     * Displays next page.
     */
    function onNextPage() {
      if (pageNum >= pdfDoc.numPages) {
        return;
      }
      pageNum++;
      queueRenderPage(pageNum);
    }
    












    // Change PDF page

    $("#page_num").change(function() {
            pageNum = parseInt($("#page_num").val())
            renderPage(pageNum);
        });

    $('.previous').on('click', onPrevPage);
    $('.next').on('click', onNextPage);

    $(document).on("keydown", 'body', function (event) {
        if (event.keyCode == 37) {
            console.log('left arrow pressed');
            onPrevPage();
        }
        if (event.keyCode == 39) {
            console.log('right arrow pressed');
            onNextPage();
        }
    });


});




 
