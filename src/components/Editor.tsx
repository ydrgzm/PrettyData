import React, { useEffect, useRef, useState } from 'react';
// Import the monaco instance directly from our loader
import monaco, { loadLanguage } from '@/lib/monaco-loader';
import type { editor } from 'monaco-editor';

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
  const [isLoading, setIsLoading] = useState(true);

  // Initialize Monaco Editor
  useEffect(() => {
    // Skip if no DOM element or Monaco already initialized
    if (!editorRef.current || monacoEditorRef.current) return;

    const initMonaco = async () => {
      setIsLoading(true);
      try {
        // Load language support for the current language
        await loadLanguage(language === 'yaml' ? 'yaml' : (language === 'xml' ? 'xml' : 'json'));
        
        // Only initialize if component is still mounted
        if (!editorRef.current) return;

        // Adjust the language value for Monaco Editor
        const monacoLanguage = language === 'yaml' ? 'yaml' : (language === 'xml' ? 'xml' : 'json');
        
        // Create editor instance
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
        monacoEditorRef.current.addCommand(
          monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, 
          () => {
            document.querySelector<HTMLButtonElement>('button[aria-label="Format"]')?.click();
          }
        );
      } catch (error) {
        console.error('Error initializing Monaco Editor:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initMonaco();

    // Cleanup on unmount
    return () => {
      monacoEditorRef.current?.dispose();
      monacoEditorRef.current = null;
    };
  }, [editorRef]);

  // Update the editor when language changes
  useEffect(() => {
    if (!monacoEditorRef.current) return;
    
    const updateLanguage = async () => {
      try {
        // Load the new language if needed
        await loadLanguage(language === 'yaml' ? 'yaml' : (language === 'xml' ? 'xml' : 'json'));
        
        // Update editor model language
        const monacoLanguage = language === 'yaml' ? 'yaml' : (language === 'xml' ? 'xml' : 'json');
        if (monacoEditorRef.current?.getModel()) {
          monaco.editor.setModelLanguage(monacoEditorRef.current.getModel()!, monacoLanguage);
        }
      } catch (error) {
        console.error('Error updating language:', error);
      }
    };
    
    updateLanguage();
  }, [language]);

  // Update the editor when value changes from parent
  useEffect(() => {
    if (!monacoEditorRef.current) return;

    const currentValue = monacoEditorRef.current.getValue();
    if (value !== currentValue) {
      monacoEditorRef.current.setValue(value);
    }
  }, [value]);

  // Update theme when dark mode changes
  useEffect(() => {
    if (!monacoEditorRef.current) return;
    monaco.editor.setTheme(isDarkMode ? 'vs-dark' : 'vs');
  }, [isDarkMode]);

  return (
    <div className="relative w-full h-full">
      <div 
        ref={editorRef} 
        className="w-full h-full" 
        style={{ 
          opacity: isLoading ? 0.6 : 1,
          transition: 'opacity 0.3s ease'  
        }} 
      />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/60">
          <div className="flex flex-col items-center gap-2">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
            <p className="text-xs text-muted-foreground">Loading editor...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Editor;
