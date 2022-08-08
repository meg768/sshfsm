
const Command = require('../js/command.js');
const fs = require('fs');
const Path = require('path');
const ChildProcess = require("child_process");

module.exports = class extends Command {

    constructor(options) {

        super({command: 'mount [options]', description: 'Mounts a drive', ...options}); 
    }

    options(args) {
        super.options(args);
		args.option('pi',   {describe:'Name of Pi or IP-address', type: 'strig', default:undefined});
		args.option('user', {describe:'Username on your Pi', type: 'strig', default:'root'});
		args.option('path', {describe:'Remote location/path on the Pi', type: 'strig', default:'/'});
    }

	async setup() {
		const mkpath = require('yow/mkpath');

		mkpath(`~/.sshfs/${this.argv.pi}`);
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

	async run() {

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
		const driveName = `${this.argv.user}@${this.argv.pi}`;

		if (!this.argv.pi) {
			throw new Error('A pi must be specified.');
		}

		var mountPath = `${os.homedir()}/.sshfs/drives/${driveName}`;

		// Create directory...
		mkpath(mountPath);

		var unmountCommand = `umount ${mountPath}`;
		var mountCommand = `sshfs ${driveName}:${this.argv.path} ${mountPath} -o volname=${driveName} -o allow_other `;

		try {
			await this.exec(unmountCommand);
		}
		catch (error) {
//			console.log(error.message);
			
		}

 		await this.exec(mountCommand);
	}

};




/*
sshfs 3rgw9i@ssh.loopia.se:/ -o allow_other -o default_permissions -o IdentityFile=~/.ssh/instalia -o volname=Loopia2 ./foo
*/