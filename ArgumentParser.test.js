var { ARGS, parseArguments } = require('./ArgumentParser');
require('@test');

const workflow =
{
    check: {
        __option: ARGS.NO_VALUE,
        status: { __option: ARGS.VALUE_REQUIRED },
        user: { __option: ARGS.VALUE_REQUIRED }
    },
    help: {
        __option: ARGS.NO_VALUE
    },
    list: {
        __option: ARGS.NO_VALUE,
        status: { __option: ARGS.VALUE_REQUIRED, __values: ['running', 'killed'] },
    },
    test1: {
        r: { __option: ARGS.KEY_REQUIRED },
    },
    test2: {
        r: { __option: ARGS.VALUE_REQUIRED }
    },
    submit: {
        __option: ARGS.VALUE_REQUIRED,
        LANGUAGE_ID: { __option: ARGS.KEY_REQUIRED + ARGS.VALUE_REQUIRED },
        DEVICE_ID: { __option: ARGS.KEY_REQUIRED + ARGS.VALUE_REQUIRED },
        SEOEXPID_B: { __option: ARGS.KEY_REQUIRED + ARGS.VALUE_REQUIRED },
    }
}

test('option no_value', () => {
    const result = parseArguments(workflow, ['-list']);
    verify(result).toMatch({ list: {} });
});

test('option key_required', () => {
    const result = parseArguments(workflow, ['-test1', '--r']);
    verify(result).toMatch({ test1: { r: { } } });
});

test('option value_required', () => {
    const result = parseArguments(workflow, ['-test2', '--r=john']);
    verify(result).toMatch({ test2: { r: { value: 'john' }} });
});

test('option values', () => {
    const result1 = parseArguments(workflow, ['-list', '--status=running']);
    verify(result1).toMatch({ list: { status: { value: 'running' }} });

    const result2 = parseArguments(workflow, ['-list', '--status=killed']);
    verify(result2).toMatch({ list: { status: { value: 'killed' }} });
});

test('combined option key_required and value_required', () => {
    const result = parseArguments(workflow, ['-submit=1234', '--LANGUAGE_ID=0', '--DEVICE_ID=1', '--SEOEXPID_B=BAY-123-B']);
    verify(result).toMatch({ submit: { value: '1234', LANGUAGE_ID: { value: '0' }, DEVICE_ID: { value: '1'}, SEOEXPID_B: { value: 'BAY-123-B' }} });
});

// // correct test  cases
// // workflow -check => { check: {} }
// console.log(structuralArgument(workflow, ['-check'], 1, 0));

// // workflow -check --status=running --user=it-oggy => { check: { status: { value: 'running' }, user: { value: 'it-oggy' } } }
// console.log(structuralArgument(workflow, ['-check', '--status=running', '--user=it-oggy'], 1, 0));

// // workflow -help => { help: {} }
// console.log(structuralArgument(workflow, ['-help'], 1, 0));

// // workflow -list => { list: {} }
// console.log(structuralArgument(workflow, ['-list'], 1, 0));

// // workflow -list --filter=strat => { list: { filter: { value: 'strat' } } }
// console.log(structuralArgument(workflow, ['-list', '--filter=strat'], 1, 0));

// // workflow -submit=324124 --LANGUAGE_ID=1 --DEVICE_ID=0 --SEOEXPID_B=BAY-TEST-01
// // { submit:
// //     { value: '324124',
// //      LANGUAGE_ID: { value: '1' },
// //      DEVICE_ID: { value: '0' },
// //      SEOEXPID_B: { value: 'BAY-TEST-01' } } }
// console.log(structuralArgument(workflow, ['-submit=324124', '--LANGUAGE_ID=1', '--DEVICE_ID=0', '--SEOEXPID_B=BAY-TEST-01'], 1, 0));



// // incorrect test cases
// // workflow -check=1234
// // ERROR: key '-check' doesn't need value. (e.g. -check)
// console.log(structuralArgument(workflow, ['-check=1234'], 1, 0));

// // workflow -check --status=running ---name=hello
// // ERROR: could not find configuration key ---name
// // ERROR: parent key --status
// // ERROR: parent key -check
// console.log(structuralArgument(workflow, ['-check', '--status=running', '---name=hello'], 1, 0));

// // workflow -check --name=hello
// // ERROR: could not find configuration key --name
// // ERROR: parent key -check
// console.log(structuralArgument(workflow, ['-check', '--name=hello'], 1, 0));

// // workflow -check -status=running
// // ERROR: could not find configuration key -status
// console.log(structuralArgument(workflow, ['-check', '-status=running'], 1, 0));

// // workflow -test  =>
// // ERROR: key r is a required field, could not find in your arguments
// // ERROR: parent key -test
// console.log(structuralArgument(workflow, ['-test'], 1, 0));

// // workflow => {}
// console.log(structuralArgument(workflow, [], 1, 0));

// // workflow -submit=324124 --LANGUAGE_ID=1 --DEVICE_ID=0 --SEOEXPID_B
// // ERROR: key '--SEOEXPID_B' need value. (e.g. --SEOEXPID_B=value
// // ERROR: parent key -submit
// console.log(structuralArgument(workflow, ['-submit=324124', '--LANGUAGE_ID=1', '--DEVICE_ID=0', '--SEOEXPID_B'], 1, 0));

// workflow -check --status=running => { check: { status: { value: 'running' } } }
// console.log(structuralArgument(workflow, ['-check', '--status=running'], 1, 0));



//console.log(structuralArgument(workflow, ['-list', '--status=running'], 1, 0));
