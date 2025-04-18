const { subscribe } = require('../events/emitter');

subscribe('cart-updates', (event) => {
    console.log('Producto agregado al carrito:', event);
});

subscribe('cart-removals', (event) => {
    console.log('Producto eliminado del carrito:', event);
});