import * as log from "https://deno.land/std/log/mod.ts";

import ConsoleAndFileLogger from './lib/logger/console_and_file_logger.ts'
import {parseArgs} from "./lib/parse_args.ts";
import {Timer} from "./lib/timer.ts";
import LevainCli from "./levain_cli.ts";
import CliUtil from "./lib/cli_util.ts";
import { I18N, __ } from './lib/i18n.ts';

export default class Levain {
    logFiles: string[] = [];
    timer = new Timer()
    logger: ConsoleAndFileLogger | undefined;

    myArgs: any;
    error = false;

    async runLevinWithLog(cmdArgs: string[] = []): Promise<ConsoleAndFileLogger | undefined> {
        try {
            this.myArgs = parseArgs(cmdArgs, {
                stringOnce: [
                    "email-domain",
                    "locale"
                ],
                stringMany: [
                    "levainHome",
                    "addRepo",
                    "add-log",
                    "add-log-dir",
                ],
                boolean: [
                    "askPassword", // FIXME: Deprecated
                    "ask-login",
                    "ask-password",
                    "ask-email",
                    "ask-fullname",
                    "wait-to-begin",
                    "wait-after-end",
                ]
            });

            I18N.setup(this.myArgs.locale);
            await this.prepareLogs(this.myArgs);

            log.info("");
            await new LevainCli().execute(this.myArgs);

        } catch (err) {

            log.error("");
            log.error("********************************************************************************");
            log.error("");
            log.error(err);
            log.error("");
            log.error("********************************************************************************");
            log.error("");

            this.error = true;
        } finally {

            log.info("");
            this.logger?.showLogFiles(this.logFiles);

            log.info("");
            log.info(__`Levain ran in ${this.timer.humanize()}`)
            this.logger?.flush()

            if (this.error) {
                log.error(__('execution FAILED'))
            } else {
                log.info(__('execution SUCCESS'))
            }

            if (this.error || (this.myArgs && this.myArgs["wait-after-end"])) {
                console.log("");
                prompt("Hit ENTER to finish");
            }
        }

        return this.logger
    }

    async prepareLogs(myArgs: any): Promise<ConsoleAndFileLogger> {
        this.logFiles = this.getLogFiles(myArgs['add-log'], myArgs['add-log-dir'])
        this.logger = await ConsoleAndFileLogger.setup(this.logFiles);
        log.info('')
        log.info(__('Hi!'))
        this.logger.showLogFiles(this.logFiles);
        if (myArgs['add-log'] || myArgs['add-log-dir']) {
            CliUtil.askToContinue()
        }
        return this.logger
    }

    getLogFiles(
        extraLogFiles: string[] = [],
        extraLogDirs: string[] = [],
    ): string[] {
        let logFiles = []
        logFiles.push(ConsoleAndFileLogger.getLogFileInHomeFolder())
        logFiles.push(ConsoleAndFileLogger.getLogFileInTempFolder())
        logFiles = logFiles.concat(extraLogFiles)
        log.debug(`extraLogFiles [${extraLogFiles}] ${logFiles.length}`)
        extraLogDirs.forEach(extraDir => {
            logFiles.push(ConsoleAndFileLogger.getLogFileInExtraDir(extraDir))
        })
        log.debug(`extraLogDirs ${extraLogDirs} ${logFiles.length}`)
        log.debug(`logFiles.length ${logFiles.length}`)
        return logFiles
    }

}

// https://deno.land/manual/tools/script_installer
if (import.meta.main) {
    await new Levain().runLevinWithLog(Deno.args);
    console.log(__("Bye!"));
}
