"use client";
import React, { useState } from 'react';
import MarkdownEditor from '@uiw/react-markdown-editor';
import remarkGfm from 'remark-gfm';

const MarkdownEditorComponent = ({ initialValue, onChange, theme }) => {
    const [content, setContent] = useState(initialValue);

    const handleEditorChange = (value) => {
        setContent(value);
        onChange(value);
    };

    return (
        <MarkdownEditor
            value={initialValue}
            height="600px"
            onChange={handleEditorChange}
            theme={theme}
        />
    );
};

export default MarkdownEditorComponent;
