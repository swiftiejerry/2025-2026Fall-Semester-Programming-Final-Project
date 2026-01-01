import React, { useState, useEffect } from 'react';
import { useWorkspaceStore } from '../../stores';

export const NotesPanel: React.FC = () => {
    const currentId = useWorkspaceStore((state) => state.currentProblemId);
    const [note, setNote] = useState('');

    useEffect(() => {
        const saved = localStorage.getItem(`note-${currentId}`) || '';
        setNote(saved);
    }, [currentId]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const val = e.target.value;
        setNote(val);
        localStorage.setItem(`note-${currentId}`, val);
    };

    return (
        <div className="h-full flex flex-col theme-bg-elevated">
            <div className="p-3 border-b theme-border text-xs font-medium theme-text-tertiary uppercase tracking-widest">
                Scratchpad
            </div>
            <textarea
                className="flex-1 bg-transparent resize-none p-4 text-sm theme-text-primary placeholder:theme-text-tertiary focus:outline-none font-mono"
                placeholder="Type your notes here..."
                value={note}
                onChange={handleChange}
                spellCheck={false}
            />
        </div>
    );
};
