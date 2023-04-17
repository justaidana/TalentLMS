const apiKey = "";

/*
const key_words = [
  ['libros de jugadas','impulsados por la gente','personas impulsadas'], // spanish
  ['livre de jeu','personnes alimentées'],  // franch
  ['livro de cantadas','alimentado por pessoas'], // portuguese
  ['people driven','people powered'] //english
];
*/
var languageSelect = document.getElementById("language-select");
languageSelect.addEventListener("change", function() {
  var targetLanguage = languageSelect.value;
  translateText(targetLanguage);    
});



function fast_replace(statement,targetLanguage){
  if(targetLanguage == 'es'){
  	statement = statement.replaceAll('libros de jugadas','playbook');
    statement = statement.replaceAll('personas impulsadas','people powered');
    statement = statement.replaceAll('impulsados por la gente','people powered');
  }
  else if(targetLanguage == 'pt'){
  	statement = statement.replaceAll('livro de cantadas','playbook');
    statement = statement.replaceAll('alimentado por pessoas','people powered');          
  }
  else if(targetLanguage == 'fr'){
  	statement = statement.replaceAll('livre de jeu','playbook');
    statement = statement.replaceAll('personnes alimentées','people powered'); 
  }
  else{
  	statement = statement.replaceAll('people driven','playbook');
  }
  return statement;
}





/*
gapi.load('client', function() {
  gapi.client.init({
    apiKey: apiKey
  });
});

function translatePDF(pdfUrl, targetLanguage, callback) {
  gapi.client.load('language', 'v1', function() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', pdfUrl);
    xhr.responseType = 'arraybuffer';
    xhr.onload = function() {
      var pdfData = new Uint8Array(xhr.response);
      var data = {
        q: pdfData,
        target: targetLanguage,
        mimeType: 'application/pdf'
      };
      gapi.client.language.documents.translate({
        resource: data
      }).execute(function(response) {
        if (response && response.translations && response.translations.length > 0) {
          var translatedPDFData = new Uint8Array(atob(response.translations[0].translatedText).split('').map(function(c) {
            return c.charCodeAt(0);
          }));
          callback(translatedPDFData);
        }
      });
    };
    xhr.send();
  });
}

var iframe = document.querySelector('iframe');
var pdfUrl = iframe.src;
var targetLanguage  = document.getElementById("language-select");

translatePDF(pdfUrl, targetLanguage, function(translatedPDFData) {
  var blob = new Blob([translatedPDFData], {
    type: 'application/pdf'
  });
  var newUrl = URL.createObjectURL(blob);
  iframe.src = newUrl;
});

*/


function translateText(targetLanguage) {
  var paragraphs = document.querySelectorAll("p, h1, h2");

  paragraphs.forEach(function(paragraph) {
    var text = paragraph.textContent; 
    
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "https://translation.googleapis.com/language/translate/v2");
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onload = function() {
      if (xhr.status === 200) {
        var response = JSON.parse(xhr.responseText);
        var parser = new DOMParser();
        var translatedText = parser.parseFromString(response.data.translations[0].translatedText, 'text/html').body.textContent;

        // Check if the translated text contains HTML markup
        if (response.data.translations[0].translatedText !== translatedText) {
          // If yes, set innerHTML instead of textContent to preserve the HTML markup
          paragraph.innerHTML = fast_replace(translatedText, targetLanguage);
        } else {
          // If not, set textContent as usual
          paragraph.textContent = fast_replace(translatedText, targetLanguage);
        }
      }
    };
    xhr.send("q=" + text + "&target=" + targetLanguage + "&key=" + apiKey);
  });
}



document.addEventListener('DOMContentLoaded', () => {
// Create the first script tag
var script1 = document.createElement('script');
script1.type = 'text/javascript';
script1.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';

// Create the second script tag
var script2 = document.createElement('script');
script2.type = 'text/javascript';
script2.src = 'https://www.google.com/jsapi?key=AIzaSyCHC-6YEDE5pS6zgiLL2smJ0mnuIqjFSpQ';

// Append both script tags to the head section of the document
document.head.appendChild(script1);
document.head.appendChild(script2);

document.querySelector('#google_translate_element a').href = '';
});

function googleTranslateElementInit() {

  new google.translate.TranslateElement({pageLanguage: 'en', includedLanguages: 'es,pt,fr,de', layout: google.translate.TranslateElement.InlineLayout.SIMPLE, autoDisplay: false}, 'google_translate_element');
}

/*
 
  const pdfUrl = document.getElementById("pdfUrl").getAttribute("src");
  
  
  select.addEventListener("change", () => {
    const targetLang = select.value;
    const apiUrl = "https://translation.googleapis.com/language/translate/v2/documents:translateText?key=" + apiKey;
    const requestData = JSON.stringify({
      q: pdfUrl,
      target: targetLang,
      format: "pdf"
    });
    
    fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: requestData
    })
    .then(response => response.json())
    .then(data => {
      const translatedUrl = data.translations[0].translatedText;
      document.getElementById("pdfUrl").setAttribute("src", translatedUrl);
    })
    .catch(error => console.error(error));
  });

*/