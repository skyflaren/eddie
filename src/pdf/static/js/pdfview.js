// $(document).ready(function() {
//  var audioElement = document.createElement("audio");
//  audioElement.src = "https://raw.githubusercontent.com/Metastruct/garrysmod-chatsounds/master/sound/chatsounds/autoadd/snoop_dogg/hold%20up%20wait.ogg";
//     $('#start').click(function(){
//         audioElement.play();
//     });
// }

$(document).ready(function() {
  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.5.207/pdf.worker.js';
  document.getElementById('file').onchange = function(event) {
    var currPage = 1; // Pages are 1-based, not 0-based
    var numPages = 0;
    var thePDF = null;

    var file = event.target.files[0];
    var fileReader = new FileReader();

    fileReader.onload = function() {

      var typedarray = new Uint8Array(this.result);
      console.log(typedarray);
      const loadingTask = pdfjsLib.getDocument(typedarray);

      loadingTask.promise.then(pdf => {
        thePDF = pdf;
        numPages = pdf.numPages;

          function getText(){
            var maxPages = numPages;
            var countPromises = []; // collecting all page promises

            for (var j = 1; j <= maxPages; j++) {
              var page = pdf.getPage(j);

              var txt = "";
              countPromises.push(page.then(function(page) { // add page promise
                var textContent = page.getTextContent();
                return textContent.then(function(text){ // return content promise
                  return text.items.map(function (s) { return s.str; }).join(''); // value page text 
                });
              }));
            }
            // Wait for all pages and join text
            return Promise.all(countPromises).then(function (texts) {
              ret = {"text": texts}
              return (ret);
            });
          }

          let userToken = getText();
          userToken.then(function(result) {
             console.log(result) // =============== Retrieve data from here ===============
            var token = $('input[name="csrfmiddlewaretoken"]').attr('value')
            $.ajaxSetup({
                beforeSend: function(xhr) {
                    xhr.setRequestHeader('Csrf-Token', token);
                }
            });
            $.ajax({
              type: "POST",
              data: result,
              url: $("#upload-url").attr("data-url"),
              headers: {
                    'X-CSRFToken': token 
               },
              success: function (response) {
                // if ("worked" == "true") {
                //   console.log("pog")
                // }
                // else {
                //   console.log("bog")
                // }
                console.log(response)
                console.log(String($("#url").attr("data-url")));
                
              },
              error: function (response) {
                console.log(response)
                // console.log(response.responseJSON.errors)
              }
            });
            return false;
          })

        pdf.getPage(1).then(morepages);

        function morepages(page){

          // var textContent = page.getTextContent();
          // var allText = textContent.then(function(text){ // return content promise
          //   console.log(text.items.map(function (s) { return s.str; }).join('')); // value page text 
          // });

          var scale = 1;
          var viewport = page.getViewport({
            scale: scale
          });

          var canvas = document.createElement( "canvas" );
          // var canvas = document.getElementById('pdfCanvas');
          var context = canvas.getContext('2d');
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          // Render PDF page into canvas context
          var renderContext = {
            canvasContext: context,
            viewport: viewport
          };
          var renderTask = page.render(renderContext);
          renderTask.promise.then(function() {
            console.log('Page rendered');
          });

          //Add it to the web page
          document.getElementById("pane").appendChild(canvas);
          //Move to next page
          currPage++;
          if ( thePDF !== null && currPage <= numPages )
          {
            thePDF.getPage( currPage ).then( morepages );
          }
        }
      });
    }
    fileReader.readAsArrayBuffer(file);
  }
});