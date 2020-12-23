import LevainCli from './levain_cli.ts';
import TestHelper from "./lib/test/test_helper.ts";
import {assertEquals,} from "https://deno.land/std/testing/asserts.ts";

Deno.test('should be able to list packages', () => {
    const levainCli = new LevainCli()
    const myArgs = {
        _: ['list']
    }

    levainCli.execute(myArgs)
})
Deno.test('levainCli should list commands available', async () => {
    const logger = await TestHelper.setupTestLogger()
    const levainCli = new LevainCli()

    levainCli.showCliHelp()


    assertEquals(
        logger.messages,
        [
            "INFO ",
            "INFO Commands available:",
            "INFO   actions <optional search text>",
            "INFO   install <package name>",
            "INFO   list <optional search text>",
            "INFO   shell <optional package name>",
        ]
    )
})