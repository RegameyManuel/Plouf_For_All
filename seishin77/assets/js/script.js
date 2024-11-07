document.addEventListener('DOMContentLoaded',
  function(evt){
    const querystring = new URLSearchParams(window.location.search);
    let myHtml = document.querySelector('html');
    let myLang;

    if(querystring.has('lang'))
      myLang = querystring.get('lang');
    else
      myLang = myHtml.getAttribute('lang') ?? 'en';

    if(typeof(projects) !== 'undefined')
      loadProjects();

    changeLanguage(myLang);
  }
);

function changeLanguage(myLang){
  let myHtml = document.querySelector('html');

  if(myLang != myHtml.getAttribute('lang'))
    myHtml.setAttribute('lang', myLang);

  document.querySelectorAll('body [lang]')
  .forEach(
    function(elt){
      if(elt.getAttribute('lang') != myLang)
        elt.style.display = 'none';
      else
        elt.style.display = '';
    }
  );

  document.querySelectorAll('body a[href]')
    .forEach(
      function(elt){
        let nUrl = elt.getAttribute('href');
        if(nUrl.indexOf('lang=') > -1)
          nUrl = nUrl.replace(/lang=[^&]+/, 'lang=' + myLang);
        else
          nUrl += '?lang=' + myLang;

        elt.setAttribute('href', nUrl);
      }
    );
}

function loadProjects(){
  for(let i = 0; i < projects.length; i++)
    addProject(projects[i]);
}

/*

  {
    "codename": "gpg", "ext":"jpg"
    "href":"gpg/index.html", "img":"assets/img/gpg.jpg", "date":"2024-11-07",
    "translations": {"en":"GPG : Example", "fr":"GPG : Exemple"}
  },

*/
function addProject(project){
  let footer;
  let tpl = document.querySelector('#project');
  let ntpl = tpl.content.cloneNode(true);

  ntpl.querySelector('a').setAttribute('href', project.codename + '/index.html');
  ntpl.querySelector('img').setAttribute('src', 'assets/img/' + project.codename + '.' + project.ext);
  ntpl.querySelector('span').appendChild(document.createTextNode(project.date));

  let title = ntpl.querySelector('div.w3-display-bottomleft');
  for(var i in project.translations){
    footer = document.createElement('footer');
    footer.setAttribute('lang', i);
    footer.appendChild(document.createTextNode(project.translations[i]));

    title.appendChild(footer);
  }

  document.querySelector('#presenter').appendChild(ntpl);
}
