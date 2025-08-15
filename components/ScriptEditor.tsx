"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { X, Save, Upload, Download } from "lucide-react";

interface ScriptEditorProps {
  script: string;
  onScriptChange: (script: string) => void;
  onClose: () => void;
}

export function ScriptEditor({ script, onScriptChange, onClose }: ScriptEditorProps) {
  const [editedScript, setEditedScript] = useState(script);

  const handleSave = () => {
    onScriptChange(editedScript);
    onClose();
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.txt';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          setEditedScript(content);
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleExport = () => {
    const blob = new Blob([editedScript], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'teleprompter-script.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const wordCount = editedScript.trim().split(/\s+/).length;
  const estimatedTime = Math.ceil(wordCount / 150); // Assuming 150 words per minute

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">Edit Script</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </Button>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-2 p-4 border-b bg-gray-50">
          <Button
            variant="outline"
            size="sm"
            onClick={handleImport}
            className="flex items-center gap-2"
          >
            <Upload size={16} />
            Import
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            className="flex items-center gap-2"
          >
            <Download size={16} />
            Export
          </Button>
          <div className="text-sm text-gray-600 ml-auto">
            {wordCount} words • ~{estimatedTime} min read
          </div>
        </div>

        {/* Editor */}
        <div className="flex-1 p-4">
          <textarea
            value={editedScript}
            onChange={(e) => setEditedScript(e.target.value)}
            className="w-full h-full resize-none border rounded-md p-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your script here..."
            style={{ minHeight: '300px' }}
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 p-4 border-t bg-gray-50">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="flex items-center gap-2">
            <Save size={16} />
            Save Script
          </Button>
        </div>
      </div>
    </div>
  );
}