import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import TurndownService from 'turndown';

interface MarkdownEditorProps {
  value: string;
  onChange: (markdown: string) => void;
  className?: string;
}

const turndownService = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced'
});

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({ value, onChange, className }) => {
  // Convert initial markdown to HTML
  const [html, setHtml] = useState('');

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['blockquote', 'code-block'],
      ['link', 'image'],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'blockquote', 'code-block',
    'link', 'image'
  ];

  const handleChange = (content: string) => {
    setHtml(content);
    const markdown = turndownService.turndown(content);
    onChange(markdown);
  };

  return (
    <div className={`bg-white ${className}`}>
      <ReactQuill
        theme="snow"
        value={html}
        onChange={handleChange}
        modules={modules}
        formats={formats}
        className="min-h-[200px]"
      />
    </div>
  );
};

export default MarkdownEditor;
