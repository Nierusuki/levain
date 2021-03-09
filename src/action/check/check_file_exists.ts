import * as log from "https://deno.land/std/log/mod.ts";

import Config from "../../lib/config.ts";
import Package from '../../lib/package/package.ts';
import {parseArgs} from "../../lib/parse_args.ts";

import Action from "../action.ts";

export default class CheckFileExists implements Action {
    constructor(private config: Config) {
    }

    // deno-lint-ignore require-await
    async execute(pkg: Package | undefined, parameters: string[]): Promise<void> {
        const args = parseArgs(parameters, {})

        if (!args._ || args._.length < 1) {
            throw new Error(`You must inform at least one filename to check`)
        }

        const files: string[] = args._
        log.info(`CHECK-FILE-EXISTS ${files.toString()}`)

        let fileExists = false
        const promises = files.map(async (file) => {
                try {
                    let fileStat = await Deno.stat(file)
                    log.debug(`${file} - ${fileStat.isFile}`)
                    if (fileStat.isFile) fileExists = true
                    else log.debug(`NOT A FILE: ${file}`)

                } catch (error) {
                    log.debug(`NOT FOUND: ${file}`)
                }
            }
        );

        await Promise.all(promises);

        if (fileExists) return

        throw new Error(`None of the informed files exist - ${files.toString()}`)
    }
}
