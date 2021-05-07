import { createCounter } from '../counter.js';
import { createStack } from './stack.js';
import { createWriter } from './writer.js';
import { eventuallySetExitCode, isAssertionFailing } from '../utils.js';
import { MESSAGE_TYPE } from '../protocol.js';

const writeMessage = ({ writer, stack }) => {
  const writeTable = {
    [MESSAGE_TYPE.TEST_START](message) {
      stack.push(message.data.description);
    },
    [MESSAGE_TYPE.TEST_END]() {
      stack.pop();
    },
    [MESSAGE_TYPE.ASSERTION](message) {
      if (isAssertionFailing(message)) {
        writer.printTestPath(stack);
        writer.printLocation(message.data.at);
        writer.printDiagnostic(message.data);
      }
    },
  };

  return (message) => writeTable[message.type]?.(message);
};

export const createDiffReporter = () => async (messageStream) => {
  const counter = createCounter();
  const stack = createStack();
  const writer = createWriter();
  const write = writeMessage({ writer, stack });

  for await (const message of messageStream) {
    write(message);
    counter.increment(message);
    eventuallySetExitCode(message);
  }
  writer.printSummary(counter);
};