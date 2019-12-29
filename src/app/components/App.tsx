import * as React from 'react';
const mathjax = require('mathjax-full/js/mathjax.js').mathjax;
const TeX = require('mathjax-full/js/input/tex.js').TeX;
const SVG = require('mathjax-full/js/output/svg.js').SVG;
const liteAdaptor = require('mathjax-full/js/adaptors/liteAdaptor.js').liteAdaptor;
const RegisterHTMLHandler = require('mathjax-full/js/handlers/html.js').RegisterHTMLHandler;
const AllPackages = require('mathjax-full/js/input/tex/AllPackages.js').AllPackages;
import AceEditor from 'react-ace';

import 'ace-builds/src-noconflict/mode-latex';
import 'ace-builds/src-noconflict/theme-textmate';
import '../styles/ui.css';

declare function require(path: string): any;

const App = ({}) => {
    const [convert, setConvert] = React.useState(null);
    React.useEffect(() => {
        // https://github.com/mathjax/MathJax-demos-node/blob/master/direct/tex2svg
        const adaptor = liteAdaptor();
        RegisterHTMLHandler(adaptor);
        const tex = new TeX({packages: AllPackages});
        const svg = new SVG({fontCache: 'none'});
        const html = mathjax.document('', {InputJax: tex, OutputJax: svg});
        const cv = (input: string) => {
            const node = html.convert(input);
            return adaptor.innerHTML(node);
        };
        setConvert(() => cv);
    }, []);

    const [code, setCode] = React.useState('');
    const [preview, setPreview] = React.useState('');

    const onChange = React.useCallback(
        (value: string) => {
            setCode(value);
            setPreview(convert(value));
        },
        [convert]
    );
    const onCreate = React.useCallback(() => {
        // const count = parseInt(textbox.current.value, 10);
        const node = convert(code);
        parent.postMessage({pluginMessage: {type: 'create-latex-svg', svg: node, source: code}}, '*');
    }, [convert, code]);

    const onCancel = React.useCallback(() => {
        parent.postMessage({pluginMessage: {type: 'cancel'}}, '*');
    }, []);

    React.useEffect(() => {
        // This is how we read messages sent from the plugin controller
        window.onmessage = event => {
            const {type, message} = event.data.pluginMessage;
            if (type === 'create-rectangles') {
                console.log(`Figma Says: ${message}`);
            }
        };
    }, []);

    return (
        <div>
            <AceEditor
                mode="latex"
                theme="textmate"
                onChange={onChange}
                value={code}
                width="100%"
                height="75px"
                showGutter={false}
                focus={true}
                wrapEnabled={true}
                enableBasicAutocompletion={true}
                enableSnippets={true}
            />
            <div
                style={{
                    height: '75px',
                    width: '100%',
                    border: '1px solid gray',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    overflow: 'auto',
                }}
                dangerouslySetInnerHTML={{__html: preview}}
            />
            <button className="primary" onClick={onCreate}>
                Create
            </button>
            <button onClick={onCancel}>Cancel</button>
        </div>
    );
};

export default App;
