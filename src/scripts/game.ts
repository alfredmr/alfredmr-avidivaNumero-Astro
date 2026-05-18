const CHARS = '0123456789ABCDEF!@#$%&*?█▓▒░';

let numeroSecreto: number | null = null;
let intentosRestantes = 3;
let glitchInterval: ReturnType<typeof setInterval> | null = null;
let juegoActivo = false;
let modoActual: 'manual' | 'aleatorio' = 'manual';

const displaySecreto = document.getElementById('displaySecreto')!;
const secretoLabel = document.querySelector('.secreto-label')!;
const btnModoManual = document.getElementById('btnModoManual')!;
const btnModoAleatorio = document.getElementById('btnModoAleatorio')!;
const bloqueManual = document.getElementById('bloqueManual')!;
const bloqueAleatorio = document.getElementById('bloqueAleatorio')!;
const mensajeConfig = document.getElementById('mensajeConfig')!;
const pasoConfiguracion = document.getElementById('pasoConfiguracion')!;
const pasoJuego = document.getElementById('pasoJuego')!;
const numeroPensado = document.getElementById('numeroPensado') as HTMLInputElement;
const btnIniciar = document.getElementById('btnIniciar')!;
const intentoUsuario = document.getElementById('intentoUsuario') as HTMLInputElement;
const btnGuess = document.getElementById('btnGuess')!;
const mensajePistas = document.getElementById('mensajePistas')!;
const resultadoFinal = document.getElementById('resultadoFinal')!;
const numeroOculto = document.getElementById('numeroOculto')!;
const btnReiniciar = document.getElementById('btnReiniciar')!;

function randomChar(): string {
    return CHARS[Math.floor(Math.random() * CHARS.length)];
}

function generarRuido(longitud = 3): string {
    return Array.from({ length: longitud }, randomChar).join('');
}

function iniciarGlitch(): void {
    detenerGlitch();
    displaySecreto.classList.add('encriptado');
    displaySecreto.classList.remove('revelado');
    glitchInterval = setInterval(() => {
        if (juegoActivo && numeroSecreto !== null) {
            displaySecreto.textContent = generarRuido(3);
        }
    }, 80);
}

function detenerGlitch(): void {
    if (glitchInterval) {
        clearInterval(glitchInterval);
        glitchInterval = null;
    }
}

function revelarNumeroArriba(): void {
    detenerGlitch();
    displaySecreto.textContent = String(numeroSecreto);
    displaySecreto.classList.remove('encriptado');
    displaySecreto.classList.add('revelado');
    secretoLabel.textContent = '◈ Código desencriptado ◈';
}

function ocultarDisplay(): void {
    detenerGlitch();
    displaySecreto.textContent = '???';
    displaySecreto.classList.add('encriptado');
    displaySecreto.classList.remove('revelado');
    secretoLabel.textContent = '◈ Código encriptado ◈';
}

function actualizarDots(): void {
    for (let i = 1; i <= 3; i++) {
        const dot = document.getElementById('dot' + i)!;
        dot.classList.toggle('usado', i > intentosRestantes);
    }
}

function setMensaje(el: HTMLElement, texto: string, tipo: string): void {
    el.innerHTML = texto;
    el.className = tipo ? 'msg-' + tipo : '';
}

function cambiarModo(modo: 'manual' | 'aleatorio'): void {
    modoActual = modo;
    btnModoManual.classList.toggle('activo', modo === 'manual');
    btnModoAleatorio.classList.toggle('activo', modo === 'aleatorio');
    bloqueManual.classList.toggle('oculto', modo !== 'manual');
    bloqueAleatorio.classList.toggle('oculto', modo !== 'aleatorio');
    setMensaje(mensajeConfig, '', '');
}

function generarNumeroAleatorio(): number {
    return Math.floor(Math.random() * 10) + 1;
}

function iniciarJuego(): void {
    if (modoActual === 'manual') {
        const valor = parseInt(numeroPensado.value);
        if (isNaN(valor) || valor < 1 || valor > 10) {
            setMensaje(mensajeConfig, '⚠ Ingresa un número válido entre 1 y 10.', 'warn');
            return;
        }
        numeroSecreto = valor;
    } else {
        numeroSecreto = generarNumeroAleatorio();
    }
    intentosRestantes = 3;
    juegoActivo = true;

    pasoConfiguracion.classList.add('oculto');
    pasoJuego.classList.remove('oculto');
    resultadoFinal.classList.add('oculto');
    btnReiniciar.classList.add('oculto');
    intentoUsuario.value = '';
    intentoUsuario.disabled = false;

    const msgInicio =
        modoActual === 'aleatorio'
            ? '🎲 Número aleatorio generado. ¡Adivina el código!'
            : '🔍 El código está encriptado arriba. ¡Adivina!';
    setMensaje(mensajePistas, msgInicio, 'info');
    actualizarDots();
    iniciarGlitch();
}

function verificarIntento(): void {
    if (!juegoActivo || intentosRestantes <= 0) return;

    const suposicion = parseInt(intentoUsuario.value);

    if (isNaN(suposicion) || suposicion < 1 || suposicion > 10) {
        setMensaje(mensajePistas, '⚠ Ingresa un número entre 1 y 10.', 'warn');
        return;
    }

    intentosRestantes--;
    actualizarDots();
    intentoUsuario.value = '';

    if (suposicion === numeroSecreto) {
        juegoActivo = false;
        revelarNumeroArriba();
        setMensaje(mensajePistas, `🎉 ¡INCREÍBLE! Adivinaste el código: ${numeroSecreto}`, 'success');
        intentoUsuario.disabled = true;
        btnReiniciar.classList.remove('oculto');
    } else if (intentosRestantes > 0) {
        setMensaje(mensajePistas, `❌ Incorrecto. Te quedan ${intentosRestantes} intento(s).`, 'error');
    } else {
        juegoActivo = false;
        revelarNumeroArriba();
        setMensaje(mensajePistas, '💀 GAME OVER — Se acabaron los intentos.', 'error');
        numeroOculto.textContent = String(numeroSecreto);
        resultadoFinal.classList.remove('oculto');
        intentoUsuario.disabled = true;
        btnReiniciar.classList.remove('oculto');
    }
}

function reiniciarJuego(): void {
    juegoActivo = false;
    numeroSecreto = null;
    intentosRestantes = 3;

    detenerGlitch();
    ocultarDisplay();

    pasoJuego.classList.add('oculto');
    pasoConfiguracion.classList.remove('oculto');
    numeroPensado.value = '';
    cambiarModo('manual');
    intentoUsuario.value = '';
    intentoUsuario.disabled = false;
    resultadoFinal.classList.add('oculto');
    btnReiniciar.classList.add('oculto');

    setMensaje(mensajeConfig, '', '');
    setMensaje(mensajePistas, '', '');

    for (let i = 1; i <= 3; i++) {
        document.getElementById('dot' + i)!.classList.remove('usado');
    }
}

btnModoManual.addEventListener('click', () => cambiarModo('manual'));
btnModoAleatorio.addEventListener('click', () => cambiarModo('aleatorio'));
btnIniciar.addEventListener('click', iniciarJuego);
btnGuess.addEventListener('click', verificarIntento);
btnReiniciar.addEventListener('click', reiniciarJuego);

document.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter') return;
    if (!pasoConfiguracion.classList.contains('oculto')) {
        iniciarJuego();
    } else if (juegoActivo) {
        verificarIntento();
    }
});

ocultarDisplay();
