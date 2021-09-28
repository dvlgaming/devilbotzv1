const { WAConnection, Browsers } = require('@adiwajshing/baileys')
const { color, bgcolor } = require('./lib/color')
const fs = require("fs-extra")
const figlet = require('figlet')
const { uncache, nocache } = require('./lib/loader')
const setting = JSON.parse(fs.readFileSync('./setting.json'))
const welcome = require('./message/group')
baterai = 'unknown'
charging = 'unknown'

//nocache
require('./Devil.js')
nocache('../Devil.js', module => console.log(color('[WATCH]', 'cyan'), color(`'${module}'`, 'green'), 'File is updated!'))
require('./message/group.js')
nocache('../message/group.js', module => console.log(color('[WATCH]', 'cyan'), color(`'${module}'`, 'green'), 'File is updated!'))

const starts = async (Devil = new WAConnection()) => {
	Devil.logger.level = 'warn'
	console.log(color(figlet.textSync('Devil~', {
		font: 'Standard',
		horizontalLayout: 'default',
		vertivalLayout: 'default',
		width: 80,
		whitespaceBreak: false
	}), 'cyan'))
	console.log(color('YOUTUBE DEVILBOTZ', 'cyan'), color('Owner is online now!!', 'green'))
	console.log(color('YOUTUBE DEVILBOTZ', 'cyan'), color('Welcome Back, Owner!!', 'green'))
	Devil.browserDescription = ["Devil", "Firefox", "3.0.0"];

	// Menunggu QR
	Devil.on('qr', () => {
		console.log(color('[', 'white'), color('!', 'red'), color(']', 'white'), color('Scan Qr Nya'))
	})

	// Menghubungkan
	fs.existsSync(`./${setting.sessionName}.json`) && Devil.loadAuthInfo(`./${setting.sessionName}.json`)
	Devil.on('connecting', () => {
		console.log(color('SYSTEM', 'yellow'), color('PROSES....'));
	})

	//connect
	Devil.on('open', () => {
		console.log(color('SYSTEM', 'yellow'), color('SUKSES TERHUBUNG'));
	})

	// session
	await Devil.connect({
		timeoutMs: 30 * 1000
	})
	fs.writeFileSync(`./${setting.sessionName}.json`, JSON.stringify(Devil.base64EncodedAuthInfo(), null, '\t'))

	// Baterai
	Devil.on('CB:action,,battery', json => {
		global.batteryLevelStr = json[2][0][1].value
		global.batterylevel = parseInt(batteryLevelStr)
		baterai = batterylevel
		if (json[2][0][1].live == 'true') charging = true
		if (json[2][0][1].live == 'false') charging = false
		console.log(json[2][0][1])
		console.log('Baterai : ' + batterylevel + '%')
	})
	global.batrei = global.batrei ? global.batrei : []
	Devil.on('CB:action,,battery', json => {
		const batteryLevelStr = json[2][0][1].value
		const batterylevel = parseInt(batteryLevelStr)
		global.batrei.push(batterylevel)
	})

	// welcome
	Devil.on('group-participants-update', async (anu) => {
		await welcome(Devil, anu)
	})

	Devil.on('chat-update', async (message) => {
		require('./Devil.js')(Devil, message)
	})
}

starts()