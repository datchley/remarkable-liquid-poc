// Export function to take remarkable instance and add parsers

export default (md) => {
    //
    // Remarkable Custom Parsers
    //
    md.inline.ruler.push("liquid_prop", (state, silent, ...rest) => {
        // Where '<liquid-*>' is your markdown identifier
        let tags = { start: "<liquid-prop>", end: "</liquid-prop>" };
        if (!state.src.substr(state.pos).startsWith(tags.start)) return false;

        console.group("liquid-prop");
        let length = tags.start.length + tags.end.length;

        if (!silent) {
            let start = state.pos;
            let end = state.src.substr(start + tags.start.length).indexOf(tags.end);
            // Liquid syntax within start/end tags
            let text = state.src.substr(start + tags.start.length, end);
            length += text.length;
            console.log(`prop: text=[${text}]`);
            state.push({
                type: "liquid-prop",
                text: text,
                level: state.level,
                position: []
            });
        }

        console.groupEnd("liquid-prop");


        state.tokens[state.tokens.length - 1].position = [state.pos, state.pos+length];
        state.pos += length;

        return true;
    });

    md.block.ruler.before('code',
    "liquid_if",
    (state, start_line, end_line, silent) => {
        console.log("HERE");
        function get(line) {
        const pos = state.bMarks[line];
        const max = state.eMarks[line];

        return state.src.substr(pos, max - pos);
        }
        console.group("liquid-if");
        
        console.log(state);
        if (!get(start_line).match(/^<liquid-if>$/)) {
        console.groupEnd("liquid-if");
        return false;
        }
        if (silent) {
        return true;
        }

        console.log({ state, start_line, end_line, silent });

        const data = [];

        let line;
        for (line = start_line + 1; line < end_line; line++) {
        const str = get(line);
        if (str.match(/^<\/liquid-if>$/)) {
            break;
        }
        data.push(str);
        }

        console.groupEnd("liquid-if");

        if (line >= end_line) {
        return false;
        }

        state.tokens.push({
            type: "liquid-if",
            text: data.join("\n"),
            level: state.level
        });

        state.line = ++line;

        return true;
    },
    {}
    );

}