const cantidad = 20;
let index = 1;
let carrito = [];

const url = `./json/carrito.json`

const btnCart = document.querySelector('.container-cart-icon')
const containerCartProducts = document.querySelector('.container-cart-products')
const botonComprar = document.querySelector("#carrito-acciones-comprar");
btnCart.addEventListener('click', () => {
containerCartProducts.classList.toggle('hidden-cart')
})


fetch(url)
  .then(response => response.json())
  .then(data => {
    carrito = data;
    mostrarProducto(carrito);
});

const contenedorProducto = document.getElementById('contenedorProducto');
function mostrarProducto() {
  const startIndex = (index - 1) * cantidad;
  const endIndex = startIndex + cantidad;
  const indexData = carrito.slice(startIndex, endIndex);
  contenedorProducto.innerHTML = '';   

  indexData.forEach(producto => {    
    const card = document.createElement('div');
    card.classList.add("producto");
    card.innerHTML = `
                            <div class="card" style="width: 16rem;">
                            <img src="${producto.img}" class="card-img-top" alt="...">
                            <div class="card-body">
                            <h5 class="card-title">${producto.nombre}</h5>
                            <h5 class="card-title">${producto.capitulo}</h5>
                            <p class="card-text">$ ${producto.precio}</p>
                            <a href="#" class="btn btn-primary" width="100%" id="button${producto.id}">AGREGAR AL CARRITO</a>
                            </div>
                            </div>
                        `
    contenedorProducto.appendChild(card);

    const boton = document.getElementById(`button${producto.id}`);
        boton.addEventListener("click", (e) => {
          e.preventDefault();
            agregarAlCarrito(producto.id);    
  }) 
  
})}

let productosEnCarrito;


let productosEnCarritoLS = localStorage.getItem("productosEnCarrito");

if (productosEnCarritoLS) {
  productosEnCarrito = JSON.parse(productosEnCarritoLS);
} else {
  productosEnCarrito = [];
}

function agregarAlCarrito(id) {
  Toastify({
    text: "Producto agregado",
    duration: 500,
    close: true,
    gravity: "top",
    position: "right",
    stopOnFocus: true,
    style: {
      background: "linear-gradient(to right, #3377FF, #33FFE0)",
      borderRadius: "2rem",
      textTransform: "uppercase",
      fontSize: ".75rem"
    },
    offset: {
        x: '1.5rem',
        y: '1.5rem'
      },
    onClick: function(){} 
  }).showToast();
  const productoAgregado = carrito.find(producto => producto.id === id);
  if(productosEnCarrito.some(producto => producto.id === id)) {
      const indicio = productosEnCarrito.findIndex(producto => producto.id === id);
      productosEnCarrito[indicio].cantidad++;
      cargarProductosCarrito(productosEnCarrito)
  } else {
      productoAgregado.cantidad;
      productosEnCarrito.push(productoAgregado);
      cargarProductosCarrito(productosEnCarrito)
  }
  calcularTotal();
  localStorage.setItem("productosEnCarrito", JSON.stringify(productosEnCarrito));
}
  
  const contenedorCarritoProductos = document.getElementById("infoCart");
  const verCarrito = document.getElementById("containerMostrar");

  verCarrito.addEventListener("click", () => {
    cargarProductosCarrito();
})
  
  function cargarProductosCarrito() {
   if (productosEnCarrito.length>0) { 
      contenedorCarritoProductos.innerHTML = "";
      vaciarCarrito.disabled= false;
      botonComprar.disabled=false;       
        productosEnCarrito.forEach(producto => {   
            const div = document.createElement("div");
            div.classList.add("carrito-producto");
            div.innerHTML = `
                <img class="carrito-producto-imagen" src="${producto.img}" alt="${producto.nombre}">
                <div class="carrito-producto-titulo">
                    <small>Título</small>
                    <h4>${producto.nombre}</h4>
                </div>
                <div class="carrito-producto-capitulo">
                <small>Capitulo</small>
                <p>${producto.capitulo}<p>
                </div>
                <div class="carrito-producto-cantidad">
                    <small>Cantidad</small>
                    <p>${producto.cantidad}</p>
                </div>
                <div class="carrito-producto-precio">
                    <small>Precio</small>
                    <p>$${producto.precio}</p>
                </div>
                <div class="carrito-producto-subtotal">
                    <small>Subtotal</small>
                    <p>$${producto.precio * producto.cantidad}</p>
                </div>
                <button class="carrito-producto-eliminar" type="button" id="eliminar${producto.id}"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle-fill" viewBox="0 0 16 16">
                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
              </svg></button>
            `;
    
            contenedorCarritoProductos.append(div);

        const boton = document.getElementById(`eliminar${producto.id}`);
        boton.addEventListener("click", (e) => {
        e.preventDefault();
        eliminarDelCarrito(producto.id);
        
        })
        
      })
      calcularTotal()
 }else{
  contenedorCarritoProductos.innerHTML=""
  vaciarCarrito.disabled=true
  botonComprar.disabled=true
  calcularTotal()
      } 
} 

const eliminarDelCarrito = (id) => {
  Toastify({
    text: "Producto eliminado",
    duration: 2000,
    close: true,
    gravity: "top",
    position: "right",
    stopOnFocus: true,
    style: {
      background: "linear-gradient(to right, #3377FF, #33FFE0)",
      borderRadius: "2rem",
      textTransform: "uppercase",
      fontSize: ".75rem"
    },
    offset: {
        x: '1.5rem',
        y: '1.5rem'
      },
    onClick: function(){} 
  }).showToast();
  const producto = productosEnCarrito.find(producto => producto.id === id);
  const indice = productosEnCarrito.indexOf(producto);
  productosEnCarrito.splice(indice, 1);
  cargarProductosCarrito();

  localStorage.setItem("productosEnCarrito", JSON.stringify(productosEnCarrito));
}

const total = document.getElementById("total");

const calcularTotal = () => {
  let totalCompra = 0; 
  productosEnCarrito.forEach(producto => {
        totalCompra += producto.precio * producto.cantidad;
    })
  total.innerHTML = `$${totalCompra}`;
}

const vaciarCarrito = document.getElementById("vaciarCarrito");

vaciarCarrito.addEventListener("click", () => {
    eliminarTodoElCarrito();
})

const eliminarTodoElCarrito = () => {Swal.fire({
  title: 'Estas seguro de borrar el carrito?',
  text: "Borraras lo que hay en el carrito!",
  icon: 'warning',
  showCancelButton: true,
  confirmButtonColor: '#3085d6',
  cancelButtonColor: '#d33',
  confirmButtonText: 'Si, estoy seguro!'
}).then((result) => {
  if (result.isConfirmed) {
    Swal.fire(
    'Su carrito ah sido borrado!',
    productosEnCarrito=[],    
    localStorage.clear(),
    cargarProductosCarrito(),
    )
  }
})}

botonComprar.addEventListener("click", comprarCarrito);
function comprarCarrito() {Swal.fire({
  title: 'Estas seguro de comprar el carrito?',
  text: "Compraras lo que hay en el carrito!",
  icon: 'warning',
  showCancelButton: true,
  confirmButtonColor: '#3085d6',
  cancelButtonColor: '#d33',
  confirmButtonText: 'Si, estoy seguro!'
}).then((result) => {
  if (result.isConfirmed) {
    Swal.fire(
    'Su carrito ah sido comprado!',
    productosEnCarrito=[],    
    localStorage.clear(),
    cargarProductosCarrito(),
    )
  }
})}

const prevButton = document.getElementById('prev-button');
const nextButton = document.getElementById('next-button');

prevButton.addEventListener('click', (e) => {
    e.preventDefault
  if (index > 1) {
    index--;
    mostrarProducto();
  }
});

nextButton.addEventListener('click', (e) => {
    e.preventDefault
  if (index * cantidad < carrito.length) {
    index++;
    mostrarProducto();
  }
});
