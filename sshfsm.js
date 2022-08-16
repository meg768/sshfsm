#!/usr/bin/env node

var fs    = require('fs');
var path  = require('path');
var yargs = require('yargs');

/*
https://swizec.com/blog/making-a-node-cli-both-global-and-local
*/

class App {

	constructor() {
		this.fileName = __filename;
        this.debug = console.debug;
	}

    async exec(cmd) {
		const ChildProcess = require("child_process");

		return new Promise((resolve, reject) => {
			this.debug(`Running command "${cmd}".`);

			ChildProcess.exec(cmd, async (error, stdout, stderr) => {
				if (error) {
					reject(error);
				}
				else if (stderr) {
					reject(new Error(stderr));
				}
				else {
					resolve(stdout);
				}
			});
	
		});
	}


	async mount(argv) {

		try {
			await this.exec('which which');
		}
		catch(error) {
			throw new Error('which is not installed.');
		}

		try {
			await this.exec('which sshfs');
		}
		catch(error) {
			throw new Error('sshfs is not installed.');
		}
		
		const mkpath = require('yow/mkpath');
		const os = require('os');
		const driveName = `${argv.user}@${argv.host}`;
		//const driveName = `${argv.host}`;

		if (!argv.host) {
			throw new Error('A host must be specified.');
		}

		var mountPath = `${os.homedir()}/.sshfs/drives/${driveName}`;

		// Create directory...
		mkpath(mountPath);

		var unmountCommand = `umount ${mountPath}`;
		var mountCommand = `sshfs ${driveName}:${argv.path} ${mountPath} -o volname=${driveName} -o allow_other `;

		try {
			await this.exec(unmountCommand);
		}
		catch (error) {
//			console.log(error.message);
			
		}

 		await this.exec(mountCommand);
	}



	run() {

		try {
			yargs.scriptName('sshfsm');
			yargs.usage('Usage: $0 [options]');

			yargs.help();

            yargs.option('host',   {describe:'Name of host or IP-address', type: 'strig', default:undefined});
            yargs.option('user', {describe:'Username', type: 'strig', default:'root'});
            yargs.option('path', {describe:'Remote location/path on host', type: 'strig', default:'/'});
			yargs.wrap(null);

            this.mount(yargs.argv);


		}
		catch(error) {
			console.error(error);
		}

	};

};


var app = new App();
app.run();
