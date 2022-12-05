let allPokemon = [];
let tableauFin = [];
const searchInput = document.querySelector('.recherche-poke input');
const listePoke = document.querySelector('.liste-poke');
const chargement = document.querySelector('.loader');

const types = {
    grass: '#78c850',
	ground: '#E2BF65',
	dragon: '#6F35FC',
	fire: '#F58271',
	electric: '#F7D02C',
	fairy: '#D685AD',
	poison: '#966DA3',
	bug: '#B3F594',
	water: '#6390F0',
	normal: '#D9D5D8',
	psychic: '#F95587',
	flying: '#A98FF3',
	fighting: '#C25956',
    rock: '#B6A136',
    ghost: '#735797',
    ice: '#96D9D6',
    steel: '#AFAFAF',
    dark: '#671200',
};

function fetchPokemonBase() {
    // Pour limiter le nb de pokemons, ajouter 'limit=X' avec X qui est la limite
    fetch("https://pokeapi.co/api/v2/pokemon?limit=250")
    .then(reponse => reponse.json())
    .then((allPoke) => {
        // console.log(allPoke);
        allPoke.results.forEach((pokemon) => {
            fetchPokemonComplet(pokemon);
        })
    })
}
fetchPokemonBase();


function fetchPokemonComplet(pokemon) {

    let objPokemonFull = {};
    let url = pokemon.url;
    let nameP = pokemon.name;

    fetch(url)
    .then(reponse => reponse.json())
    .then((pokeData) => {
        // console.log(pokeData);

        objPokemonFull.pic = pokeData.sprites.front_default;
        objPokemonFull.type = pokeData.types[0].type.name;
        objPokemonFull.id = pokeData.id;

        fetch(`https://pokeapi.co/api/v2/pokemon-species/${nameP}`)
        .then(reponse => reponse.json())
        .then((pokeData) => {
            // console.log(pokeData);

            objPokemonFull.name = pokeData.names[4].name;   // Nom du pokemon en FR
            allPokemon.push(objPokemonFull);

            if(allPokemon.length === 250) {
                // console.log(allPokemon);

                tableauFin = allPokemon.sort((a,b) => {
                    return a.id - b.id;
                }).slice(0,21);     // Avoir les 21 premiers pokemons
                // console.log(tableauFin);
                
                createCard(tableauFin);
                chargement.style.display = "none";
            }
        })
    })
}

// Création des cartes

function createCard(arr) {
    
    for(let i = 0; i < arr.length; i++) {

        const carte = document.createElement('li');
        let couleur = types[arr[i].type];
        carte.style.background = couleur;
        const txtCarte = document.createElement('h5');
        txtCarte.innerText = arr[i].name;
        const idCarte = document.createElement('p');
        idCarte.innerText = `ID #${arr[i].id}`;
        const imgCarte = document.createElement('img');
        imgCarte.src = arr[i].pic;

        carte.appendChild(imgCarte);
        carte.appendChild(txtCarte);
        carte.appendChild(idCarte);

        listePoke.appendChild(carte);
    }
}

// Scroll infini -> afficher la suite des pokemons quand on scroll

window.addEventListener('scroll', () => {
    
    const {scrollTop, scrollHeight, clientHeight} = document.documentElement;
    // ScrollTop = scroll depuis le top
    // ScrollHeight = scroll total
    // clientHeight = hauteur de la fenetre, partie visible

    if (clientHeight + scrollTop >= scrollHeight - 20) {
        addPoke(6);
    }
})

let index = 21; // NB de pokemon affiché sur l'ecran

function addPoke(nb) {
    
    if (index > 250) {
        return;
    }
    const arrToAdd = allPokemon.slice(index, index + nb);
    createCard(arrToAdd);
    index += nb;
}

// Recherche


/*  Utilisation du button 'Rechercher' (réactiver le boutton dans le html)

const formRecherche = document.querySelector('form');
formRecherche.addEventListener('submit', (e) => {
    e.preventDefault();     // Empêche le refresh de la page
    recherche();
})

*/


searchInput.addEventListener('keyup', recherche);

function recherche() {
    
    if (index < 250) {
        addPoke(229);
    }

    let filter, allLi, titleValue, allTitle;
    filter = searchInput.value.toUpperCase();
    allLi = document.querySelectorAll('li');
    allTitle = document.querySelectorAll('li > h5');    // Selectionne tous les h5 situés dans le li

    for (i = 0; i < allLi.length ; i++) {

        titleValue = allTitle[i].innerText;

        if (titleValue.toUpperCase().indexOf(filter) > -1) {
            allLi[i].style.display = "flex";
        }
        else {
            allLi[i].style.display = "none";
        }
    }

}


// Animation Input

searchInput.addEventListener('input', function(e) {

    if(e.target.value !== "") {
        e.target.parentNode.classList.add('active-input');
    }
    else if(e.target.value === "") {
        e.target.parentNode.classList.remove('active-input'); 
    }
})