import React from 'react';
import { UndoIcon, RedoIcon } from './icons';
import { Tooltip } from './Tooltip';

interface HistoryControlsProps {
    onUndo: () => void;
    onRedo: () => void;
    canUndo: boolean;
    canRedo: boolean;
}

export const HistoryControls: React.FC<HistoryControlsProps> = ({ onUndo, onRedo, canUndo, canRedo }) => {
    const buttonClass = "p-2 bg-slate-700 rounded-md text-slate-300 hover:bg-slate-600 hover:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-slate-700";
    
    return (
        <div className="flex items-center gap-2">
            <Tooltip text="Undo (Ctrl+Z)">
                <button onClick={onUndo} disabled={!canUndo} className={buttonClass} aria-label="Undo">
                    <UndoIcon className="w-5 h-5" />
                </button>
            </Tooltip>
            <Tooltip text="Redo (Ctrl+Y)">
                <button onClick={onRedo} disabled={!canRedo} className={buttonClass} aria-label="Redo">
                    <RedoIcon className="w-5 h-5" />
                </button>
            </Tooltip>
        </div>
    );
};
