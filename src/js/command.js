
module.exports = class Command {

    constructor(options) {
        var {command, description} = options;

        this.command = command;
        this.description = description;
        this.debug = () => {};

        this.builder = (yargs) => {
            this.options(yargs);
        };

        this.handler = (argv) => {
			this.argv = argv;
			this.debug = typeof argv.debug === 'function' ? argv.debug : (argv.debug ? console.log : () => {});

			return new Promise((resolve, reject) => {
				this.run().then(() => {
				})
				.catch((error) => {
					console.error(error);
	
				})
				.then(() => {
					resolve();
				});
			})
        };
    }

	getDescription() {
		return 'Description';
	}

    options(yargs) {
        yargs.usage(`Usage: $0 ${this.command}`);
        yargs.option('debug', {describe: 'Debug mode', type:'boolean'});
    }

    async run() {
    }

};



