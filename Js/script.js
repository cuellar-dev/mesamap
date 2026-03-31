// 1. AMPLIAMOS LOS LÍMITES (Esto es vital para que el zoom no "salte")
// He expandido las coordenadas para que el motor tenga espacio de maniobra
var ahora,hora,minutos,mostrar;
const panel = document.getElementById('info-place');
const overlayPanel = document.getElementById('info-overlay');
const galeriaTrack = document.getElementById('track-galeria');
const contenedorGaleria = document.getElementById('galeria-info-place');
const imageLightbox = document.getElementById('image-lightbox');
const imageLightboxImg = document.getElementById('image-lightbox-img');
const imagenLocal = document.getElementById('imagen-local');
const leyendaBoton = document.getElementById('leyenda-boton');
const leyendaPanel = document.getElementById('leyenda-panel');
const leyendaLista = document.getElementById('leyenda-lista');
const cerrarLeyendaBoton = document.getElementById('cerrar-leyenda');

// Intersection Observer para Lazy Loading en Backgrounds
const lazyImageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const el = entry.target;
            const bg = el.getAttribute('data-bg-lazy');
            if (bg) {
                el.style.backgroundImage = bg;
                el.removeAttribute('data-bg-lazy');
            }
            observer.unobserve(el);
        }
    });
}, { rootMargin: '100px 0px', threshold: 0.05 });

const iconosSVG = {
    'restaurante': `<svg class="icono-pin" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#181818" stroke-width="1.80" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-utensils-icon lucide-utensils"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>`,
    'bar': `<svg class="icono-pin" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#181818" stroke-width="1.80" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-martini-icon lucide-martini"><path d="M8 22h8"/><path d="M12 11v11"/><path d="m19 3-7 8-7-8Z"/></svg>`,
    'cafeteria': `<svg class="icono-pin" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#181818" stroke-width="1.80" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-coffee-icon lucide-coffee"><path d="M10 2v2"/><path d="M14 2v2"/><path d="M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1"/><path d="M6 2v2"/></svg>`,
    'pizzeria': `<svg class="icono-pin" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#181818" stroke-width="1.80" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pizza-icon lucide-pizza"><path d="m12 14-1 1"/><path d="m13.75 18.25-1.25 1.42"/><path d="M17.775 5.654a15.68 15.68 0 0 0-12.121 12.12"/><path d="M18.8 9.3a1 1 0 0 0 2.1 7.7"/><path d="M21.964 20.732a1 1 0 0 1-1.232 1.232l-18-5a1 1 0 0 1-.695-1.232A19.68 19.68 0 0 1 15.732 2.037a1 1 0 0 1 1.232.695z"/></svg>`,
    'heladeria': `<svg class="icono-pin" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#181818" stroke-width="1.80" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-ice-cream-bowl-icon lucide-ice-cream-bowl"><path d="M12 17c5 0 8-2.69 8-6H4c0 3.31 3 6 8 6m-4 4h8m-4-3v3M5.14 11a3.5 3.5 0 1 1 6.71 0"/><path d="M12.14 11a3.5 3.5 0 1 1 6.71 0"/><path d="M15.5 6.5a3.5 3.5 0 1 0-7 0"/></svg>`
};

const estilosPorTipo = {
    'restaurante': { color: '#C5E1A5', nombre: 'Restaurante', descripcion: 'Comidas completas y menu variado' },
    'bar': { color: '#70D6FF', nombre: 'Bar', descripcion: 'Tragos, cocteleria y ambiente social' },
    'cafeteria': { color: '#FFB370', nombre: 'Cafeteria', descripcion: 'Cafe, meriendas y bocaditos' },
    'pizzeria': { color: '#FF7070', nombre: 'Pizzeria', descripcion: 'Especializada en pizzas y afines' },
    'heladeria': { color: '#FF97E1', nombre: 'Heladeria', descripcion: 'Helados y postres frios' }
};


let scrollYAntesDeBloquear = 0;
function bloquearScrollFondo() {
    scrollYAntesDeBloquear = window.scrollY || 0;
    document.body.classList.add('no-scroll');
    // Evita que el fondo se desplace (especialmente en móvil)
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollYAntesDeBloquear}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';
}
function desbloquearScrollFondo() {
    document.body.classList.remove('no-scroll');
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    document.body.style.width = '';
    window.scrollTo(0, scrollYAntesDeBloquear);
}
var bounds = [
    [-79.52000, 21.85000], // Suroeste (Más margen hacia abajo y la izquierda)
    [-79.35000, 21.99000]  // Noreste (Más margen hacia arriba y la derecha)
];
// 2. Inicialización del mapa
var map = new maplibregl.Map({
    container: 'map', 
    style: `https://api.maptiler.com/maps/dataviz-dark/style.json?key=XiGPaijIgDXb58PexR21`,
    
    // IMPORTANTE: Centro exacto donde está el parque
    center: [-79.443217, 21.927655], 
    
    zoom: 15.7,
    minZoom: 14,             // Bajamos un poco el minZoom para evitar conflictos
    maxZoom: 19,             // Subimos el maxZoom para mayor detalle
    maxBounds: bounds, 
    
    attributionControl: false,  
    bearing: 0,                 
    pitchWithRotate: false,     
    dragPitch: false,
    
    // FUERZA EL ZOOM AL CURSOR/DEDOS
    // Estas propiedades aseguran que el punto de contacto sea el eje
    scrollZoom: {
        around: 'center' // Puedes cambiarlo a 'null' para que use el cursor
    },
    touchZoomRotate: {
        around: 'center'
    },
    // CONFIGURACIÓN DE BLOQUEO VERTICAL (PITCH)
    pitch: 0,             // Empieza totalmente plano
    maxPitch: 0,          // BLOQUEO: No permite inclinarse ni un grado
    minPitch: 0,          // BLOQUEO: No permite inclinarse hacia el otro lado
    dragPitch: false,     // Desactiva el gesto de inclinar con el ratón/dedos
    pitchWithRotate: false// Asegura que al rotar no se active la inclinación
});

// 3. CORRECCIÓN DE REBOTE (IMPORTANTE)
// Esto soluciona el desplazamiento erróneo si el mapa está dentro de un div con márgenes
map.on('load', function() {
    map.resize();
});
//4 zona del input search
const tuerca = document.getElementById("tuerca");
const opciones = document.querySelectorAll(".leyend-slider");
const filtrosBoton = document.getElementById('filtros-boton');
const filtrosPanel = document.getElementById('filtros');
const mapaContenedor = document.getElementById('map');
let opcionesAbiertas = false;

let avisoSinResultadosFiltros = null;
if (mapaContenedor) {
    avisoSinResultadosFiltros = document.createElement('div');
    avisoSinResultadosFiltros.id = 'aviso-filtros-sin-resultados';
    avisoSinResultadosFiltros.textContent = 'Ups, parece que alguien ha puesto demasiados filtros.';
    avisoSinResultadosFiltros.setAttribute('aria-live', 'polite');
    mapaContenedor.appendChild(avisoSinResultadosFiltros);
}

function actualizarAvisoFiltrosSinResultados(cantidadVisibles) {
    if (!avisoSinResultadosFiltros) return;
    const hayFiltrosActivos = hayFiltroQueRestringeResultados();
    const mostrarAviso = hayFiltrosActivos && cantidadVisibles === 0;
    avisoSinResultadosFiltros.classList.toggle('visible', mostrarAviso);
}

function cerrarFiltros() {
    if (!filtrosPanel) return;
    filtrosPanel.classList.remove('filtros-visible');
    filtrosPanel.setAttribute('aria-hidden', 'true');
    if (filtrosBoton) filtrosBoton.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('no-scroll-filtros');
    desbloquearScrollFondo();
}

function abrirFiltros() {
    if (!filtrosPanel) return;
    filtrosPanel.scrollTop = 0;
    filtrosPanel.classList.add('filtros-visible');
    filtrosPanel.setAttribute('aria-hidden', 'false');
    if (filtrosBoton) filtrosBoton.setAttribute('aria-expanded', 'true');
    bloquearScrollFondo();
}

function alternarFiltros() {
    if (!filtrosPanel) return;
    const estaVisible = filtrosPanel.classList.contains('filtros-visible');
    if (estaVisible) {
        cerrarFiltros();
    } else {
        abrirFiltros();
    }
}

function abrirLeyenda() {
    if (!leyendaPanel) return;
    leyendaPanel.classList.add('active');
    leyendaPanel.setAttribute('aria-hidden', 'false');
    if (leyendaBoton) leyendaBoton.setAttribute('aria-expanded', 'true');
    bloquearScrollFondo();
}

function cerrarLeyenda() {
    if (!leyendaPanel) return;
    leyendaPanel.classList.remove('active');
    leyendaPanel.setAttribute('aria-hidden', 'true');
    if (leyendaBoton) leyendaBoton.setAttribute('aria-expanded', 'false');
    desbloquearScrollFondo();

}

function alternarLeyenda() {
    if (!leyendaPanel) return;
    const estaVisible = leyendaPanel.classList.contains('active');
    if (estaVisible) {
        cerrarLeyenda();
    } else {
        abrirLeyenda();
    }
}

function renderizarLeyenda() {
    if (!leyendaLista) return;
    leyendaLista.innerHTML = '';

    Object.entries(estilosPorTipo).forEach(([tipo, config]) => {
        const item = document.createElement('li');
        item.className = 'leyenda-item';

        const icono = document.createElement('span');
        icono.className = 'leyenda-icono';
        icono.style.backgroundColor = config.color;
        icono.innerHTML = iconosSVG[tipo] || '';

        const texto = document.createElement('div');
        texto.className = 'leyenda-texto';
        texto.innerHTML = `<strong>${config.nombre}</strong><span>${config.descripcion}</span>`;

        item.appendChild(icono);
        item.appendChild(texto);
        leyendaLista.appendChild(item);
    });
}

function renderizarSugerencias(localesCercanos) {
    const contenedorSugerencias = document.getElementById('int-local');
    contenedorSugerencias.scrollLeft = 0; // Resetea el scroll al principio cada vez que se actualizan las sugerencias
    if (!contenedorSugerencias) return;
    contenedorSugerencias.innerHTML = '';
    
    localesCercanos.forEach(local => {
        let textoDistancia = '';
        let d = local.distanciaMostrar;

        if(d < 100) {
            textoDistancia = Math.round(d/5) *5  + ' m';
        } else if (d < 1000) {
            textoDistancia = Math.round(d/50) *50  + ' m';
        } else {
            textoDistancia = (d / 1000).toFixed(1) + ' km';
        }

        // Crear tarjeta de sugerencia
        const tarjeta = document.createElement('div');
        tarjeta.className = 'locales-cont-int';
        
        // Crear div de imagen con background dinámico
        const imagenDiv = document.createElement('div');
        imagenDiv.className = 'imagen-local-int';
        if (local.imagen) {
            imagenDiv.setAttribute('data-bg-lazy', `linear-gradient(180deg, rgba(0, 0, 0, 0) 55%, rgba(0, 0, 0, 0.5) 68%, rgba(0, 0, 0, 0.75) 80%, rgba(0, 0, 0, 0.87) 87%, rgb(0, 0, 0) 100%), url('${local.imagen}')`);
            lazyImageObserver.observe(imagenDiv);
        }
        
        const nombre = document.createElement('p');
        nombre.className = 'nombre-local-int';
        nombre.textContent = local.nombre;

        const longitudNombre = (local.nombre || '').trim().length;
        if (longitudNombre <= 12) {
            nombre.style.fontSize = '24px';
        } else if (longitudNombre <= 18) {
            nombre.style.fontSize = '20px';
        } else if (longitudNombre <= 26) {
            nombre.style.fontSize = '18px';
        } else {
            nombre.style.fontSize = '16px';
        }
        
        const distancia = document.createElement('p');
        distancia.className = 'distancia';
        distancia.textContent = textoDistancia;

        imagenDiv.appendChild(nombre);
        imagenDiv.appendChild(distancia);
        
        // Crear div de información
        const infoDiv = document.createElement('div');
        infoDiv.className = 'info-local-int';
        
        const tipo = document.createElement('p');
        tipo.className = 'tipo-local-int';
        tipo.textContent = local.tipo || '';
        
        const descripcion = document.createElement('p');
        descripcion.className = 'description-local-int';
        descripcion.textContent = local.descripcion || '';

        const direccion = document.createElement('p');
        direccion.className = 'direccion-local-int';
        direccion.textContent = local.direccion || '';
        
        infoDiv.appendChild(tipo);
        infoDiv.appendChild(descripcion);
        infoDiv.appendChild(direccion);
        
        tarjeta.appendChild(imagenDiv);
        tarjeta.appendChild(infoDiv);
        // Al tocar sugerencia: solo destacar + flyTo; el panel se abre si luego toca el pin
        tarjeta.addEventListener('click', (e) => {
            e.stopPropagation();
            destacarMarcadorDesdeBusqueda(local);
            cerrarPanel();
        });
        
        contenedorSugerencias.appendChild(tarjeta);
    });
}

tuerca.addEventListener("click", () => {
    opcionesAbiertas = !opcionesAbiertas;
    tuerca.setAttribute('aria-expanded', opcionesAbiertas ? 'true' : 'false');
    tuerca.classList.toggle("active");
    opciones.forEach(opcion => {
        opcion.classList.toggle("visible");
    });
});
document.addEventListener("DOMContentLoaded", () => {
    const mapa = document.querySelector('#map'); // O el ID que tenga tu contenedor de mapa
    let lastScrollTop = 0;
    
    let isScrollingToTop = false;

    window.addEventListener('scroll', () => {
        const scrollActual = window.pageYOffset || document.documentElement.scrollTop || 0;
        if (isScrollingToTop && scrollActual <= 2 && !menuVisible) {
            bloquearScrollFondo();
            isScrollingToTop = false;
        }
    });

    const observerOptions = {
        root: null,
        threshold: 0.3 // Se activa cuando el 30% del mapa es visible
    };

    const autoScrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // 1. Detectamos la dirección del scroll
            let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            let scrollingUp = scrollTop < lastScrollTop;

            // 2. Si el mapa entra en vista Y el usuario está subiendo...
            if (entry.isIntersecting && scrollingUp) {
                isScrollingToTop = true;
                // Hacemos el scroll suave al inicio de la página
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }
            
            lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // Actualizamos posición
        });
    }, observerOptions);

    if (mapa) {
        autoScrollObserver.observe(mapa);
        if ((window.scrollY || 0) <= 2) {
            bloquearScrollFondo();
        }
    }
});
function activarConTecladoComoBoton(elemento) {
    if (!elemento) return;
    elemento.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            elemento.click();
        }
    });
}

activarConTecladoComoBoton(tuerca);
activarConTecladoComoBoton(filtrosBoton);
activarConTecladoComoBoton(leyendaBoton);

if (filtrosBoton) {
    filtrosBoton.addEventListener('click', (e) => {
        e.stopPropagation();
        if (opcionesAbiertas) {
            opcionesAbiertas = false;
            tuerca.classList.remove('active');
            opciones.forEach(opcion => {
                opcion.classList.remove('visible');
            });
        }
        alternarFiltros();
    });
}

if (leyendaBoton) {
    leyendaBoton.addEventListener('click', (e) => {
        e.stopPropagation();
        if (opcionesAbiertas) {
            opcionesAbiertas = false;
            tuerca.classList.remove('active');
            opciones.forEach(opcion => {
                opcion.classList.remove('visible');
            });
        }
        alternarLeyenda();
    });
}

if (cerrarLeyendaBoton) {
    cerrarLeyendaBoton.addEventListener('click', (e) => {
        e.stopPropagation();
        cerrarLeyenda();
    });
}
// --LOGICA DEL FILTRO --//
const tipoFiltros = document.querySelectorAll('input[name="tipo"]');
const extraFiltros = document.querySelectorAll('input[name="extra"]');
const botonTodos = document.querySelector('input[value="todos"]');

// --- ESTADO INICIAL ---
if (botonTodos) {
    botonTodos.checked = true;
    // Al empezar, si "Todos" está activo, desmarcamos el resto
    tipoFiltros.forEach(f => {
        if (f.value !== 'todos') f.checked = false;
    });
}

extraFiltros.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
        filtrarMapa();
    });
});
// --- LÓGICA DE EVENTOS ---
tipoFiltros.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
        
        // 1. VALIDACIÓN: Prohibido dejar todo desmarcado
        const activos = obtenerFiltrosActivos();
        if (activos.length === 0) {
            checkbox.checked = true; // Forzamos a que se quede marcado
            return; // Detenemos la ejecución
        }

        // 2. LÓGICA SI EL USUARIO MARCA "TODOS"
        if (checkbox.value === 'todos' && checkbox.checked) {
            tipoFiltros.forEach(otro => {
                if (otro.value !== 'todos') otro.checked = false;
            });
        } 
        
        // 3. LÓGICA SI EL USUARIO MARCA UN FILTRO ESPECÍFICO
        else if (checkbox.value !== 'todos' && checkbox.checked) {
            // Desmarcamos el botón "Todos" porque ya hay una selección específica
            if (botonTodos) botonTodos.checked = false;

            // REGLA EXTRA: Si el usuario marca manualmente todos los filtros,
            // mejor activamos "Todos" y limpiamos el resto para simplificar.
            const totalEspecificos = tipoFiltros.length - 1;
            const especificosMarcados = obtenerFiltrosActivos().length;

            if (especificosMarcados === totalEspecificos) {
                tipoFiltros.forEach(f => {
                    if (f.value !== 'todos') f.checked = false;
                });
                botonTodos.checked = true;
            }
        }

        // 4. RESULTADO FINAL: Lo que usaremos para filtrar el mapa
        const tiposAFiltrar = obtenerFiltrosActivos();
        console.log("Filtros activos actualmente:", tiposAFiltrar);
        filtrarMapa(tiposAFiltrar);
    });
});

// FUNCIÓN COSECHADORA (Mantenla siempre fuera)
function obtenerFiltrosActivos() {
    return Array.from(tipoFiltros)
        .filter(input => input.checked)
        .map(input => input.value);
}

function obtenerExtrasActivos() {
    return Array.from(extraFiltros)
        .filter(input => input.checked)
        .map(input => input.value);
}

function mapearFiltroATipoReal(valorFiltro) {
    const mapaTipos = {
        cafeterias: 'cafeteria',
        bares: 'bar',
        restaurantes: 'restaurante',
        heladerias: 'heladeria',
        pizzerias: 'pizzeria'
    };
    return mapaTipos[valorFiltro] || valorFiltro;
}

function estaAbiertoAhora(local) {
    const ahoraLocal = new Date();
    const horaActual = ahoraLocal.getHours();
    const minutosActuales = ahoraLocal.getMinutes();
    const ahoraDecimal = parseFloat(`${horaActual}.${minutosActuales.toString().padStart(2, '0')}`);
    const abre = Number(local?.horario?.abre);
    const cierra = Number(local?.horario?.cierra);
    if (!Number.isFinite(abre) || !Number.isFinite(cierra)) return false;

    if (cierra > abre) {
        return ahoraDecimal >= abre && ahoraDecimal < cierra;
    }
    return ahoraDecimal >= abre || ahoraDecimal < cierra;
}

function localPasaFiltrosActivos(local) {
    const tiposActivos = obtenerFiltrosActivos();
    const extrasActivos = obtenerExtrasActivos();

    if (!tiposActivos.includes('todos')) {
        const tiposPermitidos = tiposActivos.map(mapearFiltroATipoReal);
        const tipoLocal = (local.tipoReal || '').toLowerCase();
        if (!tiposPermitidos.includes(tipoLocal)) return false;
    }

    if (extrasActivos.includes('abierto') && !estaAbiertoAhora(local)) {
        return false;
    }

    const amenidades = Array.isArray(local.amenidades)
        ? local.amenidades.map(a => normalizarTexto(String(a)))
        : [];

    if (extrasActivos.includes('transferencia') && !amenidades.includes(normalizarTexto('Transferencia'))) {
        return false;
    }

    if (extrasActivos.includes('domicilio') && !amenidades.includes(normalizarTexto('Domicilio'))) {
        return false;
    }

    return true;
}

function hayFiltroQueRestringeResultados() {
    const tiposActivos = obtenerFiltrosActivos();
    const extrasActivos = obtenerExtrasActivos();
    return !tiposActivos.includes('todos') || extrasActivos.length > 0;
}

// 5. Buscador en tiempo real
const searchInput = document.getElementById('search-input');
const searchForm = document.querySelector('.search-form');
const divBusqueda = document.getElementById('busqueda');
const ulBusqueda = document.getElementById('ul-busqueda');
const panelBusquedaCalles = document.getElementById('busqueda-calles');
const ulBusquedaCalles = document.getElementById('ul-busqueda-calles');
const textoCalleBuscada = document.getElementById('texto-calle-buscada');
const btnCerrarBusquedaCalles = document.getElementById('cerrar-busqueda-calles');
const marcadoresPorLocal = new WeakMap();
const MARKER_LABEL_MIN_ZOOM = 15.8;
let marcadorDestacado = null;
let localDestacado = null;

function actualizarLabelsPorZoom() {
    const mostrarLabels = map.getZoom() >= MARKER_LABEL_MIN_ZOOM;
    document.querySelectorAll('.marker-mesa').forEach((marcador) => {
        marcador.classList.toggle('marker-label-visible', mostrarLabels);
    });
}

function limpiarMarcadorDestacado() {
    if (!marcadorDestacado) return;
    marcadorDestacado.classList.remove('marker-destacado');
    marcadorDestacado = null;
    localDestacado = null;
}

function destacarMarcadorDesdeBusqueda(local) {
    const marcador = marcadoresPorLocal.get(local);
    if (!marcador) return;

    if (marcadorDestacado && marcadorDestacado !== marcador) {
        marcadorDestacado.classList.remove('marker-destacado');
    }

    marcadorDestacado = marcador;
    localDestacado = local;
    marcadorDestacado.classList.add('marker-destacado');

    map.flyTo({
        center: local.coordenadas,
        zoom: Math.max(map.getZoom(), 16.85),
        speed: 0.7,
        curve: 1.4,
        essential: true
    });
}

function normalizarTexto(texto) {
    return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}
// Funcion con la formula de Haversine para calcular la distancia en metros entre dos locales
function calcularDistancia(p1, p2) {
    const lon1 = p1[0], lat1 = p1[1]; // declaramos la longitud de cada local
    const lon2 = p2[0], lat2 = p2[1]; // declaramos la latitud de cada local
    
    // El "corazón" de la fórmula Haversine
    const R = 6371e3; // Radio de la Tierra en metros
    const phi1 = lat1 * Math.PI / 180; 
    const phi2 = lat2 * Math.PI / 180;
    const deltaPhi = (lat2 - lat1) * Math.PI / 180;
    const deltaLambda = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
              Math.cos(phi1) * Math.cos(phi2) *
              Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Devuelve metros exactos
}
function obtenerSugerencias(localActual){
    let candidatos = misLugares.filter(l => l.nombre !== localActual.nombre); // creamos una "copia" de nuestro JSON para agregarle el valor de la distancia
    candidatos.forEach(c =>{ //recorremos para hacerle las operaciones necesarias
        const distanciaReal = calcularDistancia(localActual.coordenadas, c.coordenadas); // calculamos la distancia real en metros entre los dos locales
        c.distanciaMostrar = distanciaReal; // aqui creamos la distancia para mostrarla mas adelante en el panel de sugerir un local

        let puntos = distanciaReal; // creamos una variable para asignarle puntos a cada local
        if (c.tipoReal.toLowerCase() === localActual.tipoReal.toLowerCase()) { // verificamos si el local es del mismo tipo que el que el usuario esta viendo
            puntos -=200; // restamos 200 puntos en caso de ser asi
        }
        c.puntuacionRanked = puntos; // variable por la que internamente nos guiaremos para la posicion entre los locales sugeridos
    });
    return candidatos.sort((a,b)=> a.puntuacionRanked - b.puntuacionRanked).slice(0,5); // ordenamos de menor a mayor segun la puntuacion y nos quedamos con los 5 mejores candidatos
}


function getModoActivo() {
    const radioActivo = document.querySelector('input[name="modo-busqueda"]:checked');
    return radioActivo ? radioActivo.value : 'nombre';
}

function buscarPorCalleBase(texto) {
    const palabras = normalizarTexto(texto.trim()).split(/\s+/).filter(p => p.length > 0);
    if (!palabras.length) return [];
    return misLugares.filter(local => {
        const dir = normalizarTexto(local.direccion || '');
        return palabras.some(palabra => dir.includes(palabra));
    });
}

function buscarLugaresPorNombreBase(texto) {
    const busqueda = normalizarTexto(texto.trim());
    if (!busqueda) return [];
    return misLugares.filter(local =>
        normalizarTexto(local.nombre).includes(busqueda)
    );
}

function buscarLugares(texto) {
    return buscarLugaresPorNombreBase(texto).filter(localPasaFiltrosActivos);
}

function buscarPorCalle(texto) {
    return buscarPorCalleBase(texto).filter(localPasaFiltrosActivos);
}

function renderResultados(resultados, avisoFiltrosActivo = false) {
    ulBusqueda.innerHTML = '';

    if (resultados.length === 0) {
        const liVacio = document.createElement('li');
        liVacio.className = 'sin-resultados';
        liVacio.textContent = 'No se encontraron lugares';
        ulBusqueda.appendChild(liVacio);
    } else {
        resultados.forEach(local => {
            const li = document.createElement('li');
            li.className = 'li-busqueda';
            li.innerHTML = `
                <div class="imagen-busqueda" data-bg-lazy="url(${local.imagen ? local.imagen : ''})"></div>
                <div class="informacion-busqueda">
                    <h3 class="h3-busqueda">${local.nombre}</h3>
                    <p class="description-busqueda">${local.descripcion || ''}</p>
                </div>`;
            li.addEventListener('click', (e) => {
                e.stopPropagation();
                destacarMarcadorDesdeBusqueda(local);
                cerrarBusqueda();
            });
            ulBusqueda.appendChild(li);
            
            const imgBusqueda = li.querySelector('.imagen-busqueda');
            if (imgBusqueda && local.imagen) lazyImageObserver.observe(imgBusqueda);
        });
    }

    if (avisoFiltrosActivo) {
        const liAviso = document.createElement('li');
        liAviso.className = 'sin-resultados';
        liAviso.textContent = 'Hay filtros activados. Para ver todos los resultados, quite los filtros.';
        ulBusqueda.appendChild(liAviso);
    }
}

function abrirBusqueda() {
    divBusqueda.classList.add('visible');
}

function cerrarBusqueda() {
    divBusqueda.classList.remove('visible');
    searchInput.value = '';
    searchInput.blur();
}

searchInput.addEventListener('input', () => {
    const texto = searchInput.value;
    if (getModoActivo() === 'calle') {
        return;
    }
    if (texto.trim().length > 0) {
        const resultadosSinFiltro = buscarLugaresPorNombreBase(texto);
        const resultados = resultadosSinFiltro.filter(localPasaFiltrosActivos).slice(0, 3);
        const avisoFiltrosActivo = hayFiltroQueRestringeResultados();
        renderResultados(resultados, avisoFiltrosActivo);
        abrirBusqueda();
    } else {
        cerrarBusqueda();
    }
});

searchInput.addEventListener('focus', () => {
    if (searchInput.value.trim().length > 0) {
        abrirBusqueda();
    }
});

searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const texto = searchInput.value.trim();
    if (!texto) return;
    if (getModoActivo() === 'calle') {
        cerrarBusqueda();
        cerrarFiltros();
        abrirBusquedaCalles(texto);
    }
});

function renderResultadosCalles(resultados, textoBuscado, avisoFiltrosActivo = false) {
    ulBusquedaCalles.innerHTML = '';
    if (textoCalleBuscada) textoCalleBuscada.textContent = `"${textoBuscado}"`;

    if (resultados.length === 0) {
        const liVacio = document.createElement('li');
        liVacio.className = 'sin-resultados';
        liVacio.style.padding = '20px';
        liVacio.textContent = 'No se encontraron lugares en esa calle o zona.';
        ulBusquedaCalles.appendChild(liVacio);
    } else {
        resultados.forEach(local => {
            const li = document.createElement('li');
            li.className = 'li-busqueda-calles';
            li.innerHTML = `
                <div class="imagen-busqueda-calle" data-bg-lazy="url(${local.imagen || ''})"></div>
                <div class="informacion-busqueda-calle">
                    <h3 class="h3-busqueda-calle">${local.nombre}</h3>
                    <p class="description-busqueda-calle">${local.direccion || ''}</p>
                </div>`;
            li.addEventListener('click', (e) => {
                e.stopPropagation();
                destacarMarcadorDesdeBusqueda(local);
                cerrarBusquedaCalles();
            });
            ulBusquedaCalles.appendChild(li);
            
            const imgBusquedaCalle = li.querySelector('.imagen-busqueda-calle');
            if (imgBusquedaCalle && local.imagen) lazyImageObserver.observe(imgBusquedaCalle);
        });
    }

    if (avisoFiltrosActivo) {
        const liAviso = document.createElement('li');
        liAviso.className = 'sin-resultados';
        liAviso.style.padding = '20px';
        liAviso.textContent = 'Hay filtros activados. Para ver todos los resultados, quita los filtros.';
        ulBusquedaCalles.appendChild(liAviso);
    }
}

function abrirBusquedaCalles(texto) {
    if (!panelBusquedaCalles) return;
    const resultadosSinFiltro = buscarPorCalleBase(texto);
    const resultados = resultadosSinFiltro.filter(localPasaFiltrosActivos);
    const avisoFiltrosActivo = hayFiltroQueRestringeResultados();
    renderResultadosCalles(resultados, texto, avisoFiltrosActivo);
    panelBusquedaCalles.classList.add('active');
    panelBusquedaCalles.setAttribute('aria-hidden', 'false');
    panelBusquedaCalles.scrollTop = 0;
    bloquearScrollFondo();
}

function cerrarBusquedaCalles() {
    if (!panelBusquedaCalles) return;
    panelBusquedaCalles.classList.remove('active');
    panelBusquedaCalles.setAttribute('aria-hidden', 'true');
    desbloquearScrollFondo();
}

if (btnCerrarBusquedaCalles) {
    btnCerrarBusquedaCalles.addEventListener('click', cerrarBusquedaCalles);
}

document.addEventListener('click', (e) => {
    const wrapper = document.getElementById('search-wrapper');
    if (!wrapper.contains(e.target)) {
        divBusqueda.classList.remove('visible');
    }

    if (marcadorDestacado && !marcadorDestacado.contains(e.target)) {
        limpiarMarcadorDestacado();
    }

    if (
        filtrosPanel &&
        filtrosPanel.classList.contains('filtros-visible') &&
        !filtrosPanel.contains(e.target) &&
        filtrosBoton &&
        !filtrosBoton.contains(e.target)
    ) {
        cerrarFiltros();
    }

    if (
        leyendaPanel &&
        leyendaPanel.classList.contains('active') &&
        !leyendaPanel.contains(e.target) &&
        leyendaBoton &&
        !leyendaBoton.contains(e.target)
    ) {
        cerrarLeyenda();
    }
});
// 1. Creamos una "caja" vacía afuera para guardar los lugares
let misLugares = []; 
let slide = [];
let slideIndex = 0;
let galeriaAnimando = false;
let galeriaPendiente = 0;
let galeriaAnimTimeoutId = null;
const botonPre = document.getElementById('btn-pre-galeria');
const botonSig = document.getElementById('btn-sig-galeria');
// 2. Creamos una función especial para cargar los datos
async function cargarBaseDeDatos() {
    try {
        // A. Pedimos el archivo y ESPERAMOS (await) a que llegue
        const respuesta = await fetch('lugares.json');
        // B. Traducimos el archivo y ESPERAMOS a que termine la traducción
        const datosConvertidos = await respuesta.json();
        // C. Guardamos los datos en nuestra "caja" global
        misLugares = datosConvertidos;
        // D. Ahora que ya tenemos los datos, llamamos a la función que pone los pines
        dibujarPines();
        console.log("¡Datos cargados con éxito!", misLugares);
    } catch (error) {
        // Si algo falla (archivo no encontrado, error de internet), sale por aquí
        console.error("Hubo un error cargando el JSON:", error);
    }
}



function mostrarInfoEnPanel(local) {
    try {
        console.log('Mostrar info de:', local);
        panel.scrollTop = 0;
        const imgDiv = document.getElementById('imagen-local');
        const nombre = document.getElementById('nombre-local');
        const tipo = document.getElementById('type-local');
        const estado = document.getElementById('state');
        const horario = document.getElementById('horario');
        const costo = document.getElementById('costo');
        const direccion = document.getElementById('direccion');
        const desc = document.getElementById('text-description-local');
        const botonReportarDato = document.getElementById('reportar-dato');
        const botonLlamar = document.getElementById('llamar');
        const botonWhatsapp = document.getElementById('whatsapp');
        if (imgDiv) {
            // si local.imagen es una ruta relativa, la ponemos como background
            if (local.imagen) {
                imgDiv.style.backgroundImage = `linear-gradient(0deg,rgba(0, 0, 0, 0) 55%, rgba(0, 0, 0, 0.5) 68%, rgba(0, 0, 0, 0.75) 80%, rgba(0, 0, 0, 0.87) 87%, rgba(0, 0, 0, 1) 100%), url(${local.imagen})`;
            } else {
                imgDiv.style.backgroundImage = '';
            }
        }
        ahora = new Date();
        hora = ahora.getHours();
        minutos = ahora.getMinutes();
        mostrar = parseFloat(`${hora}.${minutos.toString().padStart(2, '0')}`);
        if (nombre) nombre.textContent = local.nombre || 'Sin nombre';
        if (tipo) tipo.textContent = local.tipo || '';
        
        // Lógica de horario corregida
        const abre = local.horario.abre;
        const cierra = local.horario.cierra;
        let estaAbierto;
        if (cierra > abre) {
            // Caso normal: abre y cierra el mismo día (ej: 9.00 - 17.00)
            estaAbierto = mostrar >= abre && mostrar < cierra;
        } else {
            // Cruza medianoche (ej: 21.00 - 2.00)
            estaAbierto = mostrar >= abre || mostrar < cierra;
        }
        if(!estaAbierto){
            estado.textContent = 'Cerrado';
            estado.style.color = 'var(--color-principal-tom)';
        } else {
            estado.textContent = 'Abierto';
            estado.style.color = 'var(--color-abierto)';
        }
        if(galeriaTrack){
            galeriaTrack.innerHTML = ''; // Limpiamos la galería antes de llenarla
            slide = []
            slideIndex = 0;
            galeriaAnimando = false;
            galeriaPendiente = 0;
            if (galeriaAnimTimeoutId) {
                clearTimeout(galeriaAnimTimeoutId);
                galeriaAnimTimeoutId = null;
            }
            if(local.imagenes && local.imagenes.length > 0){
                local.imagenes.forEach((imgSrc) => {
                    const slideDiv = document.createElement('div');
                    slideDiv.className = 'slide';
                    slideDiv.setAttribute('data-bg-lazy', `url(${imgSrc})`);
                    galeriaTrack.appendChild(slideDiv);
                    slide.push(slideDiv);
                });
                galeriaOrdenar();
            }
        }
        
        if (horario) horario.textContent = local.horario.normal || '';
        if (costo) costo.textContent = (local.precios && local.precios.rango) ? `${local.precios.rango}` : '';
        if (direccion) direccion.textContent = local.direccion || '';
        if (desc) desc.textContent = local.descripcion || '';

        const telefonoLimpio = String(local.telefono || '').replace(/\D/g, '');
        if (botonLlamar && telefonoLimpio) {
            botonLlamar.href = `tel:+${telefonoLimpio}`;
        }

        if (botonWhatsapp) {
            const numeroWhatsapp = String(local.whatsapp || telefonoLimpio || '5351354067').replace(/\D/g, '');
            botonWhatsapp.href = `https://wa.me/${numeroWhatsapp}`;
        }

        if (botonReportarDato) {
            const asunto = encodeURIComponent(`MesaMap | Reporte de dato: ${local.nombre || 'Local'}`);
            const cuerpo = encodeURIComponent(
                `Hola equipo de MesaMap,\n\n` +
                `Quiero reportar un dato para este local:\n` +
                `Nombre: ${local.nombre || 'Sin nombre'}\n` +
                `Direccion: ${local.direccion || 'Sin direccion'}\n` +
                `Tipo: ${local.tipo || 'Sin tipo'}\n\n` +
                `Dato a corregir:\n`
            );
            botonReportarDato.href = `mailto:luisernesto.cuellar164@gmail.com?subject=${asunto}&body=${cuerpo}`;
        }
    } catch (err) {
        console.error('Error mostrando info en panel:', err);
    }
    // --- NUEVO: MOTOR DE SUGERENCIAS ---
    // 1. Obtenemos los 5 mejores candidatos
    const sugerencias = obtenerSugerencias(local);
    // 2. Le pedimos a la función de arriba que los dibuje
    renderizarSugerencias(sugerencias);
}
function navegarGaleria(delta) {
    if (!slide.length || delta === 0) return;

    const paso = delta > 0 ? 1 : -1;

    if (galeriaAnimando) {
        // Guardamos solo la última intención para evitar saltos por ráfaga de toques.
        galeriaPendiente = paso;
        return;
    }

    galeriaAnimando = true;
    slideIndex += paso;
    galeriaOrdenar();

    if (galeriaAnimTimeoutId) clearTimeout(galeriaAnimTimeoutId);
    galeriaAnimTimeoutId = setTimeout(() => {
        galeriaAnimando = false;
        galeriaAnimTimeoutId = null;

        if (galeriaPendiente !== 0) {
            const siguientePaso = galeriaPendiente;
            galeriaPendiente = 0;
            navegarGaleria(siguientePaso);
        }
    }, 420);
}

botonPre.addEventListener('click', () => {
    navegarGaleria(-1);
});
botonSig.addEventListener('click', () => {
    navegarGaleria(1);
});
let tiempoOcultar;
function mostrarControlesGaleria(){
    contenedorGaleria.classList.add('mostrar-flechas')
    clearTimeout(tiempoOcultar);
    tiempoOcultar = setTimeout(() =>{
        contenedorGaleria.classList.remove('mostrar-flechas');
    },2500);
}
galeriaTrack.addEventListener('touchstart', mostrarControlesGaleria);

galeriaTrack.addEventListener('mousemove', mostrarControlesGaleria);
// 3. Función para poner los pines
function dibujarPines() {
    misLugares.forEach(local => {
        const tipoKey = local.tipoReal.toLowerCase();
        
        // Buscamos la configuración de color y el dibujo SVG
        const config = estilosPorTipo[tipoKey] || { color: '#ffffff' };
        const dibujoSVG = iconosSVG[tipoKey] || '';
        const el = document.createElement('div');
        el.className = 'marker-mesa';

        // Estilo visual del pin
        el.style.setProperty('--color-pin', config.color);
        el.style.setProperty('--color-pin-shadow', `${config.color}55`);
         // Clase para el SVG, por si quieres darle estilos específicos
        // INYECCIÓN DEL SVG (Aquí está el cambio clave)
        el.innerHTML = dibujoSVG;
        const icono = el.querySelector('svg');
        if (icono) {
            icono.classList.add('icono-pin');
        }
        // CREAMOS EL TEXTO (NUEVO)

        const label = document.createElement('span');
        label.className = 'marker-label'; // Clase para darle estilo al nombre
        label.textContent = local.nombre.toUpperCase(); // Ponemos el nombre en mayúsculas
        el.appendChild(label); // Metemos el nombre dentro del div del pin
        marcadoresPorLocal.set(local, el);
        // 2. LO IMPORTANTE: Le decimos a MapLibre explícitamente que "element" es tu div
        // Al poner { element: el }, MapLibre desactiva el pin azul
        new maplibregl.Marker({ 
            element: el,
            anchor: 'center' // Para que el centro del círculo coincida con la coordenada
        })
        .setLngLat(local.coordenadas)
        .addTo(map);
        // 3. Le añadimos el evento de clic
        el.addEventListener('click', (e) => {
            e.stopPropagation(); // Evita que el clic pase al mapa de fondo

            if (localDestacado && localDestacado !== local) {
                limpiarMarcadorDestacado();
            } else if (marcadorDestacado === el) {
                limpiarMarcadorDestacado();
            }

            mostrarInfoEnPanel(local);
            abrirpanel();
        });
    });

    actualizarLabelsPorZoom();
}
renderizarLeyenda();
map.on('zoom', actualizarLabelsPorZoom);
function filtrarMapa(filtros) {
    let cantidadVisibles = 0;
    misLugares.forEach(local => {
        // Obtenemos el elemento HTML del pin guardado en la WeakMap
        const pinHTML = marcadoresPorLocal.get(local);
        if (!pinHTML) return;

        if (localPasaFiltrosActivos(local)) {
            pinHTML.style.display = 'flex';
            cantidadVisibles += 1;
        } else {
            pinHTML.style.display = 'none';
        }
    });

    actualizarAvisoFiltrosSinResultados(cantidadVisibles);
}
let touchStartX = 0 , touchStartY = 0, touchEndX = 0, touchEndY = 0, touchStartTime = 0, isDragging = false;

const MIN_SWIPE_X = 55;
const FAST_SWIPE_TIME = 220;
const FAST_SWIPE_X = 30;
const HORIZONTAL_RATIO = 1.2;

function onGaleriaTouchStart(e){
    if(!slide.length || e.touches.length !== 1) return;
    const t = e.touches[0];
    touchStartX = t.clientX;
    touchStartY = t.clientY;
    touchEndX = t.clientX;
    touchEndY = t.clientY;
    touchStartTime = Date.now();
    isDragging  = true;
}
function onGaleriaTouchMove(e){
    if(!isDragging || e.touches.length !== 1) return;
    const t = e.touches[0];
    touchEndX = t.clientX;
    touchEndY = t.clientY;
    const dx = touchEndX - touchStartX;
    const dy = touchEndY - touchStartY;
    if(Math.abs(dx) > Math.abs(dy)){
        e.preventDefault(); // Evita el scroll vertical si es un swipe horizontal
    }
}
function onGaleriaTouchEnd() {
    if (!isDragging || !slide.length) return;
    isDragging = false;
    const dx = touchEndX - touchStartX;
    const dy = touchEndY - touchStartY;
    const dt = Date.now() - touchStartTime;

    const absX = Math.abs(dx);
    const absY = Math.abs(dy);
    
    const isHorizontal = absX > absY * HORIZONTAL_RATIO;
    const passedDistance = absX >= MIN_SWIPE_X;
    const fastSwipe = dt <= FAST_SWIPE_TIME && absX >= FAST_SWIPE_X;
    if (!isHorizontal || (!passedDistance && !fastSwipe)) return;

    if (dx < 0) {
        navegarGaleria(1);
    } else {
        navegarGaleria(-1);
    }
}
function onGaleriaTouchCancel() {
    isDragging = false;
}
if (galeriaTrack) {
    galeriaTrack.addEventListener('touchstart', onGaleriaTouchStart, { passive: true });
    galeriaTrack.addEventListener('touchmove', onGaleriaTouchMove, { passive: false });
    galeriaTrack.addEventListener('touchend', onGaleriaTouchEnd, { passive: true });
    galeriaTrack.addEventListener('touchcancel', onGaleriaTouchCancel, { passive: true });
}
function galeriaOrdenar() {
    const total = slide.length; 
    if (total === 0) return;
    
    // Mantiene el indice siempre dentro del rango
    slideIndex = ((slideIndex % total) + total) % total;
    
    slide.forEach((elSlide, i) => {
        // Limpiamos todas las clases posibles primero
        elSlide.classList.remove('activa', 'previa', 'desp', 'oculta-izq', 'oculta-der');
        
        // Calculamos la distancia relativa de esta imagen respecto a la activa
        let dist = i - slideIndex;
        
        // Este truco matemático hace que el carrusel sea verdaderamente infinito
        if (dist > Math.floor(total / 2)) dist -= total;
        if (dist < -Math.floor(total / 2)) dist += total;

        // Asignamos las clases según su distancia al centro
        if (dist === 0) {
            elSlide.classList.add('activa');        // Centro
        } else if (dist === -1) {
            elSlide.classList.add('previa');        // A la izquierda
        } else if (dist === 1) {
            elSlide.classList.add('desp');          // A la derecha
        } else if (dist < -1) {
            elSlide.classList.add('oculta-izq');    // Esperando lejos a la izquierda
        } else if (dist > 1) {
            elSlide.classList.add('oculta-der');    // Esperando lejos a la derecha
        }

        // Lazy Loading para las imágenes visibles y las adyacentes (hasta 2 de distancia)
        if (dist >= -2 && dist <= 2) {
            const lazyBg = elSlide.getAttribute('data-bg-lazy');
            if (lazyBg) {
                elSlide.style.backgroundImage = lazyBg;
                elSlide.removeAttribute('data-bg-lazy');
            }
        }
    });
}

function extraerUrlImagen(elemento) {
    if (!elemento) return '';
    if (elemento.tagName === 'IMG' && elemento.src) return elemento.src;

    const background = window.getComputedStyle(elemento).backgroundImage;
    if (!background || background === 'none') return '';

    const regex = /url\((['"]?)(.*?)\1\)/g;
    let coincidencia;
    let ultimaUrl = '';

    while ((coincidencia = regex.exec(background)) !== null) {
        ultimaUrl = coincidencia[2];
    }

    return ultimaUrl;
}

function abrirLightboxConUrl(urlImagen) {
    if (!urlImagen || !imageLightbox || !imageLightboxImg) return;
    imageLightboxImg.src = urlImagen;
    imageLightbox.classList.add('active');
    imageLightbox.setAttribute('aria-hidden', 'false');
}

function cerrarLightbox() {
    if (!imageLightbox || !imageLightboxImg) return;
    imageLightbox.classList.remove('active');
    imageLightbox.setAttribute('aria-hidden', 'true');
    imageLightboxImg.src = '';
}

if (galeriaTrack) {
    galeriaTrack.addEventListener('click', (e) => {
        const slideActivo = e.target.closest('.slide.activa');
        if (!slideActivo) return;
        const urlImagen = extraerUrlImagen(slideActivo);
        abrirLightboxConUrl(urlImagen);
    });
}

if (imagenLocal) {
    imagenLocal.addEventListener('click', () => {
        const urlImagen = extraerUrlImagen(imagenLocal);
        abrirLightboxConUrl(urlImagen);
    });
}

if (imageLightbox) {
    imageLightbox.addEventListener('click', cerrarLightbox);
}

if (imageLightboxImg) {
    imageLightboxImg.addEventListener('click', (e) => e.stopPropagation());
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        cerrarLightbox();
        cerrarLeyenda();
    }
});

function abrirpanel(){
    panel.classList.remove('desactive-info-place'); // Asegura que el panel esté visible
    panel.classList.add('active-info-place');
    overlayPanel.classList.add('active'); // Muestra el panel con la clase CSS
    bloquearScrollFondo();
}
function cerrarPanel(){
    panel.classList.remove('active-info-place'); // Oculta el panel con la clase CSS
    panel.classList.add('desactive-info-place'); // Asegura que el panel esté oculto
    overlayPanel.classList.remove('active'); // Oculta el overlay
    desbloquearScrollFondo();
}
overlayPanel.addEventListener('click', cerrarPanel);

// Toggle del menú hamburguesa
const menuToggle = document.getElementById('menu-toggle');
const hamburguesaMenu = document.getElementById('hamburguesa-menu');
let menuVisible = false;
menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
    if (menuVisible) {
        menuToggle.classList.remove('menu-active');
        hamburguesaMenu.classList.remove('menu-visible');
        menuToggle.setAttribute('aria-expanded', 'false');
        hamburguesaMenu.setAttribute('aria-hidden', 'true');
    }else{
        menuToggle.classList.add('menu-active');
        hamburguesaMenu.classList.add('menu-visible');
        menuToggle.setAttribute('aria-expanded', 'true');
        hamburguesaMenu.setAttribute('aria-hidden', 'false');
        bloquearScrollFondo();
    }
    menuVisible = !menuVisible;
});
const liHamburguesa = document.querySelectorAll('.a-hamb-menu');
liHamburguesa.forEach(li => {
    li.addEventListener('click', () => {
        desbloquearScrollFondo();
        menuToggle.classList.remove('menu-active');
        hamburguesaMenu.classList.remove('menu-visible');
        menuToggle.setAttribute('aria-expanded', 'false');
        hamburguesaMenu.setAttribute('aria-hidden', 'true');
        menuVisible = false;
    });
});
document.addEventListener('click', (e) => {
    // Si el menú está visible y el click NO fue en el menú ni en el botón
    if (hamburguesaMenu.classList.contains('menu-visible') &&
        !hamburguesaMenu.contains(e.target) &&
        !menuToggle.contains(e.target)) {
        menuToggle.classList.remove('menu-active');
        hamburguesaMenu.classList.remove('menu-visible');
        menuToggle.setAttribute('aria-expanded', 'false');
        hamburguesaMenu.setAttribute('aria-hidden', 'true');
        menuVisible = false;
    }
});
const radiosBusqueda = document.querySelectorAll('input[name="modo-busqueda"]');
const radioBusquedaNombre = document.querySelector('input[name="modo-busqueda"][value="nombre"]');

if (radioBusquedaNombre) {
    // Forzamos el modo inicial para evitar que el navegador restaure "calle" al refrescar.
    radioBusquedaNombre.checked = true;
    searchInput.placeholder = 'Busque un lugar especifico ...';
}

radiosBusqueda.forEach(radio => {
    radio.addEventListener('change', (e) => {
        const modo =  e.target.value;
        // Al cambiar de modo, limpiamos texto residual del input.
        searchInput.value = '';
        divBusqueda.classList.remove('visible');

        if(modo === 'nombre'){
            searchInput.placeholder = 'Busque un lugar especifico ...';
        }else if(modo === 'calle'){
            searchInput.placeholder = 'Calle o zona (Ej: Independencia)';
        } else if(modo === 'producto'){
            searchInput.placeholder = '¿Qué buscas? (Ej: Pizza, Café)';
        }
        searchInput.focus();
    });
});

// Formulario de contacto: sincroniza tema seleccionado con color y placeholder del textarea.
const contactForm = document.getElementById('contact-form');
const contactTopicCheckboxes = document.querySelectorAll('.topic-checkbox');
const contactMessageInput = document.getElementById('input-mensaje-contact');
const contactTopicIndicator = document.getElementById('contact-topic-indicator');
const contactFeedback = document.getElementById('feedback-contacto');
const suggestionForm = document.getElementById('nuevo-neg-form');
const suggestionFeedback = document.getElementById('feedback-sugerencia');

const FORM_ENDPOINT_EMAIL = 'luisernesto.cuellar164@gmail.com';
const FORM_ENDPOINT_URL = `https://formsubmit.co/ajax/${FORM_ENDPOINT_EMAIL}`;
const NAME_SAFE_REGEX = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ' -]{2,60}$/;
const LINK_PATTERN = /(https?:\/\/|www\.)/gi;
const FORM_COOLDOWN_MS = 45000;
const FORM_DUPLICATE_WINDOW_MS = 10 * 60 * 1000;
const FORM_FEEDBACK_AUTOCLEAR_MS = 5000;
const CONTACT_COOLDOWN_KEY = 'mesamap_contact_last_send_v1';
const SUGGESTION_COOLDOWN_KEY = 'mesamap_suggestion_last_send_v1';
const formFeedbackTimers = new WeakMap();

function actualizarFeedbackFormulario(elemento, mensaje, estado = '') {
    if (!elemento) return;

    const timerPrevio = formFeedbackTimers.get(elemento);
    if (timerPrevio) {
        clearTimeout(timerPrevio);
        formFeedbackTimers.delete(elemento);
    }

    elemento.textContent = mensaje || '';
    elemento.classList.remove('success', 'error');
    if (estado) elemento.classList.add(estado);

    if ((estado === 'success' || estado === 'error') && mensaje) {
        const nuevoTimer = setTimeout(() => {
            elemento.textContent = '';
            elemento.classList.remove('success', 'error');
            formFeedbackTimers.delete(elemento);
        }, FORM_FEEDBACK_AUTOCLEAR_MS);

        formFeedbackTimers.set(elemento, nuevoTimer);
    }
}

function alternarCargaBoton(boton, cargando, textoCarga = 'Enviando...') {
    if (!boton) return;
    if (!boton.dataset.originalText) boton.dataset.originalText = boton.textContent;

    boton.disabled = cargando;
    boton.classList.toggle('is-loading', cargando);
    boton.textContent = cargando ? textoCarga : boton.dataset.originalText;
}

function sanitizarTextoPlano(valor) {
    return String(valor || '')
        .replace(/[<>]/g, '')
        .replace(/\s{2,}/g, ' ')
        .trim();
}

function sanitizarFormulario(formulario) {
    if (!formulario) return;
    const campos = formulario.querySelectorAll('input[type="text"], input[type="email"], textarea');
    campos.forEach((campo) => {
        const limpio = sanitizarTextoPlano(campo.value);
        campo.value = campo.type === 'email' ? limpio.toLowerCase() : limpio;
    });
}

function leerEstadoAntiFlood(clave) {
    try {
        const raw = localStorage.getItem(clave);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

function guardarEstadoAntiFlood(clave, payload) {
    try {
        localStorage.setItem(clave, JSON.stringify(payload));
    } catch {
        // En modo privado puede fallar localStorage; en ese caso seguimos sin persistencia.
    }
}

function validarCamposSeguridad(config) {
    const {
        formulario,
        feedback,
        cooldownKey,
        nameFieldSelector,
        messageFieldSelector,
        minMessageLength = 12,
        maxLinks = 2,
        allowEmptyMessage = false
    } = config;

    if (!formulario) return false;

    const nombreCampo = formulario.querySelector(nameFieldSelector);
    const mensajeCampo = formulario.querySelector(messageFieldSelector);

    const nombre = sanitizarTextoPlano(nombreCampo?.value || '');
    if (!NAME_SAFE_REGEX.test(nombre)) {
        actualizarFeedbackFormulario(feedback, 'El nombre solo puede tener letras, espacios, apostrofes o guiones.', 'error');
        nombreCampo?.focus();
        return false;
    }

    const mensaje = sanitizarTextoPlano(mensajeCampo?.value || '');
    if (!allowEmptyMessage && mensaje.length < minMessageLength) {
        actualizarFeedbackFormulario(feedback, `El mensaje es muy corto. Minimo ${minMessageLength} caracteres.`, 'error');
        mensajeCampo?.focus();
        return false;
    }

    if (mensaje.length > 0) {
        const linksEncontrados = mensaje.match(LINK_PATTERN) || [];
        if (linksEncontrados.length > maxLinks) {
            actualizarFeedbackFormulario(feedback, 'Tu mensaje tiene demasiados enlaces. Reduce la cantidad e intenta de nuevo.', 'error');
            mensajeCampo?.focus();
            return false;
        }
    }

    const ahoraMs = Date.now();
    const estadoPrevio = leerEstadoAntiFlood(cooldownKey);
    if (estadoPrevio?.ts && ahoraMs - estadoPrevio.ts < FORM_COOLDOWN_MS) {
        const restante = Math.ceil((FORM_COOLDOWN_MS - (ahoraMs - estadoPrevio.ts)) / 1000);
        actualizarFeedbackFormulario(feedback, `Espera ${restante}s antes de volver a enviar.`, 'error');
        return false;
    }

    const firmaMensaje = `${nombre.toLowerCase()}|${mensaje.toLowerCase()}`;
    if (estadoPrevio?.signature === firmaMensaje && estadoPrevio?.ts && ahoraMs - estadoPrevio.ts < FORM_DUPLICATE_WINDOW_MS) {
        actualizarFeedbackFormulario(feedback, 'Ese mensaje ya fue enviado hace poco. Evita duplicados.', 'error');
        return false;
    }

    return true;
}

async function enviarFormularioAjax(formulario, config) {
    if (!formulario || !config?.boton || !config?.feedback) return;

    if (!formulario.checkValidity()) {
        formulario.reportValidity();
        return;
    }

    const honeypot = formulario.querySelector('input[name="website"]');
    if (honeypot && honeypot.value.trim() !== '') return;

    sanitizarFormulario(formulario);

    if (typeof config.validarAntesDeEnviar === 'function') {
        const esValido = config.validarAntesDeEnviar();
        if (!esValido) return;
    }

    actualizarFeedbackFormulario(config.feedback, 'Enviando mensaje...');
    alternarCargaBoton(config.boton, true);

    try {
        const data = new FormData(formulario);
        if (typeof config.extraDataBuilder === 'function') {
            const extraData = config.extraDataBuilder();
            Object.entries(extraData || {}).forEach(([key, value]) => {
                data.append(key, value);
            });
        }

        data.append('_subject', config.subject || 'Nuevo mensaje desde MesaMap');

        const response = await fetch(FORM_ENDPOINT_URL, {
            method: 'POST',
            body: data,
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const result = await response.json();
        const envioExitoso = result?.success === true || result?.success === 'true';
        if (!envioExitoso) {
            throw new Error('El servicio de formulario rechazo la solicitud.');
        }

        if (typeof config.registrarEnvioExitoso === 'function') {
            config.registrarEnvioExitoso();
        }

        actualizarFeedbackFormulario(config.feedback, config.successMessage || 'Mensaje enviado correctamente.', 'success');
        formulario.reset();
    } catch (error) {
        console.error('Error enviando formulario:', error);
        actualizarFeedbackFormulario(config.feedback, config.errorMessage || 'No se pudo enviar en este momento. Intentalo de nuevo.', 'error');
    } finally {
        alternarCargaBoton(config.boton, false);
    }
}
// ====== LÓGICA DEL CARRUSEL DE TEMAS DE CONTACTO ======

const radiosTemas = document.querySelectorAll('input[name="contact-topic"]');
const btnPrevTopic = document.getElementById('btn-prev-topic');
const btnNextTopic = document.getElementById('btn-next-topic');
const labelTemaActual = document.getElementById('carousel-topic-label');


let indiceTemaActual = 0; // Inicia en 0 (Queja)

function aplicarTemaContacto(indice) {
    if (radiosTemas.length === 0 || !contactForm || !contactMessageInput) return;

    // Marcamos el radio button oculto correspondiente
    const radioSeleccionado = radiosTemas[indice];
    radioSeleccionado.checked = true;

    // Extraemos los datos
    const colorTema = radioSeleccionado.dataset.tone || '#fa1010';
    const placeholderTema = radioSeleccionado.dataset.placeholder || 'Escribe tu mensaje...';
    const textoLabel = radioSeleccionado.dataset.label || 'Selecciona un tema';

    // Aplicamos los cambios a la interfaz
    contactForm.style.setProperty('--topic-color', colorTema);
    contactMessageInput.placeholder = placeholderTema;
    labelTemaActual.textContent = textoLabel;
}

function obtenerTemaContactoSeleccionado() {
    return Array.from(radiosTemas).find(radio => radio.checked) || radiosTemas[0];
}

if (radiosTemas.length > 0 && btnPrevTopic && btnNextTopic) {
    // Evento Flecha Izquierda
    btnPrevTopic.addEventListener('click', () => {
        indiceTemaActual = (indiceTemaActual - 1 + radiosTemas.length) % radiosTemas.length;
        aplicarTemaContacto(indiceTemaActual);
    });

    // Evento Flecha Derecha
    btnNextTopic.addEventListener('click', () => {
        indiceTemaActual = (indiceTemaActual + 1) % radiosTemas.length;
        aplicarTemaContacto(indiceTemaActual);
    });

    // Inicialización
    aplicarTemaContacto(indiceTemaActual);
}

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const validar = () => {
            const esSeguro = validarCamposSeguridad({
                formulario: contactForm,
                feedback: contactFeedback,
                cooldownKey: CONTACT_COOLDOWN_KEY,
                nameFieldSelector: '#input-nombre-contact',
                messageFieldSelector: '#input-mensaje-contact',
                minMessageLength: 12,
                maxLinks: 2
            });

            if (!esSeguro) return false;

            const emailCampo = contactForm.querySelector('#input-email-contact');
            const emailLimpio = sanitizarTextoPlano(emailCampo?.value || '').toLowerCase();
            if (!emailLimpio || !emailCampo?.checkValidity()) {
                actualizarFeedbackFormulario(contactFeedback, 'Introduce un correo valido para poder responderte.', 'error');
                emailCampo?.focus();
                return false;
            }

            return true;
        };

        await enviarFormularioAjax(contactForm, {
            boton: document.getElementById('btn-enviar-contacto'),
            feedback: contactFeedback,
            subject: 'MesaMap | Nuevo mensaje de contacto',
            successMessage: 'Mensaje enviado correctamente. Revisa tu correo si deseas confirmar el envio.',
            errorMessage: 'No se pudo enviar el mensaje ahora. Intentalo nuevamente en unos minutos.',
            validarAntesDeEnviar: validar,
            extraDataBuilder: () => {
                const tema = obtenerTemaContactoSeleccionado();
                const emailCampo = contactForm.querySelector('#input-email-contact');
                return {
                    _template: 'table',
                    _captcha: 'false',
                    _replyto: sanitizarTextoPlano(emailCampo?.value || '').toLowerCase(),
                    tema: tema?.value || 'otro',
                    tema_label: tema?.dataset?.label || 'Sin tema'
                };
            },
            registrarEnvioExitoso: () => {
                const nombre = sanitizarTextoPlano(contactForm.querySelector('#input-nombre-contact')?.value || '');
                const mensaje = sanitizarTextoPlano(contactForm.querySelector('#input-mensaje-contact')?.value || '');
                guardarEstadoAntiFlood(CONTACT_COOLDOWN_KEY, {
                    ts: Date.now(),
                    signature: `${nombre.toLowerCase()}|${mensaje.toLowerCase()}`
                });
                indiceTemaActual = 0;
                aplicarTemaContacto(indiceTemaActual);
            }
        });
    });
}

if (suggestionForm) {
    suggestionForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const validar = () => {
            return validarCamposSeguridad({
                formulario: suggestionForm,
                feedback: suggestionFeedback,
                cooldownKey: SUGGESTION_COOLDOWN_KEY,
                nameFieldSelector: '#nombre-newlocal',
                messageFieldSelector: '#textarea-newlocal',
                minMessageLength: 8,
                maxLinks: 1,
                allowEmptyMessage: true
            });
        };

        await enviarFormularioAjax(suggestionForm, {
            boton: document.getElementById('btn-enviar-sugerencia'),
            feedback: suggestionFeedback,
            subject: 'MesaMap | Nueva sugerencia de negocio',
            successMessage: 'Gracias. Tu sugerencia fue enviada correctamente.',
            errorMessage: 'No se pudo enviar la sugerencia en este momento. Intenta otra vez.',
            validarAntesDeEnviar: validar,
            extraDataBuilder: () => ({
                _template: 'table',
                _captcha: 'false'
            }),
            registrarEnvioExitoso: () => {
                const nombre = sanitizarTextoPlano(suggestionForm.querySelector('#nombre-newlocal')?.value || '');
                const mensaje = sanitizarTextoPlano(suggestionForm.querySelector('#textarea-newlocal')?.value || '');
                guardarEstadoAntiFlood(SUGGESTION_COOLDOWN_KEY, {
                    ts: Date.now(),
                    signature: `${nombre.toLowerCase()}|${mensaje.toLowerCase()}`
                });
            }
        });
    });
}

cargarBaseDeDatos();
const botonLocalizar = document.getElementById('localizar');
activarConTecladoComoBoton(botonLocalizar);
// Variable global para no duplicar el marcador
let marcadorUsuario = null;
let anilloPrecisionUsuario = null;
let idSeguimientoUsuario = null;

const OPCIONES_GEO_PRECISA = {
    enableHighAccuracy: true,
    timeout: 12000,
    maximumAge: 0
};

const OPCIONES_GEO_FALLBACK = {
    enableHighAccuracy: false,
    timeout: 8000,
    maximumAge: 60000
};

function obtenerPosicion(options) {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, options);
    });
}

function calcularZoomPorPrecision(precisionMetros) {
    if (precisionMetros <= 25) return 17.3;
    if (precisionMetros <= 60) return 16.7;
    if (precisionMetros <= 120) return 16;
    return 15.2;
}

function estaEnBounds(lng, lat, limites) {
    if (!Array.isArray(limites) || limites.length !== 2) return true;
    const [sw, ne] = limites;
    return lng >= sw[0] && lng <= ne[0] && lat >= sw[1] && lat <= ne[1];
}

function actualizarMarcadorUsuario(lng, lat, precisionMetros) {
    if (!marcadorUsuario) {
        const contenedor = document.createElement('div');
        contenedor.className = 'user-location-marker-wrapper';

        anilloPrecisionUsuario = document.createElement('div');
        anilloPrecisionUsuario.className = 'user-location-accuracy';

        const punto = document.createElement('div');
        punto.className = 'user-location-marker';

        contenedor.appendChild(anilloPrecisionUsuario);
        contenedor.appendChild(punto);

        marcadorUsuario = new maplibregl.Marker({
            element: contenedor,
            anchor: 'center'
        })
            .setLngLat([lng, lat])
            .addTo(map);
    } else {
        marcadorUsuario.setLngLat([lng, lat]);
    }

    if (anilloPrecisionUsuario) {
        const radioPx = Math.max(28, Math.min((precisionMetros || 40) / 2.2, 110));
        const diametro = radioPx * 2;
        anilloPrecisionUsuario.style.width = `${diametro}px`;
        anilloPrecisionUsuario.style.height = `${diametro}px`;
    }
}

function procesarPosicionUsuario(posicion, debeCentrar) {
    const lon = Number(posicion.coords.longitude);
    const lat = Number(posicion.coords.latitude);
    const precision = Number(posicion.coords.accuracy || 0);

    if (!Number.isFinite(lon) || !Number.isFinite(lat)) {
        throw new Error('Coordenadas inválidas recibidas por el navegador.');
    }

    actualizarMarcadorUsuario(lon, lat, precision);

    if (!debeCentrar) return;

    const estaDentroDeZona = estaEnBounds(lon, lat, bounds);

    if (!estaDentroDeZona) {
        const lonTexto = lon.toFixed(6);
        const latTexto = lat.toFixed(6);
        alert(`Tu ubicación detectada está fuera del área del mapa.\nLng: ${lonTexto} | Lat: ${latTexto}`);
        return;
    }

    const zoomObjetivo = calcularZoomPorPrecision(precision);
    map.flyTo({
        center: [lon, lat],
        zoom: zoomObjetivo,
        essential: true
    });
}

function iniciarRefinamientoUbicacion(precisionInicial) {
    if (idSeguimientoUsuario !== null) {
        navigator.geolocation.clearWatch(idSeguimientoUsuario);
        idSeguimientoUsuario = null;
    }

    let mejorPrecision = precisionInicial;
    const inicio = Date.now();

    idSeguimientoUsuario = navigator.geolocation.watchPosition(
        (posicion) => {
            const nuevaPrecision = Number(posicion.coords.accuracy || 0);
            const mejoro = !Number.isFinite(mejorPrecision) || nuevaPrecision < mejorPrecision;

            if (mejoro) {
                mejorPrecision = nuevaPrecision;
                procesarPosicionUsuario(posicion, false);
            }

            const pasaron15s = Date.now() - inicio > 15000;
            const precisionBuena = Number.isFinite(mejorPrecision) && mejorPrecision <= 30;
            if (pasaron15s || precisionBuena) {
                navigator.geolocation.clearWatch(idSeguimientoUsuario);
                idSeguimientoUsuario = null;
            }
        },
        () => {
            if (idSeguimientoUsuario !== null) {
                navigator.geolocation.clearWatch(idSeguimientoUsuario);
                idSeguimientoUsuario = null;
            }
        },
        OPCIONES_GEO_PRECISA
    );
}
if (botonLocalizar) {
    botonLocalizar.addEventListener('click', async () => {
        if (!('geolocation' in navigator)) {
            alert('Tu navegador no soporta geolocalización.');
            return;
        }

        if (!window.isSecureContext && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') {
            alert('Para una ubicación más precisa en laptop, abre el sitio con HTTPS o en localhost.');
        }

        try {
            let posicion;

            try {
                posicion = await obtenerPosicion(OPCIONES_GEO_PRECISA);
            } catch (errorPreciso) {
                if (errorPreciso && (errorPreciso.code === 2 || errorPreciso.code === 3)) {
                    posicion = await obtenerPosicion(OPCIONES_GEO_FALLBACK);
                } else {
                    throw errorPreciso;
                }
            }

            procesarPosicionUsuario(posicion, true);
            iniciarRefinamientoUbicacion(Number(posicion.coords.accuracy || 0));
        } catch (error) {
            const mensaje = (error && error.message) ? error.message : 'No se pudo obtener tu ubicación.';
            console.error('Error de Geolocation API:', mensaje);
            alert('Error de ubicación: ' + mensaje);
        }
    });
}






const abiertoAhora = document.querySelector("input[value='abierto']");
const transferencia = document.querySelector('input[value="transferencia"]');
const domicilio = document.querySelector('input[value="domicilio"]');

abiertoAhora.checked = false;
transferencia.checked = false;
domicilio.checked = false;

