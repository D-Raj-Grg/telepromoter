"use client";

import { useState, useEffect, useRef } from "react";
import { ControlPanel } from "./ControlPanel";
import { TeleprompterDisplay } from "./TeleprompterDisplay";
import { ScriptEditor } from "./ScriptEditor";

export interface TeleprompterSettings {
  isPlaying: boolean;
  speed: number;
  fontSize: number;
  textColor: string;
  backgroundColor: string;
  margin: number;
  isFlipped: boolean;
  hasOutline: boolean;
  textAlign: 'left' | 'center' | 'right';
}

export function TeleprompterApp() {
  const [script, setScript] = useState(`Like what you see?

Check out our Teleprompter App! Level up your speaking today and download the Teleprompter App. You can even record directly in there. What are you waiting for?`);
  
  const [showEditor, setShowEditor] = useState(false);
  const [resetTrigger, setResetTrigger] = useState(0);
  const [settings, setSettings] = useState<TeleprompterSettings>({
    isPlaying: false,
    speed: 10,
    fontSize: 66,
    textColor: "#ffffff",
    backgroundColor: "#000000",
    margin: 5,
    isFlipped: false,
    hasOutline: false,
    textAlign: 'center',
  });

  const updateSetting = <K extends keyof TeleprompterSettings>(
    key: K,
    value: TeleprompterSettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleResetScript = () => {
    setResetTrigger(prev => prev + 1);
  };

  // Load script from localStorage on mount
  useEffect(() => {
    const savedScript = localStorage.getItem("teleprompter-script");
    if (savedScript) {
      setScript(savedScript);
    }
  }, []);

  // Save script to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("teleprompter-script", script);
  }, [script]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Prevent shortcuts when typing in editor
      if (showEditor) return;
      
      switch (e.key) {
        case ' ':
          e.preventDefault();
          updateSetting('isPlaying', !settings.isPlaying);
          break;
        case 'ArrowUp':
          e.preventDefault();
          updateSetting('speed', Math.min(30, settings.speed + 1));
          break;
        case 'ArrowDown':
          e.preventDefault();
          updateSetting('speed', Math.max(1, settings.speed - 1));
          break;
        case 'ArrowLeft':
          e.preventDefault();
          updateSetting('fontSize', Math.max(20, settings.fontSize - 2));
          break;
        case 'ArrowRight':
          e.preventDefault();
          updateSetting('fontSize', Math.min(120, settings.fontSize + 2));
          break;
        case 'f':
        case 'F':
          e.preventDefault();
          updateSetting('isFlipped', !settings.isFlipped);
          break;
        case 'o':
        case 'O':
          e.preventDefault();
          updateSetting('hasOutline', !settings.hasOutline);
          break;
        case 'e':
        case 'E':
          e.preventDefault();
          setShowEditor(true);
          break;
        case 'r':
        case 'R':
          e.preventDefault();
          handleResetScript();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [settings, showEditor, updateSetting]);

  return (
    <div 
      className="min-h-screen relative overflow-hidden"
      style={{ backgroundColor: settings.backgroundColor }}
    >
      <ControlPanel
        settings={settings}
        updateSetting={updateSetting}
        onEditScript={() => setShowEditor(true)}
        onResetScript={handleResetScript}
      />
      
      <div onClick={() => updateSetting('isPlaying', !settings.isPlaying)}>
        <TeleprompterDisplay
          script={script}
          settings={settings}
          resetTrigger={resetTrigger}
        />
      </div>

      {showEditor && (
        <ScriptEditor
          script={script}
          onScriptChange={setScript}
          onClose={() => setShowEditor(false)}
        />
      )}
    </div>
  );
}