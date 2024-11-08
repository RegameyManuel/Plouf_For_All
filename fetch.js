
fetch('sites.json')
    .then(response => response.json())
    .then(sites => {
        const ul = document.getElementById('liste-sites');
        sites.forEach(site => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = site.url;
            a.textContent = site.nom;
            li.appendChild(a);
            ul.appendChild(li);
        });
    })
    .catch(error => console.error('Erreur lors du chargement des sites:', error));