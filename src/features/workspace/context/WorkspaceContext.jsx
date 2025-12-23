import React, { createContext, useContext, useState } from 'react'
import { useCodeEditor } from '../../editor/hooks/useCodeEditor'
import { useSubmissions } from '../../submission/hooks/useSubmissions'
import { useNotes } from '../../problem/hooks/useNotes'
import { useLayoutSystem } from '../hooks/useLayoutSystem'
import { PROBLEMS } from '../../problem/data/problems'

const WorkspaceContext = createContext(null)

export function useWorkspace() {
  const ctx = useContext(WorkspaceContext)
  if (!ctx) throw new Error('useWorkspace must be used within WorkspaceProvider')
  return ctx
}

export function WorkspaceProvider({ children }) {
  const problemList = Object.values(PROBLEMS)
  const [currentId, setCurrentId] = useState(problemList[0]?.id || 'two-sum')
  const [lang, setLang] = useState('python')
  const current = PROBLEMS[currentId]

  // 默认代码
  const getDefaultCode = (language) => {
    if (language === 'python') {
      return 'class Solution:\n    def solve(self, nums, target):\n        # TODO: 写代码\n        pass\n'
    }
    return 'class Solution {\npublic:\n    vector<int> solve(vector<int>& nums, int target) {\n        // TODO: 写代码\n        return {};\n    }\n};\n'
  }

  const starterCode = {
    python: current?.starterCode?.python || getDefaultCode('python'),
    cpp: current?.starterCode?.cpp || getDefaultCode('cpp')
  }

  const { currentCode, updateCode, applySolutionCode } = useCodeEditor(currentId, lang, starterCode)
  const {
    submissionsMap, currentSubmissions, isSubmitting, selectedSubmission,
    setSelectedSubmission, submitCode, clearSubmissions
  } = useSubmissions(currentId)
  const { currentNotes, updateNotes } = useNotes(currentId)
  const layoutSystem = useLayoutSystem()

  // UI 状态
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [filterOpen, setFilterOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState([])
  const [difficultyFilter, setDifficultyFilter] = useState([])
  const [tagFilter, setTagFilter] = useState([])
  const [tagSearch, setTagSearch] = useState('')

  // 全屏状态
  const [fullscreenState, setFullscreenState] = useState(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [animationStyle, setAnimationStyle] = useState(null)

  // 性能测试 - 合并成一个对象
  const [perf, setPerf] = useState({
    algos: {},
    sizes: {},
    repeats: {},
    results: {},
    running: null,
    summary: {}
  })
  const [userCodeStatus, setUserCodeStatus] = useState({})
  const [codeExpandedMap, setCodeExpandedMap] = useState({})

  // 更新 perf 的辅助函数
  const updatePerf = (key, val) => setPerf(prev => ({ ...prev, [key]: val }))

  // 提交
  const handleSubmit = async () => {
    try {
      const submission = await submitCode(currentCode, lang)
      layoutSystem.addTab('col-left', 'submission-detail')
      setSelectedSubmission(submission)
    } catch (err) {
      console.error('提交失败:', err)
    }
  }

  // 应用题解
  const handleApplySolution = (language, code) => {
    const targetLang = language === 'cpp' ? 'cpp' : 'python'
    applySolutionCode(targetLang, code)
    setLang(targetLang)
    layoutSystem.addTab('col-middle', 'code')
  }

  const value = {
    problemList,
    currentId, setCurrentId,
    current,
    currentIndex: problemList.findIndex(p => p.id === currentId),
    lang, setLang,
    currentCode, updateCode, handleApplySolution,
    submissionsMap, currentSubmissions, isSubmitting,
    selectedSubmission, setSelectedSubmission,
    handleSubmit, clearSubmissions,
    currentNotes, updateNotes,
    ...layoutSystem,

    // UI
    isDrawerOpen: drawerOpen, setIsDrawerOpen: setDrawerOpen,
    isFilterOpen: filterOpen, setIsFilterOpen: setFilterOpen,
    statusFilter, setStatusFilter,
    difficultyFilter, setDifficultyFilter,
    tagFilter, setTagFilter,
    tagSearch, setTagSearch,

    // 全屏
    fullscreenState, setFullscreenState,
    isAnimating, setIsAnimating,
    animationStyle, setAnimationStyle,

    // 性能测试 - 新的合并对象
    perf, setPerf, updatePerf,

    // 兼容旧接口 (TODO: 后面删掉)
    perfSelectedAlgos: perf.algos,
    setPerfSelectedAlgos: v => updatePerf('algos', v),
    perfSizes: perf.sizes,
    setPerfSizes: v => updatePerf('sizes', v),
    perfRepeats: perf.repeats,
    setPerfRepeats: v => updatePerf('repeats', v),
    perfResults: perf.results,
    setPerfResults: v => updatePerf('results', v),
    perfRunningState: perf.running,
    setPerfRunningState: v => updatePerf('running', v),
    perfSummary: perf.summary,
    setPerfSummary: v => updatePerf('summary', v),

    userCodeStatus, setUserCodeStatus,
    codeExpandedMap, setCodeExpandedMap,
  }

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  )
}
