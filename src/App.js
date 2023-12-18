// Aqui se ubica la importacion de los módulos y estilos
import React, { useState } from 'react';
import Harry from './assets/img/pid.jpg';
import elias from './assets/img/neg.jpg';
import rincon from './assets/img/libroo.jpg';
import { BrowserRouter as Router, Link, Route, Routes } from 'react-router-dom';
import 'bulma/css/bulma.min.css'; // Estilos de Bulma para el diseño
import './App.css'; // Estilos personalizados

// Componente para mostrar la información de cada producto en forma de tarjeta
const ProductCard = ({ nombre, descripcion, precio, enCarrito, cantidad, agregarAlCarrito, quitarDelCarrito, imagen }) => (
  <div className="column is-one-third">
    <div className="card">
      <div className="card-content">
        <p className="title is-4">{nombre}</p>
        <img src={imagen} alt={nombre} style={{ width: '100%', marginBottom: '10px' }} />
        <p>{descripcion}</p>
        <p className="subtitle is-6">${precio}</p>
        <div>
          {/* Botones para agregar y quitar productos del carrito */}
          <button
            className={`button is-primary ${enCarrito ? 'disabled' : ''}`}
            onClick={agregarAlCarrito}
          >
            Agregar al carrito
          </button>
          <button
            className={`button is-danger ${!enCarrito ? 'disabled' : ''}`}
            onClick={quitarDelCarrito}
          >
            Quitar del carrito
          </button>
          {enCarrito && (
            <span style={{ marginLeft: '10px' }}>Cantidad: {cantidad}</span>
          )}
        </div>
      </div>
    </div>
  </div>
);

/*Componente para la sección de pago*/
const Pago = ({ carrito, setCarrito, setPagoRealizado }) => {
  const [metodoPago, setMetodoPago] = useState('');
  const [datosTarjeta, setDatosTarjeta] = useState({
    numero: '',
    nombre: '',
    fecha: '',
    cvv: '',
  });

  /*Manejadores de eventos para cambios en el método de pago y datos de tarjeta*/
  const handleMetodoPagoChange = (event) => {
    setMetodoPago(event.target.value);
  };

  const handleDatosTarjetaChange = (event) => {
    const { name, value } = event.target;
    setDatosTarjeta((prevDatosTarjeta) => ({
      ...prevDatosTarjeta,
      [name]: value,
    }));
  };

  /*Esta es la fununción para realizar el pago*/
  const handleRealizarPago = () => {
    if (metodoPago === 'tarjeta') {
      /*Aqui se hacen Validar los datos de la tarjeta*/
      if (datosTarjeta.numero && datosTarjeta.nombre && datosTarjeta.fecha && datosTarjeta.cvv) {
        /*Realizar el pago con tarjeta*/
        setPagoRealizado(true);
        setCarrito([]);
      } else {
        alert('Por favor, complete todos los campos de la tarjeta.');
      }
    } else if (metodoPago === 'efectivo') {
      /*Realizar el pago en efectivo*/
      alert('Visite una sucursal de OXXO, Aurrera o Farmacia Guadalajara para realizar el pago en efectivo.');
      setPagoRealizado(true);
      setCarrito([]);
    } else {
      alert('Seleccione un método de pago.');
    }
  };

  /*Interfaz de usuario para la sección de pago*/
  return (
    <div style={{ textAlign: 'center', fontSize: '1.5em' }}>
      <h2>Información de Pago</h2>
      <p>Seleccione su método de pago:</p>
      <label>
        <input type="radio" name="metodoPago" value="tarjeta" onChange={handleMetodoPagoChange} />
        Tarjeta de Crédito
      </label>
      <label style={{ marginLeft: '10px' }}>
        <input type="radio" name="metodoPago" value="efectivo" onChange={handleMetodoPagoChange} />
        Efectivo
      </label>
      {metodoPago === 'tarjeta' && (
        <div>
          <p>Ingrese los detalles de la tarjeta:</p>
          <label>
            Número de tarjeta:
            <input type="text" name="numero" value={datosTarjeta.numero} onChange={handleDatosTarjetaChange} />
          </label>
          <label>
            Nombre en la tarjeta:
            <input type="text" name="nombre" value={datosTarjeta.nombre} onChange={handleDatosTarjetaChange} />
          </label>
          <label>
            Fecha de vencimiento:
            <input type="text" name="fecha" value={datosTarjeta.fecha} onChange={handleDatosTarjetaChange} />
          </label>
          <label>
            CVV:
            <input type="text" name="cvv" value={datosTarjeta.cvv} onChange={handleDatosTarjetaChange} />
          </label>
        </div>
      )}
      {/* Botón para realizar el pago */}
      <button onClick={handleRealizarPago}>Realizar Pago</button>
    </div>
  );
};

/*Componente para la sección de productos*/
const Productos = ({ products }) => {
  const [carrito, setCarrito] = useState([]);
  const [pagoRealizado, setPagoRealizado] = useState(false);

  /*Funciones para agregar y quitar productos del carrito*/
  const agregarAlCarrito = (producto) => {
    const existente = carrito.find((p) => p.nombre === producto.nombre);

    if (existente) {
      const nuevoCarrito = carrito.map((p) =>
        p.nombre === producto.nombre ? { ...p, cantidad: p.cantidad + 1 } : p
      );
      setCarrito(nuevoCarrito);
    } else {
      setCarrito([...carrito, { ...producto, cantidad: 1 }]);
    }
  };

  const quitarDelCarrito = (producto) => {
    const nuevoCarrito = carrito.filter((p) => p.nombre !== producto.nombre);
    setCarrito(nuevoCarrito);
  };

  /*nterfaz de usuario para la sección de productos*/
  return (
    <section className="section">
      <div className="container">
        {!pagoRealizado ? (
          <div>
            <div className="columns is-multiline">
              {products.map((product, index) => (
                <ProductCard
                  key={index}
                  {...product}
                  enCarrito={carrito.some((p) => p.nombre === product.nombre)}
                  cantidad={carrito.find((p) => p.nombre === product.nombre)?.cantidad || 0}
                  agregarAlCarrito={() => agregarAlCarrito(product)}
                  quitarDelCarrito={() => quitarDelCarrito(product)}
                />
              ))}
            </div>
            {/* Componente para la sección de pago */}
            <Pago carrito={carrito} setCarrito={setCarrito} setPagoRealizado={setPagoRealizado} />
          </div>
        ) : (
          <div>
            <h2>Pago Realizado</h2>
            <p>¡Gracias por su compra!</p>
          </div>
        )}
      </div>
    </section>
  );
};

/*Componente para la página de inicio (de las mas importantes)*/
const Home = () => (
  <div style={{ textAlign: 'center', fontSize: '1.5em', backgroundColor: '#7e063e', color: '#ffffff' }}>
    <h1>¡Bienvenido a: "Tu rincón seguro"!</h1>
    <p>Este es tu refugio de lectura principal donde cada mundo te espera.</p>
    <p>Tu mundo de exploración a elegir sin fin.</p>
    <p>Cada uno de ellos tiene una historia por contarle así que disfrútelo.</p>
    <p>NO NOS HACEMOS RESPONSABLES DE TU ADICCIÓN.</p>
    <img src={rincon} alt="Mi rincón seguro" />

    {/* promoción destacable */}
    <div style={{ border: '2px solid #FFD700', padding: '2px', margin: '3px' }}>
      <h2>¡Promoción!</h2>
      <p>Nombre: Harry Potter y la piedra filosofal (Harry Potter 1)</p>
      <p>Autor: J. K. Rowling</p>
      <p>Precio: $199.99 (¡En oferta!)</p>
      <img src={Harry} alt="Harry Potter" />
    </div>

    {/* promoción destacable 2 */}
    <div style={{ border: '2px solid #FFD700', padding: '10px', margin: '10px' }}>
      <h2>¡Promoción!</h2>
      <p>Nombre: El emprendedor</p>
      <p>Autor: Arturo Elias Ayub </p>
      <p>Precio: $89.99 (¡Oferta especial!)</p>
      <img src={elias} alt="El emprendedor" />
    </div>
  </div>
);

/* componente principal que define la estructura de la aplicación*/
const App = () => {
  const products = [
    { nombre: 'Bajo la misma estrella', descripcion: 'John Green', precio: '330.00', imagen: '/estrella.jpg' },
    { nombre: 'ESO (IT)', descripcion: 'Stephen King.', precio: '486.00', imagen: '/it.jpg' },
    { nombre: 'Mi viaje sin ti', descripcion: 'Alejandro Sequera Pinto', precio: '410.00', imagen: '/sinti.webp' },
    { nombre: 'The End of the Fucking World', descripcion: 'Charles Forsman', precio: '459.00', imagen: '/fu.jpg' },
    { nombre: 'Eleanor & Park', descripcion: 'Rainbow Rowell', precio: '300.00', imagen: '/es.jpg' },
    { nombre: 'Violet & Finch', descripcion: 'Jennifer Niven', precio: '199.99', imagen: '/fin.jpg' }, 
  ];

  /*Enrutador que gestiona las rutas de la aplicación*/
  return (
    <Router>
      <div className="App">
        {/* Barra de navegación */}
        <nav>
          <ul>
            <li><Link to="/">Inicio</Link></li>
            <li><Link to="/productos">Productos</Link></li>
          </ul>
        </nav>

        {/* Definición de rutas y sus componentes asociados */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/productos" element={<Productos products={products} />} />
        </Routes>
      </div>
    </Router>
  );
};

/*Exportar el componente principal para su uso en otras partes de la aplicación*/
export default App;
