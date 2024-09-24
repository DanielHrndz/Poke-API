const pokemonForm = document.forms['pokemon-form'];
const results = document.querySelector('.pokemon-list');

let isEditing = false;
let currentEditingItem = null;

const createResult = (name, imageUrl) => {
    const li = document.createElement('li');

    const span = document.createElement('span');
    span.innerText = name;

    const img = document.createElement('img');
    img.src = imageUrl;
    img.alt = name;
    img.width = 100;

    const editBtn = document.createElement('button');
    editBtn.innerText = 'Edit';
    editBtn.classList.add('edit');
    editBtn.addEventListener('click', () => enterEditMode(li, span));

    const deleteBtn = document.createElement('button');
    deleteBtn.innerText = 'Delete';
    deleteBtn.classList.add('delete');
    deleteBtn.addEventListener('click', () => deletePokemonItem(li));

    li.appendChild(img);
    li.appendChild(span);
    li.appendChild(editBtn);
    li.appendChild(deleteBtn);

    return li;
};

const addPokemonItem = (name, imageUrl) => {
    const newPokemon = createResult(name, imageUrl);
    results.appendChild(newPokemon);
};

const enterEditMode = (li, span) => {
    document.getElementById('pokemon-name').value = span.innerText;
    isEditing = true;
    currentEditingItem = { li, span };
    pokemonForm.querySelector('input[type="submit"]').value = 'Update Pokémon';
};

const updatePokemonItem = (name, imageUrl) => {
    currentEditingItem.span.innerText = name;
    currentEditingItem.li.querySelector('img').src = imageUrl;
    resetForm();
};

const resetForm = () => {
    document.getElementById('pokemon-name').value = '';
    isEditing = false;
    currentEditingItem = null;
    pokemonForm.querySelector('input[type="submit"]').value = 'Add Pokémon';
};

const deletePokemonItem = (li) => {
    if (confirm('Are you sure you want to delete this Pokémon?')) {
        li.remove();
    }
};

const fetchPokemonData = async (name) => {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`);
        const data = await response.json();
        return { name: capitalizeFirstLetter(data.name), imageUrl: data.sprites.front_default };
    } catch (error) {
        alert('Pokémon not found. Please try again.');
        return null;
    }
};

pokemonForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const name = pokemonForm.elements['pokemon-name'].value;

    if (name.trim() !== '') {
        const pokemonData = await fetchPokemonData(name);
        if (pokemonData) {
            if (isEditing) {
                updatePokemonItem(pokemonData.name, pokemonData.imageUrl);
            } else {
                addPokemonItem(pokemonData.name, pokemonData.imageUrl);
            }
            resetForm();
        }
    } else {
        alert('Please enter a Pokémon name.');
    }
});

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};
