const colors = require("colors");
const OS = require("os");

module.exports = {
  compiledSources(options, sources) {
    if (!sources) return;
    const logger = options.logger || console;
    sources.forEach(source => logger.log("    > " + source));
  },

  finishJob(options, config) {
    const logger = options.logger || console;
    const { compilersInfo } = config;
    if (!options.quiet) {
      if (Object.keys(compilersInfo).length > 0) {
        logger.log(OS.EOL + `Compiled successfully using:` + OS.EOL);
        for (const name in compilersInfo) {
          logger.log(`    > ${name}: ${compilersInfo[name].version}`);
        }
      } else {
        logger.log(OS.EOL + `Compilation successful`);
      }
      logger.log();
    }
  },

  initializeListeners(options) {
    const { emitter } = options;
    emitter.on("compile:startJob", this.startJob.bind(this, options));
    emitter.on("compile:finishJob", this.finishJob.bind(this, options));
    emitter.on(
      "compile:writeArtifacts",
      this.writeArtifacts.bind(this, options)
    );
    emitter.on("compile:warnings", this.warnings.bind(this, options));
    emitter.on(
      "compile:compiledSources",
      this.compiledSources.bind(this, options)
    );
    emitter.on(
      "compile:nothingToCompile",
      this.nothingToCompile.bind(this, options)
    );
  },

  nothingToCompile(options) {
    const logger = options.logger || console;
    logger.log(
      `Everything is up to date, there is nothing to compile.` + OS.EOL
    );
  },

  startJob(options) {
    const logger = options.logger || console;
    logger.log(OS.EOL + "Starting compilation");
    logger.log("====================" + OS.EOL);
  },

  warnings(options, warnings) {
    const logger = options.logger || console;
    logger.log(colors.yellow("    > compilation warnings encountered:"));
    logger.log(warnings.map(warning => warning.formattedMessage).join());
  },

  writeArtifacts(options) {
    const logger = options.logger || console;
    logger.log(
      `    > artifacts written to ${options.contracts_build_directory}`
    );
  }
};