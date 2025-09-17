import React, { useState, useEffect, useRef } from 'react';

const DynamicRichTextEditor = ({ 
  value, 
  onChange, 
  placeholder = 'Write something...', 
  readOnly = false,
  height = '300px'
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [quillInstance, setQuillInstance] = useState(null);
  const editorRef = useRef(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    // Dynamically import Quill and react-quilljs
    const loadQuill = async () => {
      try {
        // Import Quill CSS first
        await import('quill/dist/quill.snow.css');
        
        // Then import the libraries
        const { useQuill } = await import('react-quilljs');
        
        setIsLoaded(true);
      } catch (error) {
        console.error('Failed to load Quill:', error);
      }
    };

    loadQuill();
  }, []);

  // Create Quill instance after dynamic import
  useEffect(() => {
    if (isLoaded && editorRef.current && !quillInstance) {
      const initializeQuill = async () => {
        try {
          const Quill = (await import('quill')).default;
          
          const quill = new Quill(editorRef.current, {
            placeholder,
            readOnly,
            theme: 'snow',
            modules: {
              toolbar: readOnly ? false : [
                ['bold', 'italic', 'underline', 'strike'],
                [{ list: 'ordered' }, { list: 'bullet' }],
                [{ header: [1, 2, 3, 4, 5, 6, false] }],
                [{ align: [] }],
                ['clean']
              ]
            },
            formats: [
              'bold', 'italic', 'underline', 'strike',
              'list', 'bullet', 'header',
              'align'
            ]
          });

          setQuillInstance(quill);
        } catch (error) {
          console.error('Failed to initialize Quill:', error);
        }
      };

      initializeQuill();
    }
  }, [isLoaded, placeholder, readOnly]);

  // Set initial content
  useEffect(() => {
    if (quillInstance && !readOnly && !initializedRef.current) {
      if (value) {
        try {
          quillInstance.clipboard.dangerouslyPasteHTML(value);
          quillInstance.setSelection(quillInstance.getLength(), 0);
          initializedRef.current = true;
        } catch (error) {
          console.warn('Failed to set initial Quill content:', error);
        }
      }
    }
  }, [quillInstance, value, readOnly]);

  // Handle content changes
  useEffect(() => {
    if (quillInstance && !readOnly) {
      const handleChange = () => {
        if (onChange) {
          try {
            const html = quillInstance.root.innerHTML;
            const selection = quillInstance.getSelection();
            onChange(html === '<p><br></p>' ? '' : html);
            if (selection) {
              setTimeout(() => quillInstance.setSelection(selection), 1);
            }
          } catch (error) {
            console.warn('Error handling Quill change:', error);
          }
        }
      };

      quillInstance.on('text-change', handleChange);

      return () => {
        quillInstance.off('text-change', handleChange);
      };
    }
  }, [quillInstance, onChange, readOnly]);

  if (!isLoaded) {
    return (
      <div 
        style={{ height }}
        className="border border-gray-300 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-800 flex items-center justify-center"
      >
        <span className="text-gray-500 dark:text-gray-400">Loading editor...</span>
      </div>
    );
  }

  return (
    <div style={{ height }}>
      <div ref={editorRef} className="h-full" />
    </div>
  );
};

export default DynamicRichTextEditor;