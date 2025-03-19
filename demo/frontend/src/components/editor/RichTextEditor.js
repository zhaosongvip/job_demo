import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Box } from '@mui/material';

const RichTextEditor = forwardRef(({ value, onChange, readOnly = false }, ref) => {
  const quillRef = useRef(null);

  useImperativeHandle(ref, () => ({
    getEditor: () => quillRef.current?.getEditor()
  }));

  const modules = {
    toolbar: readOnly ? false : [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],
      ['link', 'image'],
      ['clean']
    ],
    clipboard: {
      matchVisual: false // 禁用粘贴格式匹配以避免警告
    }
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'color', 'background',
    'align',
    'link', 'image'
  ];

  if (readOnly) {
    return (
      <Box
        className="ql-editor"
        sx={{
          '& p': { my: 1 },
          '& h1, & h2, & h3, & h4, & h5, & h6': { my: 2 },
          '& img': { maxWidth: '100%', height: 'auto' },
          '& ul, & ol': { my: 1, pl: 4 },
          '& blockquote': {
            borderLeft: '4px solid #ccc',
            pl: 2,
            my: 2,
            color: 'text.secondary'
          },
          '& pre': {
            backgroundColor: '#f8f9fa',
            p: 2,
            borderRadius: 1,
            overflowX: 'auto'
          },
          '& a': {
            color: 'primary.main',
            textDecoration: 'none',
            '&:hover': {
              textDecoration: 'underline'
            }
          }
        }}
        dangerouslySetInnerHTML={{ __html: value || '' }}
      />
    );
  }

  return (
    <Box sx={{
      '& .ql-container': {
        minHeight: '200px',
        fontSize: '1rem',
        fontFamily: 'inherit'
      },
      '& .ql-editor': {
        minHeight: '200px',
        '&.ql-blank::before': {
          color: 'rgba(0,0,0,0.38)',
          fontStyle: 'normal'
        }
      },
      '& .ql-toolbar': {
        borderTopLeftRadius: 1,
        borderTopRightRadius: 1,
        backgroundColor: '#f8f9fa'
      },
      '& .ql-container': {
        borderBottomLeftRadius: 1,
        borderBottomRightRadius: 1
      }
    }}>
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value || ''}
        onChange={onChange}
        modules={modules}
        formats={formats}
        readOnly={readOnly}
        preserveWhitespace={true}
      />
    </Box>
  );
});

RichTextEditor.displayName = 'RichTextEditor';

export default RichTextEditor; 