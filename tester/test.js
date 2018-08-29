global.totalTestRuns = 0;
global.totalTestPass = 0;
global.testFails = {};

if (!global.test) {
    var runningTestName = '';

    global.test = (testName, callback) => {
        runningTestName = testName;
        callback();
    }

    global.verify = (actualObject) => {
        totalTestRuns++;

        return {
            toMatch: (expectedObject) => {
                const actual = JSON.stringify(actualObject);
                const expect = JSON.stringify(expectedObject);

                const result = actual == expect;

                totalTestPass += result ? 1: 0;

                console.log(`test ${result?'pass':'fail'}: ${runningTestName}`);

                if (!result) {
                    if (!global.testFails[global.runningTestFile]) {
                        global.testFails[global.runningTestFile] = { tests: [] };
                    }
                    if (!global.testFails[global.runningTestFile].tests.includes(runningTestName)) {
                        global.testFails[global.runningTestFile].tests.push(runningTestName);
                    }

                    console.log(`actual: ${actual}`);
                    console.log(`expect: ${expect}\n`);
                }
            }
        }
    }
}