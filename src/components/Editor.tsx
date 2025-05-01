
import React, { useEffect, useRef } from 'react';
import * as monaco from 'monaco-editor';
import { editor } from 'monaco-editor';

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  language: string;
  isDarkMode: boolean;
  readOnly?: boolean;
}

const Editor: React.FC<EditorProps> = ({ value, onChange, language, isDarkMode, readOnly = false }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const monacoEditorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  useEffect(() => {
    if (editorRef.current) {
      // Adjust the language value for Monaco Editor
      const monacoLanguage = language === 'yaml' ? 'yaml' : (language === 'xml' ? 'xml' : 'json');
      
      monacoEditorRef.current = monaco.editor.create(editorRef.current, {
        value: value,
        language: monacoLanguage,
        theme: isDarkMode ? 'vs-dark' : 'vs',
        automaticLayout: true,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        lineNumbers: 'on',
        wordWrap: 'on',
        wrappingIndent: 'same',
        tabSize: 2,
        fontSize: 14,
        readOnly: readOnly,
      });

      // Subscribe to changes if not readOnly
      if (!readOnly) {
        monacoEditorRef.current.onDidChangeModelContent(() => {
          const currentValue = monacoEditorRef.current?.getValue() || '';
          onChange(currentValue);
        });
      }

      // Handle keyboard shortcuts
      monacoEditorRef.current.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
        document.querySelector<HTMLButtonElement>('button[aria-label="Format"]')?.click();
      });

      return () => {
        monacoEditorRef.current?.dispose();
      };
    }
  }, [editorRef, isDarkMode, readOnly]);

  // Update the editor when language changes
  useEffect(() => {
    if (monacoEditorRef.current) {
      const monacoLanguage = language === 'yaml' ? 'yaml' : (language === 'xml' ? 'xml' : 'json');
      monaco.editor.setModelLanguage(monacoEditorRef.current.getModel()!, monacoLanguage);
    }
  }, [language]);

  // Update the editor when value changes from parent
  useEffect(() => {
    if (monacoEditorRef.current) {
      const currentValue = monacoEditorRef.current.getValue();
      if (value !== currentValue) {
        monacoEditorRef.current.setValue(value);
      }
    }
  }, [value]);

  // Update theme when dark mode changes
  useEffect(() => {
    if (monacoEditorRef.current) {
      monaco.editor.setTheme(isDarkMode ? 'vs-dark' : 'vs');
    }
  }, [isDarkMode]);

  return (
    <div ref={editorRef} style={{ width: '100%', height: '100%' }} />
  );
};

export default Editor;
