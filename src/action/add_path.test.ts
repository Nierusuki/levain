import {assert, assertArrayIncludes,} from "https://deno.land/std/testing/asserts.ts";

import TestHelper from '../lib/test/test_helper.ts';

import ActionFactory from './action_factory.ts';
import AddPathAction from "./add_path.ts";

Deno.test('AddPathAction should be obtainable with action factory', () => {
    const config = TestHelper.getConfig()
    const factory = new ActionFactory()
    const action = factory.get("addPath", config)

    assert(action instanceof AddPathAction)
})
Deno.test('AddPathAction should add to path config', async () => {
    const config = TestHelper.getConfig()
    const action = new AddPathAction(config)

    await action.execute(TestHelper.mockPackage(), [TestHelper.folderThatAlwaysExists])

    assertArrayIncludes(config.context.action.addpath.path, [TestHelper.folderThatAlwaysExists])
})
