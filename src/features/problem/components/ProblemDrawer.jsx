// 题库抽屉组件
import React, { useState, useEffect } from 'react';
import { ArrowUpDown, ChevronDown, Filter, X } from 'lucide-react';
import { DIFFICULTY_STYLES } from '../../workspace/config/viewConfig';

/**
 * 题库抽屉 - 题目列表、搜索、筛选、排序
 */
export function ProblemDrawer({
  isOpen,
  onClose,
  problemList,
  currentId,
  onSelectProblem
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortKey, setSortKey] = useState('default');
  const [sortDirection, setSortDirection] = useState('asc');
  const [difficultyFilter, setDifficultyFilter] = useState([]);
  const [tagFilter, setTagFilter] = useState([]);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // 抽屉关闭时，收起所有悬浮菜单
  useEffect(() => {
    if (!isOpen) {
      setIsSortOpen(false);
      setIsFilterOpen(false);
    }
  }, [isOpen]);

  // 筛选逻辑
  let filteredList = problemList.filter((p) => {
    const matchSearch =
      !searchQuery ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.number.toString().includes(searchQuery);
    const matchDiff = difficultyFilter.length === 0 || difficultyFilter.includes(p.difficulty);
    const matchTag = tagFilter.length === 0 || tagFilter.some((t) => p.tags.includes(t));
    return matchSearch && matchDiff && matchTag;
  });

  // 排序逻辑
  if (sortKey === 'number') {
    filteredList.sort((a, b) =>
      sortDirection === 'asc' ? a.number - b.number : b.number - a.number
    );
  } else if (sortKey === 'title') {
    filteredList.sort((a, b) =>
      sortDirection === 'asc'
        ? a.title.localeCompare(b.title, 'zh-CN')
        : b.title.localeCompare(a.title, 'zh-CN')
    );
  } else if (sortKey === 'difficulty') {
    const diffOrder = { Easy: 1, Medium: 2, Hard: 3 };
    filteredList.sort((a, b) =>
      sortDirection === 'asc'
        ? diffOrder[a.difficulty] - diffOrder[b.difficulty]
        : diffOrder[b.difficulty] - diffOrder[a.difficulty]
    );
  }

  const allTags = [...new Set(problemList.flatMap((p) => p.tags))];
  const hasActiveFilter = difficultyFilter.length > 0 || tagFilter.length > 0;

  const sortLabel = (() => {
    if (sortKey === 'number') return `按题号(${sortDirection === 'asc' ? '↑' : '↓'})`;
    if (sortKey === 'title') return `按标题(${sortDirection === 'asc' ? 'A-Z' : 'Z-A'})`;
    if (sortKey === 'difficulty')
      return `按难度(${sortDirection === 'asc' ? '简单在前' : '困难在前'})`;
    return '排序';
  })();

  const resetFilters = () => {
    setDifficultyFilter([]);
    setTagFilter([]);
  };

  return (
    <>
      {/* 抽屉本体 */}
      <div
        className={`fixed top-0 left-0 h-full w-[360px] bg-surface-secondary border-r border-border-primary shadow-2xl shadow-black/60 z-30 transform transition-transform duration-500 ${isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        {/* 头部 */}
        <div className="h-12 border-b border-border-primary flex items-center justify-between px-3 bg-black/70 backdrop-blur">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <span>题库</span>
            <span className="text-[10px] text-text-tertiary">共 {problemList.length} 题</span>
          </div>
          <button
            onClick={onClose}
            className="px-2 py-1 text-xs rounded bg-surface-elevated hover:bg-surface-tertiary text-text-secondary"
          >
            关闭
          </button>
        </div>

        {/* 搜索和筛选栏 */}
        <div className="p-3 border-b border-border-primary">
          <div className="flex items-center justify-between mb-2 text-xs text-text-secondary">
            <div className="flex items-center gap-2">
              {/* 排序按钮 */}
              <div className="relative">
                <button
                  onClick={() => {
                    setIsSortOpen((v) => !v);
                    setIsFilterOpen(false);
                  }}
                  className="flex items-center gap-1 px-2 py-1 rounded border border-border-primary bg-surface-elevated hover:bg-surface-tertiary text-xs text-text-primary"
                >
                  <ArrowUpDown className="w-3.5 h-3.5" />
                  <span className="max-w-[120px] truncate">{sortLabel}</span>
                  <ChevronDown className="w-3 h-3" />
                </button>
                {isSortOpen && (
                  <div className="absolute z-40 mt-1 w-52 rounded-lg border border-border-primary bg-surface-primary shadow-xl overflow-hidden">
                    <div className="py-1 text-xs">
                      {[
                        { key: 'default', label: '默认排序' },
                        { key: 'number', label: '按题号' },
                        { key: 'title', label: '按标题' },
                        { key: 'difficulty', label: '按难度' },
                      ].map((opt) => (
                        <button
                          key={opt.key}
                          onClick={() => {
                            if (sortKey === opt.key) {
                              setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'));
                            } else {
                              setSortKey(opt.key);
                              setSortDirection('asc');
                            }
                            setIsSortOpen(false);
                          }}
                          className={`w-full px-3 py-1.5 flex items-center justify-between hover:bg-surface-tertiary ${sortKey === opt.key ? 'bg-surface-tertiary text-text-primary' : 'text-text-secondary'
                            }`}
                        >
                          <span>{opt.label}</span>
                          {sortKey === opt.key && <span className="text-[10px]">当前</span>}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* 筛选按钮 */}
              <div className="relative">
                <button
                  onClick={() => {
                    setIsFilterOpen((v) => !v);
                    setIsSortOpen(false);
                  }}
                  className={`flex items-center gap-1 px-2 py-1 rounded border text-xs ${hasActiveFilter
                    ? 'border-accent-primary bg-accent-primary/20 text-accent-primary'
                    : 'border-border-primary bg-surface-elevated hover:bg-surface-tertiary text-text-secondary'
                    }`}
                >
                  <Filter className="w-3.5 h-3.5" />
                  <span>筛选</span>
                  {hasActiveFilter && <span className="w-1.5 h-1.5 rounded-full bg-accent-success ml-0.5" />}
                </button>

                {isFilterOpen && (
                  <div className="absolute z-40 mt-2 w-[300px] left-0 rounded-lg border border-border-primary bg-surface-primary shadow-2xl p-3 space-y-3">
                    <div className="flex items-center justify-between text-xs text-text-tertiary">
                      <span>匹配所有过滤条件：</span>
                      <button onClick={resetFilters} className="text-[10px] text-text-tertiary hover:text-text-secondary">
                        重置
                      </button>
                    </div>

                    {/* 难度筛选 */}
                    <div>
                      <div className="text-[11px] text-text-tertiary mb-1.5">难度</div>
                      <div className="flex gap-2">
                        {['Easy', 'Medium', 'Hard'].map((d) => (
                          <button
                            key={d}
                            onClick={() =>
                              setDifficultyFilter((prev) =>
                                prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]
                              )
                            }
                            className={`px-2 py-1 rounded text-xs border transition-colors ${difficultyFilter.includes(d)
                              ? DIFFICULTY_STYLES[d]
                              : 'border-border-primary bg-surface-elevated text-text-secondary'
                              }`}
                          >
                            {d}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 标签筛选 */}
                    <div>
                      <div className="text-[11px] text-text-tertiary mb-1.5">标签</div>
                      <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
                        {allTags.map((tag) => (
                          <button
                            key={tag}
                            onClick={() =>
                              setTagFilter((prev) =>
                                prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
                              )
                            }
                            className={`px-2 py-0.5 rounded text-[10px] border transition-colors ${tagFilter.includes(tag)
                              ? 'border-accent-primary bg-accent-primary/20 text-accent-primary'
                              : 'border-border-secondary bg-surface-elevated text-text-tertiary hover:text-text-secondary'
                              }`}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 搜索框 */}
          <input
            type="text"
            placeholder="搜索题目..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-1.5 rounded border border-border-primary bg-surface-tertiary text-xs text-text-primary placeholder:text-text-disabled outline-none focus:border-border-focus"
          />
        </div>

        {/* 题目列表 */}
        <div className="flex-1 overflow-y-auto">
          {filteredList.map((p) => (
            <div
              key={p.id}
              onClick={() => onSelectProblem(p.id)}
              className={`p-3 border-b border-border-secondary cursor-pointer transition-colors ${p.id === currentId ? 'bg-accent-primary/10' : 'hover:bg-surface-tertiary'
                }`}
            >
              <div className="flex items-start justify-between mb-1">
                <span className="text-xs font-medium text-text-primary">
                  {p.number}. {p.title}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium border ${DIFFICULTY_STYLES[p.difficulty]}`}>
                  {p.difficulty}
                </span>
                {p.tags.slice(0, 2).map((tag) => (
                  <span key={tag} className="px-1.5 py-0.5 rounded text-[10px] bg-surface-elevated text-text-tertiary">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 遮罩层 */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20" onClick={onClose} />
      )}
    </>
  );
}
