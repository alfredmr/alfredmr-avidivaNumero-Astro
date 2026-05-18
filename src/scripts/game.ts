import { t, type TranslationKey } from '../i18n';
import { applyTranslations } from './i18n-dom';

const CHARS = '0123456789ABCDEF!@#$%&*?█▓▒░';

let numeroSecreto: number | null = null;
let intentosRestantes = 3;
let glitchInterval: ReturnType<typeof setInterval> | null = null;
let juegoActivo = false;
let modoActual: 'manual' | 'aleatorio' = 'manual';

type MsgState = { key: TranslationKey; params?: Record<string, string | number>; tipo: string } | null;
let lastConfigMsg: MsgState = null;
let lastPistasMsg: MsgState = null;
let codigoRevelado = false;

const displaySecreto = document.getElementById('displaySecreto')!;
const secretoLabel = document.getElementById('secretoLabel')!;
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

function actualizarLabelSecreto(): void {
    secretoLabel.textContent = t(codigoRevelado ? 'secretDecrypted' : 'secretEncrypted');
}

function revelarNumeroArriba(): void {
    detenerGlitch();
    displaySecreto.textContent = String(numeroSecreto);
    displaySecreto.classList.remove('encriptado');
    displaySecreto.classList.add('revelado');
    codigoRevelado = true;
    actualizarLabelSecreto();
}

function ocultarDisplay(): void {
    detenerGlitch();
    displaySecreto.textContent = '???';
    displaySecreto.classList.add('encriptado');
    displaySecreto.classList.remove('revelado');
    codigoRevelado = false;
    actualizarLabelSecreto();
}

function actualizarDots(): void {
    for (let i = 1; i <= 3; i++) {
        const dot = document.getElementById('dot' + i)!;
        dot.classList.toggle('usado', i > intentosRestantes);
    }
}

function setMensaje(
    el: HTMLElement,
    key: TranslationKey | '',
    tipo: string,
    params?: Record<string, string | number>,
    store: 'config' | 'pistas' | null = null
): void {
    if (key === '') {
        el.innerHTML = '';
        el.className = '';
        if (store === 'config') lastConfigMsg = null;
        if (store === 'pistas') lastPistasMsg = null;
        return;
    }
    const state: MsgState = { key, params, tipo };
    if (store === 'config') lastConfigMsg = state;
    if (store === 'pistas') lastPistasMsg = state;
    el.innerHTML = t(key, params);
    el.className = tipo ? 'msg-' + tipo : '';
}

function replayMensajes(): void {
    if (lastConfigMsg) {
        setMensaje(mensajeConfig, lastConfigMsg.key, lastConfigMsg.tipo, lastConfigMsg.params);
    }
    if (lastPistasMsg) {
        setMensaje(mensajePistas, lastPistasMsg.key, lastPistasMsg.tipo, lastPistasMsg.params);
    }
}

function cambiarModo(modo: 'manual' | 'aleatorio'): void {
    modoActual = modo;
    btnModoManual.classList.toggle('activo', modo === 'manual');
    btnModoAleatorio.classList.toggle('activo', modo === 'aleatorio');
    bloqueManual.classList.toggle('oculto', modo !== 'manual');
    bloqueAleatorio.classList.toggle('oculto', modo !== 'aleatorio');
    setMensaje(mensajeConfig, '', '', undefined, 'config');
}

function generarNumeroAleatorio(): number {
    return Math.floor(Math.random() * 10) + 1;
}

function iniciarJuego(): void {
    if (modoActual === 'manual') {
        const valor = parseInt(numeroPensado.value);
        if (isNaN(valor) || valor < 1 || valor > 10) {
            setMensaje(mensajeConfig, 'msgInvalidConfig', 'warn', undefined, 'config');
            return;
        }
        numeroSecreto = valor;
    } else {
        numeroSecreto = generarNumeroAleatorio();
    }
    intentosRestantes = 3;
    juegoActivo = true;
    codigoRevelado = false;

    pasoConfiguracion.classList.add('oculto');
    pasoJuego.classList.remove('oculto');
    resultadoFinal.classList.add('oculto');
    btnReiniciar.classList.add('oculto');
    intentoUsuario.value = '';
    intentoUsuario.disabled = false;

    const msgKey = modoActual === 'aleatorio' ? 'msgStartRandom' : 'msgStartManual';
    setMensaje(mensajePistas, msgKey, 'info', undefined, 'pistas');
    actualizarDots();
    iniciarGlitch();
    actualizarLabelSecreto();
}

function verificarIntento(): void {
    if (!juegoActivo || intentosRestantes <= 0) return;

    const suposicion = parseInt(intentoUsuario.value);

    if (isNaN(suposicion) || suposicion < 1 || suposicion > 10) {
        setMensaje(mensajePistas, 'msgInvalidGuess', 'warn', undefined, 'pistas');
        return;
    }

    intentosRestantes--;
    actualizarDots();
    intentoUsuario.value = '';

    if (suposicion === numeroSecreto) {
        juegoActivo = false;
        revelarNumeroArriba();
        setMensaje(
            mensajePistas,
            'msgGuessSuccess',
            'success',
            { number: numeroSecreto! },
            'pistas'
        );
        intentoUsuario.disabled = true;
        btnReiniciar.classList.remove('oculto');
    } else if (intentosRestantes > 0) {
        setMensaje(
            mensajePistas,
            'msgGuessWrong',
            'error',
            { count: intentosRestantes },
            'pistas'
        );
    } else {
        juegoActivo = false;
        revelarNumeroArriba();
        setMensaje(mensajePistas, 'msgGameOver', 'error', undefined, 'pistas');
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

    setMensaje(mensajeConfig, '', '', undefined, 'config');
    setMensaje(mensajePistas, '', '', undefined, 'pistas');

    for (let i = 1; i <= 3; i++) {
        document.getElementById('dot' + i)!.classList.remove('usado');
    }
}

function onLocaleChange(): void {
    applyTranslations();
    actualizarLabelSecreto();
    replayMensajes();
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

window.addEventListener('localechange', onLocaleChange);

ocultarDisplay();
