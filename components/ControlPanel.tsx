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
  Settings,
  RotateCcw,
  Square
} from "lucide-react";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
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
  const cycleTextAlign = () => {
    const alignments: Array<'left' | 'center' | 'right'> = ['left', 'center', 'right'];
    const currentIndex = alignments.indexOf(settings.textAlign);
    const nextIndex = (currentIndex + 1) % alignments.length;
    updateSetting('textAlign', alignments[nextIndex]);
  };

  const getAlignIcon = () => {
    switch (settings.textAlign) {
      case 'left': return <AlignLeft size={20} />;
      case 'center': return <AlignCenter size={20} />;
      case 'right': return <AlignRight size={20} />;
      default: return <AlignCenter size={20} />;
    }
  };
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm border-b border-gray-700">
      <div className="flex items-center justify-between p-2 gap-2">
        {/* Left side controls */}
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => updateSetting('isPlaying', !settings.isPlaying)}
                className="text-white hover:bg-white/20 h-8 w-8"
              >
                {settings.isPlaying ? <Pause size={20} /> : <Play size={20} />}
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
                className="text-white hover:bg-white/20 h-8 w-8"
              >
                <Type size={20} />
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
                className="text-white hover:bg-white/20 h-8 w-8"
              >
                <FlipHorizontal size={20} />
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
                className="text-white hover:bg-white/20 h-8 w-8"
              >
                {getAlignIcon()}
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
                className="text-white hover:bg-white/20 h-8 w-8"
              >
                <Square size={20} />
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
                className="text-white hover:bg-white/20 h-8 w-8"
              >
                <RotateCcw size={20} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Reset script to beginning</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-4 flex-1 max-w-4xl">
          {/* Background Color */}
          <div className="flex items-center gap-2">
            <Palette size={16} className="text-white" />
            <input
              type="color"
              value={settings.backgroundColor}
              onChange={(e) => updateSetting('backgroundColor', e.target.value)}
              className="w-8 h-8 rounded border-0 cursor-pointer"
              title="Background color"
            />
          </div>

          {/* Text Color */}
          <div className="flex items-center gap-2">
            <Type size={16} className="text-white" />
            <input
              type="color"
              value={settings.textColor}
              onChange={(e) => updateSetting('textColor', e.target.value)}
              className="w-8 h-8 rounded border-0 cursor-pointer"
              title="Text color"
            />
          </div>

          {/* Text Size Slider */}
          <div className="hidden sm:flex items-center gap-2 min-w-[120px]">
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
          <div className="hidden md:flex items-center gap-2 min-w-[120px]">
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
          <div className="flex items-center gap-2 min-w-[120px]">
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
      </div>

      {/* Mobile controls row */}
      <div className="sm:hidden flex items-center gap-4 px-2 pb-2">
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
    </div>
  );
}