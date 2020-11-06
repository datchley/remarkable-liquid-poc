import React, { useContext, useEffect, useState } from "react";
import { Liquid } from "liquidjs";
import Tooltip, {TooltipTrigger, TooltipContent} from './Tooltip';
import { isObject, reduce, merge } from 'lodash';
// import { parse as FrontMatterParse } from "./FrontMatter";
import styles from './Liquid.module.scss';

export const ScopeContext = React.createContext({});

const engine = new Liquid();

const noop = () => undefined;

const flattenKeys = (obj, path = []) =>
    !isObject(obj)
        ? { [path.join('.')]: obj }
        : reduce(obj, (cum, next, key) => merge(cum, flattenKeys(next, [...path, key])), {});

// let TokenKind = {
//   Number: 1,
//   Literal: 2,
//   Tag: 4,
//   Output: 8,
//   HTML: 16,
//   Filter: 32,
//   Hash: 64,
//   PropertyAccess: 128,
//   Word: 256,
//   Range: 512,
//   Quoted: 1024,
//   Operator: 2048
// };
// TokenKind.Delimited = TokenKind.Tag | TokenKind.Output;

// const TokenMap = Object.keys(TokenKind).reduce((map, k) => {
//   map[TokenKind[k]] = k;
//   return map;
// }, {});
// console.log(TokenMap);

// var doc = document.querySelector("#parse-example").content.textContent;
// const results = engine.parse(doc);
// console.log(typeof results, results);

// console.group("=== Parse Example ===");
// results.forEach((t) => {
//   let kind = TokenMap[t.token.kind];
//   if (kind === "HTML") {
//     return;
//   } else if (kind === "Output") {
//     let value = t.value;
//     let input = value.initial.input;
//     if (TokenMap[value.initial.kind] === "PropertyAccess") {
//       console.log("Prop Access:", input);
//     }
//   } else if (kind === "Tag") {
//     // Some operational tag, like an IF or FOR
//     let tag = t.token.name;
//     let impl = t.impl;
//     console.log("Tag:", tag);
//     if (tag === "for") {
//       // Handle for loop
//     }
//     if (tag === "if") {
//       // Handle for loop
//     }
//   } else {
//     // TODO
//   }
// });
// console.groupEnd();

//
// Dynamically Rendering components found
// in LiquidJS parsing
//
// const Components = {
//   if: If,
//   prop: PropAccess
// };

//
// tmpl is the original LiquidJS template string for
// the identified token type.  This component should be
// able to parse that, provide an editable version of that
// for rendering in the browser view, and be able to propagate
// any changes back to a handler that updates the original template
//
// const Liquid = ({ tmpl, ...props}) => {
//   // component does exist
//   if (typeof Components[block.component] !== "undefined") {
//     return React.createElement(Components[block.component], {
//       key: block._uid,
//       block: block
//     });
//   }
//   // component doesn't exist yet
//   return React.createElement(
//     () => <div>The component {block.component} has not been created yet.</div>,
//     { key: block._uid }
//   );
// }

export const LiquidProp = ({ text="", onChange=noop, ...rest}) => {
  const context = useContext(ScopeContext);
  const [tmpl, setTemplate] = useState(() => engine.parse(text));
  const [html, setHTML] = useState("");

  useEffect(() => {
    setTemplate(engine.parse(text));
  }, [text]);

  useEffect(() => {
    setHTML(engine.renderSync(tmpl, context))
  }, [tmpl, context]);

  const handleChange = ev => {
    let val = ev.target.value;
    onChange && onChange({ old: text, changed: `{{ ${val} }}` });
  };

  console.log("[Liquid Prop]", text, rest, tmpl);
  return (
    <Tooltip id="tippy">
      <TooltipTrigger as="div">
        <span contentEditable={true} className="liquid liquid-prop" dangerouslySetInnerHTML={{ __html: html }}>
        </span>
      </TooltipTrigger>
      <TooltipContent placement="top">
        <div className="content tooltip-menu">
          <span className="is-size-5 has-text-grey-light is-family-code">{"{"}prop{"}"}</span>
          <div className="field is-inline-block">
            <div className="control has-icons-left">
              <div className="select is-small">
                <select value={tmpl[0].token.content} className={styles.select} onChange={handleChange}>
                  { Object.entries(flattenKeys(context)).map(([key,val]) => {
                      return <option>{key}</option>
                    })
                  }
                </select>
              </div>
              <div className="icon is-small is-left">
                <i className="fas fa-globe"></i>
              </div>
            </div>
          </div>
        </div>
      </TooltipContent>
    </Tooltip>
  );
};
export const LiquidIf = ({ text="", ...rest }) => {
  const context = useContext(ScopeContext);
  const [tmpl, setTemplate] = useState(() => engine.parse(text));
  const [html, setHTML] = useState("");

  useEffect(() => {
    setTemplate(engine.parse(text));
  }, [text]);

  useEffect(() => {
    setHTML(engine.renderSync(tmpl, context))
  }, [tmpl, context]);

  console.log("[Liquid If]", text, context);
  return (
    <span contentEditable={true} className="liquid liquid-if" dangerouslySetInnerHTML={{ __html: html }}>
    </span>
  );
};
