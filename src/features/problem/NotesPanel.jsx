import React from 'react';

// 笔记
export function Notes({ notes = '', onNotesChange }) {
  return (
    <div className="h-full flex flex-col p-3">
      <textarea
        id="notes-textarea"
        name="notes"
        value={notes}
        onChange={(e) => onNotesChange?.(e.target.value)}
        placeholder="在这里记录解题思路、重点知识、易错点..."
        className="flex-1 w-full bg-[#101018] border border-border-primary rounded-lg text-sm text-text-primary px-3 py-2 outline-none resize-none focus:border-border-focus focus:ring-1 focus:ring-border-focus placeholder:text-text-disabled leading-relaxed"
      />
      <div className="mt-2 text-[10px] text-text-disabled text-right">
        笔记已自动保存到本地存储
      </div>
    </div>
  );
}
