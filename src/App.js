import React, { useEffect, useState } from "react";
import { Remarkable } from "remarkable";
import RemarkableReactRenderer from "remarkable-react";
import addParsers from './remarkable-parsers.js';
import set from 'lodash/set';
import { LiquidProp, LiquidIf, ScopeContext } from "./Liquid";

import "./styles.css";
import "bulma/css/bulma.min.css";

const md = new Remarkable("full", {
  html: true,
  typographer: true
});

// Add additional parsers to handle Liquid embeds in Markdown
addParsers(md);

//
// Allow Remarkable to render React components
//
// md.renderer = new RemarkableReactRenderer({
//   components: {
//     /**
//      * Custom components that are defined in the tokens
//      * section below.
//      */
//     liquid_prop: (props) => <LiquidProp onChange={handleChange} {...props} />,
//     liquid_if: LiquidIf
//   },

//   // This enables you to configure the mapping of remarkable tokens to component (above).
//   // The value can either be a Function, String or Array.
//   //
//   // > Array[String]: Will nest components from parent down.
//   // > String: Used to map directly to a single component.
//   // > Function(tokenObject, remarkableOptions): Return a string or Component.
//   //
//   tokens: {
//     // Use this to also handle your custom remarkable tokens!
//     "liquid-prop": "liquid_prop",
//     "liquid-if": "liquid_if"
//   }
// });

const Template = ({ tmpl, scope }) => {
  return (
    <ScopeContext.Provider value={scope}>
    { md.render(tmpl) }
    </ScopeContext.Provider>  
  );
}

export default function App() {
  const [tmpl, setTemplate] = useState("");
  const [env, setEnv] = useState({
    color: "blue",
    frontMatter: { title: "Help", author: "David" }
  });

  const handleChange = (path) => (ev) => {
    let value = ev.target.value;
    let next = { ...env };
    next = set(next, path, value)
    setEnv(next);
  }

  const handleLiquidChange = ({ old, changed }) => {
    console.log('Got change:', { old, changed });
    setTemplate(tmpl.replace(old, changed));
  }

  useEffect(() => {
    fetch("/template.md").then((res) => {
      if (res.ok) {
        res.text().then((text) => {
          // console.log(text);
          setTemplate(text);
        });
      }
    });
  }, []);

  md.renderer = new RemarkableReactRenderer({
    components: {
      liquid_prop: (props) => <LiquidProp onChange={handleLiquidChange} {...props} />,
      liquid_if: LiquidIf
    },
    tokens: {
      "liquid-prop": "liquid_prop",
      "liquid-if": "liquid_if"
    }
  });


  return (
    <div className="App container is-widescreen">
      <h1 className="is-size-1">Markdown + Liquid Test</h1>
      <div className="state-form">
        <h3 className="is-size-3">Edit State Context</h3>
        <div className="field">
            <label className="label">Title</label>
            <div className="control">
              <input className="input" type="text" value={env.frontMatter.title} onChange={handleChange('frontMatter.title')} />
            </div>
        </div>
        <div className="field">
            <label className="label">Author</label>
            <div className="control">
              <input className="input" type="text" value={env.frontMatter.author} onChange={handleChange('frontMatter.author')} />
            </div>
        </div>
        <div className="field">
            <label className="label">Color</label>
            <div className="control">
              <input className="input" type="text" value={env.color} onChange={handleChange('color')} />
            </div>
        </div>
      </div>
      <div className="container">
        <div className="columns">
          <div className="column content">
            <Template tmpl={tmpl} scope={env} />
          </div>
          <div className="column">
            <pre><code>
              {tmpl}
            </code></pre>
          </div>
        </div>
      </div>
    </div>
  );
}
