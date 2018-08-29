const ARGS = {
    KEY_REQUIRED: 1,
    VALUE_REQUIRED: 2,
    NO_VALUE: 4
};

const padLeftWithDash = (str, level) => {
    let ret = '';
    for (var i=0; i<level; i++) ret += '-';
    return ret + str;
}

const determineParamLeverl = (param) => {
    var c = 0;
    for(var i=0; i<param.length; i++){
        if (param[i] === '-') c++;
    }
    return c;
}

function structuralArgument (structure, params, level, startAt) {
    var x = {};
    for (var i=startAt; i<params.length; i++) {
        if (params[i] === undefined) continue;

        const paramKeyValue = params[i].split('=');
        const paramLevel = determineParamLeverl(paramKeyValue[0]);
        const paramKey = paramKeyValue[0].slice(paramLevel);

        if (paramLevel > level) return `ERROR: no child config for key ${paramKeyValue[0]}.`;
        else if (paramLevel < level) break;

        if (paramKey in structure) {
            const option = structure[paramKey].__option;
            const values = structure[paramKey].__values;

            if ((option & ARGS.VALUE_REQUIRED) === ARGS.VALUE_REQUIRED) {
                if (paramKeyValue[1]) {
                    if (!values || (values.length > 0 && values.includes(paramKeyValue[1]))) {
                        x[paramKey] = { value: paramKeyValue[1] };
                    } else {
                        return `ERROR: possible values are [${values.join(',')}]`;
                    }
                } else {
                    return `ERROR: key '${paramKeyValue[0]}' need value. (e.g. ${paramKeyValue[0]}=value`;
                }
            }

            if ((option & ARGS.NO_VALUE) === ARGS.NO_VALUE) {
                if (paramKeyValue[1]) {
                    return `ERROR: key '${paramKeyValue[0]}' doesn't need value. (e.g. ${paramKeyValue[0]})`;
                }
            }

            const inner = structuralArgument(structure[paramKey], params, level+1, i+1);

            if (typeof inner === 'string') return inner + `\nERROR: parent key ${paramKeyValue[0]}`;

            params[i] = undefined;

            x[paramKey] = {
                ...x[paramKey],
                ...inner
            };
        } else {
            return `ERROR: could not find configuration key ${paramKeyValue[0]}`;
        }
    }

    const names = Object.getOwnPropertyNames(structure);

    for (var i=0; i<names.length; i++) {
        if ((structure[names[i]].__option & ARGS.KEY_REQUIRED) === ARGS.KEY_REQUIRED) {
            if (!(names[i] in x)) {
                return `ERROR: key ${names[i]} is a required field, could not find in your arguments`;
            }
        }
    }
    return x;
}

module.exports = {
    ARGS,
    parseArguments: (structure, params) => {
        return structuralArgument(structure, params, 1, 0);
    }
}