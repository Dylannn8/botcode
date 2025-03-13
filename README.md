

# Instalación y Uso del Bot

Este bot está diseñado para funcionar en **Termux (Android)** y **Linux**. Sigue los pasos a continuación para instalarlo y ejecutarlo.

---

## Requisitos previos

- **Termux**: Asegúrate de tener Termux instalado desde [F-Droid](https://f-droid.org/en/packages/com.termux/).
- **Linux**: Asegúrate de tener Node.js (v16 o superior) y Git instalados.

---

## Instalación en Termux (Android)

1. Abre Termux y ejecuta los siguientes comandos:

```bash
pkg update && pkg upgrade -y
pkg install git nodejs wget unzip -y
git clone https://github.com/Dylannn8/botcode
cd botcode
npm install
bash install.sh
```

3. Inicia el bot:

```bash
npm start
```

---

## Instalación en Linux

1. Abre una terminal y ejecuta los siguientes comandos:

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install git nodejs npm wget unzip -y
git clonehttps://github.com/Dylannn8/botcode
cd botcode
npm install
npm install express
npm install ngrok
wget https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-v3-stable-linux-amd64.tgz
tar -xvzf ngrok-v3-stable-linux-amd64.tgz
sudo mv ngrok /usr/local/bin
chmod +x /usr/local/bin/ngrok
mkdir -p ~/.config/ngrok
ngrok --version
```

2. Configura el Authtoken de ngrok:

3. Inicia el bot:

```bash
npm start
```

---

## Uso del Bot

1. **Configurar ngrok**:
   - Envía el comando `.ngrok TU_AUTHTOKEN_AQUÍ` para configurar ngrok.

2. **Crear un túnel**:
   - Envía el comando `.crear` para iniciar ngrok y obtener la URL pública.

3. **Enviar datos**:
   - Usa el comando `.datos` para enviar datos capturados al bot.

---

## Notas adicionales

- **Authtoken de ngrok**: Obtén tu Authtoken desde [Ngrok Dashboard](https://dashboard.ngrok.com/get-started/your-authtoken).
- **Dependencias adicionales**: Si el bot requiere otras dependencias (como `ffmpeg` o `libwebp`), instálalas según sea necesario.

---

## Soporte

Si encuentras algún problema, contacta al programador

---

¡Disfruta usando el bot! 😊
