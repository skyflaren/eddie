// $(document).ready(function() {
//  var audioElement = document.createElement("audio");
//  audioElement.src = "https://raw.githubusercontent.com/Metastruct/garrysmod-chatsounds/master/sound/chatsounds/autoadd/snoop_dogg/hold%20up%20wait.ogg";
//     $('#start').click(function(){
//         audioElement.play();
//     });
// }
let obs = [];


$(document).ready(function() {
  console.log("asdfsd")
 
  

//   let callback = (entries, observer) => {
//     entries.forEach(entry => {
//       // Each entry describes an intersection change for one observed
//       // target element:
//       //   entry.boundingClientRect
//       //   entry.intersectionRatio
//       //   entry.intersectionRect
//       //   entry.isIntersecting
//       //   entry.rootBounds
//       //   entry.target
//       //   entry.time
//       console.log(this +" pog");
//     });
//   };
// 
//   let observer = new IntersectionObserver(callback, options);
// 
//   $("canvas").each(() => {
//     observer.observe(this);
//   });


//   intersectionCallback(entries) => {
//     entries.forEach(entry => {
//       if (entry.isIntersecting) {
//         let elem = entry.target;
// 
//         if (entry.intersectionRatio >= 0.75) {
//           intersectionCounter++;
//         }
//       }
//     });
//   }

  // $(canvas).each(() => {
  //   let options = {
  //     root: this,
  //     rootMargin: '0px',
  //     threshold: 1.0
  //   }

  //   var observer = new IntersectionObserver(function(entries) {
  //   // isIntersecting is true when element and viewport are overlapping
  //   // isIntersecting is false when element and viewport don't overlap
  //   if(entries[0].isIntersecting === true)
  //     console.log('Element has just become visible in screen');
  // }, { threshold: [0] });
  // })

  

// observer.observe(document.querySelector("#main-container"));


  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.5.207/pdf.worker.js';
  document.getElementById('file').onchange = function(event) {
    
    var currPage = 1; // Pages are 1-based, not 0-based
    var numPages = 0;
    var thePDF = null;
    var x = 0;
    var loaded = []
    var allTextSaved

    var token = $('input[name="csrfmiddlewaretoken"]').attr('value')
    $.ajaxSetup({
        beforeSend: function(xhr) {
            xhr.setRequestHeader('Csrf-Token', token);
        }
    });

    var file = event.target.files[0];
    var fileReader = new FileReader();

    $('#upload').css("display","none");
    $('#music-container').css("visibility","visible");
    $('#top-left').css("visibility","visible");
    $('#pdf-title').html(file.name);

    fileReader.onload = function() {

      var typedarray = new Uint8Array(this.result);
      // console.log(typedarray);
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
              return JSON.stringify(texts);
            });
          }

          let userToken = getText();
          userToken.then(function(result) {
            // console.log(result) // =============== Retrieve data from here ===============
            
            $.ajax({
              type: "POST",
              data: {"text": result},
              url: $("#upload-url").attr("data-url"),
              headers: {
                    'X-CSRFToken': token 
               },
              success: function (response) {
                allTextSaved = result;
                // loadpage(1);
                // if(numPages >= 2){ loadpage(2); }
                // if(numPages >= 3){ loadpage(3); }
              },
              error: function (response) {
                // console.log(response)
                console.log(response.responseJSON.errors)
              }
            });
            return false;
            
          })

        pdf.getPage(1).then(morepages);


        function loadpage(num){
          console.log("WOWZ")
          $.ajax({
            type: "POST",
            data: {"page": String(num), "text": allTextSaved},
            url: $("#page-url").attr("data-url"),
            headers: {
                  'X-CSRFToken': token 
             },
            success: function (response) {
              loaded.push({
                  key: String(num),
                  value: "true"
              });
              var ind = parseInt(response.result[0]);
              console.log(ind);
              themeIndex = ind;
              console.log(response)
            },
            error: function (response) {
              console.log(response)
              // console.log(response.responseJSON.errors)
            }
          });
        }



        function morepages(page){
          x = x+1
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

          // var pageSize = $("canvas").get(0).getBoundingClientRect().height;

          // Render PDF page into canvas context
          var renderContext = {
            canvasContext: context,
            viewport: viewport
          };
          var renderTask = page.render(renderContext);
          renderTask.promise.then(function() {
            // console.log('Page rendered');
          });

          //Add it to the web page
          document.getElementById("pane").appendChild(canvas);
          //Move to next page
          currPage++;
          if ( thePDF !== null && currPage <= numPages )
          {
            thePDF.getPage( currPage ).then( morepages );
          }



          // console.log(document.getElementsByTagName("canvas"))
          // $("canvas").each(() => {
          // console.log("wong")
          canvas.setAttribute("id", String(x));
          // window.addEventListener("load", (event) => {
            // console.log("pog")
            createObserver();
          // }, false);

          function createObserver() {
            let observer;

            let options = {
              root: null,
              rootMargin: "0px",
              threshold: "1"
            };

            observer = new IntersectionObserver((entries, observer) => {
              entries.forEach((entry) => {
                
                if(entry.isIntersecting && loaded[canvas.id] != "true"){
                  console.log(canvas.id);
                  loadpage(canvas.id);
                  $("#page-num").html(String(canvas.id) + "/" + numPages);
                }
              });
            }, {threshold: 0.5});

            observer.observe(canvas);
            // console.log("mog")
            obs.push(observer)
          }





        }
      });
    }
    fileReader.readAsArrayBuffer(file);
  }
});