const express = require("express")
const chalk = require('chalk')
const shell = require('shelljs')
const bodyParser = require('body-parser')
const morgan = require('morgan')

const app = express()
const PORT = process.env.PORT || 3000

app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
	extended: true
}))

app.get('/',(req,res) => {
	res.send(
		`<h1>CLOUD STORAGE API</h1>
		<h3>Mini project for college which turns any host on network into a HTTP cloud storage service. <br />
		This project is specifically designed for local area networks to host a Cloud-like storage system and providing a level of abstraction over CLI based methods like SSH or telnet for accessing the server.</h3>`
	)
})

app.get('/showFileContents/:file',(req,res) => {
	const file = req.params.file
	if(!file || file.trim().length == 0)
		res.json({msg: 'File param not sent'})
	else {
		const contents = shell.cat(`cloud/${file}`)
		if(contents.code == 1) {
			console.log(chalk.blue(`No file named '${chalk.cyan(file)}' exists inside ${chalk.yellow('cloud')} folder`))
	 		res.json({msg: `No file named '${file}' exists inside 'cloud' folder`})	
		}
		else {
			console.log(chalk.blue(`Contents of the file '${chalk.cyan(file)}' inside ${chalk.yellow('cloud')} folder are ${chalk.blue(contents == '' ? 'Empty': contents)}`))
		 	res.json({msg: `Contents of the file '${file}' inside 'cloud' folder are '${contents == '' ? 'Empty': contents}'`})
	 	}
	 }
})

app.post('/createDirectory',(req,res) => {
	const folder = req.body.folder
	if(!folder || folder.trim().length == 0)
		res.json({msg: 'Folder param not sent'})
	else {
		shell.mkdir('-p',`cloud/${folder}`)
		console.log(chalk.blue(`Folder ${chalk.cyan(folder)} created inside ${chalk.yellow('cloud')} folder`))
	 	res.json({msg: `Folder '${folder}' created inside 'cloud/' folder`})
	 }
})

app.post('/removeDirectory',(req,res) => {
	const folder = req.body.folder
	if(!folder || folder.trim().length == 0)
		res.json({msg: 'Folder param not sent'})
	else {
		shell.rm('-rf',`cloud/${folder}`)
		console.log(chalk.blue(`Folder ${chalk.cyan(folder)} deleted inside ${chalk.yellow('cloud')} folder`))
	 	res.json({msg: `Folder '${folder}' deleted inside 'cloud/' folder`})
	 }
})

app.post('/createFile',(req,res) => {
	const file = req.body.file
	if(!file || file.trim().length == 0)
		res.json({msg: 'File param not sent'})
	else {
		shell.touch(`cloud/${file}`)
		console.log(chalk.blue(`File ${chalk.cyan(file)} created inside ${chalk.yellow('cloud')} folder`))
	 	res.json({msg: `File '${file}' created inside 'cloud/' folder`})
	 }
})

app.post('/removeFile',(req,res) => {
	const file = req.body.file
	if(!file || file.trim().length == 0)
		res.json({msg: 'File param not sent'})
	else {
		const rm = shell.rm(`cloud/${file}`)
		if(rm.code != 0) {
			console.log(chalk.blue(`No file named '${chalk.cyan(file)}' exists inside ${chalk.yellow('cloud')} folder`))
	 		res.json({msg: `No file named '${file}' exists inside 'cloud' folder`})	
		}
		else {
			console.log(chalk.blue(`File ${chalk.cyan(file)} removed from ${chalk.yellow('cloud')} folder`))
		 	res.json({msg: `File '${file}' removed from 'cloud/' folder`})
		}
	 }
})

app.listen(PORT,() => {
	console.log(chalk.blue.bold(`Listening on PORT ${chalk.cyan.underline(`http://localhost:${PORT}`)}`))
})