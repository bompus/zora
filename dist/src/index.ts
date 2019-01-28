import {harnessFactory, TestHarness} from './harness';
import {
    BooleanAssertionFunction,
    ComparatorAssertionFunction, ErrorAssertionFunction,
    MessageAssertionFunction,
    TestFunction
} from './assertion';
import {mochaTapLike, tapeTapLike} from './reporter';

let autoStart = true;
let indent = false;
const defaultTestHarness = harnessFactory();

interface RootTest extends TestFunction {
    indent: () => void;
}

const rootTest = defaultTestHarness.test.bind(defaultTestHarness);
rootTest.indent = () => indent = true;

export {tapeTapLike, mochaTapLike} from './reporter';
export {AssertPrototype, assert} from './assertion';
export const test: RootTest = rootTest;
export const equal: ComparatorAssertionFunction = defaultTestHarness.equal.bind(defaultTestHarness);
export const equals = equal;
export const eq = equal;
export const deepEqual = equal;

export const notEqual: ComparatorAssertionFunction = defaultTestHarness.notEqual.bind(defaultTestHarness);
export const notEquals = notEqual;
export const notEq = notEqual;
export const notDeepEqual = notEqual;

export const is: ComparatorAssertionFunction = defaultTestHarness.is.bind(defaultTestHarness);
export const same = is;

export const isNot: ComparatorAssertionFunction = defaultTestHarness.isNot.bind(defaultTestHarness);
export const notSame = isNot;

export const ok: BooleanAssertionFunction = defaultTestHarness.ok.bind(defaultTestHarness);
export const truthy = ok;

export const notOk: BooleanAssertionFunction = defaultTestHarness.notOk.bind(defaultTestHarness);
export const falsy = notOk;

export const fail: MessageAssertionFunction = defaultTestHarness.fail.bind(defaultTestHarness);

export const throws: ErrorAssertionFunction = defaultTestHarness.throws.bind(defaultTestHarness);
export const doesNotThrow: ErrorAssertionFunction = defaultTestHarness.doesNotThrow.bind(defaultTestHarness);

/**
 * If you create a test harness manually, report won't start automatically and you will
 * have to call the report method yourself. This can be handy if you wish to use another reporter
 * @returns {TestHarness}
 */
export const createHarness = (): TestHarness => {
    autoStart = false;
    return harnessFactory();
};

const start = () => {
    if (autoStart) {
        defaultTestHarness.report(indent ? mochaTapLike : tapeTapLike);
    }
};

// on next tick start reporting
// @ts-ignore
if (typeof window === 'undefined') {
    setTimeout(start, 0);
} else {
    // @ts-ignore
    window.addEventListener('load', start);
}