"use client";

import { 
  Play, 
  Pause, 
  AlignLeft,
  AlignCenter,
  AlignRight,
  FlipHorizontal, 
  Type,
  Palette,
  RotateCcw,
  Square,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { useState } from "react";
import type { TeleprompterSettings } from "./TeleprompterApp";

interface ControlPanelProps {
  settings: TeleprompterSettings;
  updateSetting: <K extends keyof TeleprompterSettings>(
    key: K,
    value: TeleprompterSettings[K]
  ) => void;
  onEditScript: () => void;
  onResetScript: () => void;
}

export function ControlPanel({ settings, updateSetting, onEditScript, onResetScript }: ControlPanelProps) {
  const [showMobileControls, setShowMobileControls] = useState(false);

  const cycleTextAlign = () => {
    const alignments: Array<'left' | 'center' | 'right'> = ['left', 'center', 'right'];
    const currentIndex = alignments.indexOf(settings.textAlign);
    const nextIndex = (currentIndex + 1) % alignments.length;
    updateSetting('textAlign', alignments[nextIndex]);
  };

  const getAlignIcon = () => {
    switch (settings.textAlign) {
      case 'left': return <AlignLeft size={16} />;
      case 'center': return <AlignCenter size={16} />;
      case 'right': return <AlignRight size={16} />;
      default: return <AlignCenter size={16} />;
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-slate-500/60 backdrop-blur-md border-b border-gray-700/50 shadow-2xl rounded-none border-x-0 border-t-0">
      <div className="flex flex-col sm:flex-row items-center justify-between p-1.5 sm:p-3 gap-1.5 sm:gap-3">
        {/* Primary controls - always visible */}
        <div className="flex items-center justify-center gap-1.5 sm:gap-3 w-full sm:w-auto">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => updateSetting('isPlaying', !settings.isPlaying)}
                className="text-white hover:bg-white/20 h-9 w-9 sm:h-10 sm:w-10 border border-white/20 hover:border-white/40 transition-all duration-200 touch-none"
              >
                {settings.isPlaying ? <Pause size={16} className="sm:w-5 sm:h-5" /> : <Play size={16} className="sm:w-5 sm:h-5" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{settings.isPlaying ? 'Pause' : 'Play'}</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={onEditScript}
                className="text-white hover:bg-white/20 h-9 w-9 sm:h-10 sm:w-10 border border-white/20 hover:border-white/40 transition-all duration-200 touch-none"
              >
                <Type size={16} className="sm:w-5 sm:h-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Edit script</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => updateSetting('isFlipped', !settings.isFlipped)}
                className="text-white hover:bg-white/20 h-9 w-9 sm:h-10 sm:w-10 border border-white/20 hover:border-white/40 transition-all duration-200 touch-none"
              >
                <FlipHorizontal size={16} className="sm:w-5 sm:h-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Flip text horizontally</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={cycleTextAlign}
                className="text-white hover:bg-white/20 h-9 w-9 sm:h-10 sm:w-10 border border-white/20 hover:border-white/40 transition-all duration-200 touch-none"
              >
                <span className="w-4 h-4 sm:w-5 sm:h-5">{getAlignIcon()}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Text alignment: {settings.textAlign}</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => updateSetting('hasOutline', !settings.hasOutline)}
                className="text-white hover:bg-white/20 h-9 w-9 sm:h-10 sm:w-10 border border-white/20 hover:border-white/40 transition-all duration-200 touch-none"
              >
                <Square size={16} className="sm:w-5 sm:h-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Toggle text outline</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={onResetScript}
                className="text-white hover:bg-white/20 h-9 w-9 sm:h-10 sm:w-10 border border-white/20 hover:border-white/40 transition-all duration-200 touch-none"
              >
                <RotateCcw size={16} className="sm:w-5 sm:h-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Reset script to beginning</p>
            </TooltipContent>
          </Tooltip>

          {/* Mobile toggle button - only visible on mobile */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowMobileControls(!showMobileControls)}
                className="text-white hover:bg-white/20 h-9 w-9 sm:hidden border border-white/20 hover:border-white/40 transition-all duration-200 touch-none"
              >
                {showMobileControls ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{showMobileControls ? 'Hide controls' : 'Show controls'}</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Desktop: Right side controls */}
        <div className="hidden lg:flex items-center gap-3 lg:gap-6 flex-1 max-w-4xl">
          {/* Background Color */}
          <div className="flex items-center gap-2">
            <Palette size={16} className="text-white/80" />
            <input
              type="color"
              value={settings.backgroundColor}
              onChange={(e) => updateSetting('backgroundColor', e.target.value)}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg border border-white/20 cursor-pointer hover:border-white/40 transition-all duration-200 touch-none"
              title="Background color"
            />
          </div>

          {/* Text Color */}
          <div className="flex items-center gap-2">
            <Type size={16} className="text-white/80" />
            <input
              type="color"
              value={settings.textColor}
              onChange={(e) => updateSetting('textColor', e.target.value)}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg border border-white/20 cursor-pointer hover:border-white/40 transition-all duration-200 touch-none"
              title="Text color"
            />
          </div>

          {/* Text Size Slider */}
          <div className="flex items-center gap-2 min-w-[120px] xl:min-w-[140px]">
            <Slider
              value={settings.fontSize}
              onChange={(value) => updateSetting('fontSize', value)}
              min={20}
              max={120}
              label="Size"
              className="text-white"
            />
          </div>

          {/* Margin Slider */}
          <div className="hidden xl:flex items-center gap-2 min-w-[120px]">
            <Slider
              value={settings.margin}
              onChange={(value) => updateSetting('margin', value)}
              min={0}
              max={20}
              label="Margin"
              className="text-white"
            />
          </div>

          {/* Speed Slider */}
          <div className="flex items-center gap-2 min-w-[100px] lg:min-w-[120px]">
            <Slider
              value={settings.speed}
              onChange={(value) => updateSetting('speed', value)}
              min={1}
              max={30}
              label="Speed"
              className="text-white"
            />
          </div>
          
          {/* Text Reveal Toggle */}
          <div className="flex items-center gap-2">
            <Switch
              checked={settings.textReveal}
              onCheckedChange={(checked) => updateSetting('textReveal', checked)}
              className="data-[state=checked]:bg-blue-500"
            />
            <Label className="text-xs text-white/80">Reveal</Label>
          </div>
        </div>
      </div>

      {/* Mobile controls row - conditional display */}
      {showMobileControls && (
        <div className="sm:hidden flex flex-col gap-2 px-2 py-2 border-t border-gray-700/30">
        {/* Colors and Speed Row */}
        <div className="flex items-center justify-between gap-2">
          {/* Background Color */}
          <div className="flex items-center gap-2">
            <Palette size={16} className="text-white/80" />
            <input
              type="color"
              value={settings.backgroundColor}
              onChange={(e) => updateSetting('backgroundColor', e.target.value)}
              className="w-9 h-9 rounded-lg border border-white/20 cursor-pointer hover:border-white/40 transition-all duration-200 touch-none"
              title="Background color"
            />
          </div>

          {/* Text Color */}
          <div className="flex items-center gap-2">
            <Type size={16} className="text-white/80" />
            <input
              type="color"
              value={settings.textColor}
              onChange={(e) => updateSetting('textColor', e.target.value)}
              className="w-9 h-9 rounded-lg border border-white/20 cursor-pointer hover:border-white/40 transition-all duration-200 touch-none"
              title="Text color"
            />
          </div>

          {/* Speed Control */}
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Slider
              value={settings.speed}
              onChange={(value) => updateSetting('speed', value)}
              min={1}
              max={30}
              label="Speed"
              className="text-white"
            />
          </div>
        </div>
        
        {/* Size and Margin Row */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 flex-1">
            <Slider
              value={settings.fontSize}
              onChange={(value) => updateSetting('fontSize', value)}
              min={20}
              max={120}
              label="Size"
              className="text-white"
            />
          </div>
          <div className="flex items-center gap-2 flex-1">
            <Slider
              value={settings.margin}
              onChange={(value) => updateSetting('margin', value)}
              min={0}
              max={20}
              label="Margin"
              className="text-white"
            />
          </div>
        </div>

        {/* Advanced settings row */}
        <div className="flex items-center justify-center gap-4">
          <div className="flex items-center gap-2">
            <Switch
              checked={settings.textReveal}
              onCheckedChange={(checked) => updateSetting('textReveal', checked)}
              className="data-[state=checked]:bg-blue-500"
            />
            <Label className="text-xs text-white/80">Text Reveal</Label>
          </div>
        </div>
        </div>
      )}
      
      {/* Tablet controls row */}
      <div className="hidden sm:flex lg:hidden items-center gap-3 px-3 py-1.5 border-t border-gray-700/30">
        {/* Colors */}
        <div className="flex items-center gap-2">
          <Palette size={14} className="text-white/80" />
          <input
            type="color"
            value={settings.backgroundColor}
            onChange={(e) => updateSetting('backgroundColor', e.target.value)}
            className="w-8 h-8 rounded-lg border border-white/20 cursor-pointer hover:border-white/40 transition-all duration-200 touch-none"
            title="Background color"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Type size={14} className="text-white/80" />
          <input
            type="color"
            value={settings.textColor}
            onChange={(e) => updateSetting('textColor', e.target.value)}
            className="w-8 h-8 rounded-lg border border-white/20 cursor-pointer hover:border-white/40 transition-all duration-200 touch-none"
            title="Text color"
          />
        </div>

        {/* Font Size */}
        <div className="flex items-center gap-2 flex-1">
          <Slider
            value={settings.fontSize}
            onChange={(value) => updateSetting('fontSize', value)}
            min={20}
            max={120}
            label="Size"
            className="text-white"
          />
        </div>
        
        {/* Margin - only show on larger tablets */}
        <div className="hidden md:flex items-center gap-2 flex-1">
          <Slider
            value={settings.margin}
            onChange={(value) => updateSetting('margin', value)}
            min={0}
            max={20}
            label="Margin"
            className="text-white"
          />
        </div>

        {/* Text Reveal Toggle */}
        <div className="flex items-center gap-2">
          <Switch
            checked={settings.textReveal}
            onCheckedChange={(checked) => updateSetting('textReveal', checked)}
            className="data-[state=checked]:bg-blue-500"
          />
          <Label className="text-xs text-white/80">Reveal</Label>
        </div>
      </div>
    </div>
  );
}