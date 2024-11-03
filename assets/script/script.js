const grid = document.querySelector('.grid');
const items = Array.from(grid.children);
items.sort(() => Math.random() - 0.5);
items.forEach(item => grid.appendChild(item));

// On Initialise Masonry
let msnry = new Masonry(grid, {
    itemSelector: '.grid-item',
    columnWidth: 200,
    gutter: 10
});