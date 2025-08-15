"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Label } from "./ui/label";
import { X, Save, Upload, Download, FileText, Clock, Eye } from "lucide-react";

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
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
      <Card className="w-full max-w-4xl h-full sm:max-h-[90vh] sm:h-auto flex flex-col shadow-2xl border-0">
        {/* Header */}
        <CardHeader className="p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="w-6 h-6 text-blue-500" />
              <div>
                <CardTitle className="text-lg sm:text-xl">Script Editor</CardTitle>
                <CardDescription className="text-sm text-gray-600">Edit your teleprompter script</CardDescription>
              </div>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700 h-11 w-11 sm:h-10 sm:w-10 touch-none"
                >
                  <X size={20} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Close editor</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </CardHeader>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 px-3 sm:px-4 py-2 border-b bg-gray-50/50">
          <div className="flex items-center gap-2 flex-wrap">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleImport}
                  className="flex items-center gap-2 h-11 sm:h-9 px-3 sm:px-3 touch-none"
                >
                  <Upload size={16} />
                  <span className="hidden xs:inline">Import</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Import script from text file</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExport}
                  className="flex items-center gap-2 h-11 sm:h-9 px-3 sm:px-3 touch-none"
                >
                  <Download size={16} />
                  <span className="hidden xs:inline">Export</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Export script to text file</p>
              </TooltipContent>
            </Tooltip>
          </div>
          
          <div className="flex items-center gap-2 sm:ml-auto">
            <Badge variant="secondary" className="flex items-center gap-1">
              <FileText size={12} />
              {wordCount} words
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Clock size={12} />
              ~{estimatedTime} min
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Eye size={12} />
              Reading time
            </Badge>
          </div>
        </div>

        {/* Editor */}
        <CardContent className="flex-1 p-3 sm:p-4">
          <div className="relative">
            <Label htmlFor="script-textarea" className="text-sm font-medium text-gray-700 mb-2 block">
              Script Content
            </Label>
            <textarea
              id="script-textarea"
              value={editedScript}
              onChange={(e) => setEditedScript(e.target.value)}
              className="w-full h-full resize-none border rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base leading-relaxed touch-manipulation shadow-sm transition-all duration-200"
              placeholder="Enter your script here...

Tip: Write clearly and use short sentences for better teleprompter readability."
              style={{ minHeight: '300px' }}
            />
            <div className="absolute bottom-2 right-2 text-xs text-gray-400 bg-white/90 px-2 py-1 rounded">
              {editedScript.length} characters
            </div>
          </div>
        </CardContent>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 sm:p-4 border-t bg-gray-50/50">
          <div className="text-xs text-gray-500 flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              Auto-saved
            </Badge>
            <span>Changes will be applied when you save</span>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  onClick={onClose}
                  className="h-11 sm:h-10 touch-none order-2 sm:order-1"
                >
                  Cancel
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Cancel editing and discard changes</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  onClick={handleSave} 
                  className="flex items-center justify-center gap-2 h-11 sm:h-10 touch-none order-1 sm:order-2 bg-blue-600 hover:bg-blue-700"
                >
                  <Save size={16} />
                  Save Script
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Save script and close editor</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </Card>
    </div>
  );
}