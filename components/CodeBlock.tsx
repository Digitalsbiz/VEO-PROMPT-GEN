
import React, { useState, useMemo } from 'react';
import { CopyIcon, CheckIcon } from './icons';

interface CodeBlockProps {
    code: string;
    customCss?: string;
}

// Basic JSON syntax highlighter that wraps tokens in spans with classes.
const highlightJson = (json: string): string => {
    if (!json) return '';
    // Escape basic HTML entities to prevent injection
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    // Regex to find JSON tokens: strings, numbers, booleans, null
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, (match) => {
        let cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return `<span class="${cls}">${match}</span>`;
    });
};

export const CodeBlock: React.FC<CodeBlockProps> = ({ code, customCss }) => {
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        });
    };

    const highlightedCode = useMemo(() => highlightJson(code), [code]);

    return (
        <div className="relative group json-formatter-container">
            {customCss && <style>{customCss}</style>}
            <button
                onClick={handleCopy}
                className="absolute top-2 right-2 p-2 bg-slate-700 rounded-md text-slate-300 hover:bg-slate-600 hover:text-white transition-all duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100"
                aria-label="Copy code"
            >
                {isCopied ? <CheckIcon className="w-5 h-5 text-green-400" /> : <CopyIcon className="w-5 h-5" />}
            </button>
            <pre className="text-sm overflow-x-auto p-1">
                <code
                    className="language-json text-slate-300"
                    dangerouslySetInnerHTML={{ __html: highlightedCode }}
                />
            </pre>
        </div>
    );
};
