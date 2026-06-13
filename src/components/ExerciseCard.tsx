import React, { useState } from 'react'
import { ChevronDown, ChevronUp, CheckCircle, XCircle, Lightbulb, Code2 } from 'lucide-react'
import { Exercise } from '../utils/data'
import PythonEditor from './PythonEditor'

interface ExerciseCardProps {
  exercise: Exercise
  index: number
}

const difficultyColors = {
  easy: {
    bg: 'bg-green-100 text-green-700 border-green-200',
    label: '简单'
  },
  medium: {
    bg: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    label: '中等'
  },
  hard: {
    bg: 'bg-red-100 text-red-700 border-red-200',
    label: '困难'
  }
}

const typeColors = {
  concept: {
    bg: 'bg-blue-100 text-blue-700 border-blue-200',
    label: '概念题'
  },
  code: {
    bg: 'bg-purple-100 text-purple-700 border-purple-200',
    label: '代码题'
  },
  coding: {
    bg: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    label: '实操题'
  }
}

const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise, index }) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)

  const difficulty = difficultyColors[exercise.difficulty]
  const type = typeColors[exercise.type]
  const isCorrect = selectedAnswer === exercise.correctAnswer
  const isCoding = exercise.type === 'coding' && exercise.initialCode

  const handleSelectAnswer = (answerIndex: number) => {
    if (showResult) return
    setSelectedAnswer(answerIndex)
    setShowResult(true)
  }

  const resetExercise = () => {
    setSelectedAnswer(null)
    setShowResult(false)
    setShowExplanation(false)
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all">
      <div className="p-5">
        <div className="flex items-start gap-4 mb-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-primary-700 to-secondary-700 flex items-center justify-center text-white font-bold">
            {index + 1}
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <h4 className="text-lg font-semibold text-gray-900">{exercise.title}</h4>
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${difficulty.bg}`}>
                {difficulty.label}
              </span>
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${type.bg}`}>
                {type.label}
              </span>
            </div>
            <p className="text-gray-600 text-sm mb-3">{exercise.description}</p>

            {isCoding ? (
              /* ============ 代码实操题 ============ */
              <div className="space-y-4">
                <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
                  <div className="flex items-start gap-2 mb-3">
                    <Code2 className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="text-sm font-semibold text-indigo-900 block mb-1">任务描述</span>
                      <p className="text-sm text-indigo-800 whitespace-pre-wrap">{exercise.question}</p>
                    </div>
                  </div>
                </div>

                <PythonEditor
                  initialCode={exercise.initialCode}
                  expectedOutput={exercise.expectedOutput}
                  hint={exercise.hint}
                />

                {/* 展开按钮 - 查看解析 */}
                {exercise.explanation && (
                  <div className="space-y-2">
                    <button
                      onClick={() => setShowExplanation(!showExplanation)}
                      className="w-full py-2 px-4 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-sm font-medium flex items-center justify-center gap-1 transition-colors border border-blue-200"
                    >
                      {showExplanation ? (
                        <>
                          <ChevronUp className="w-4 h-4" />
                          收起参考解析
                        </>
                      ) : (
                        <>
                          <Lightbulb className="w-4 h-4" />
                          查看参考解析与答案
                          <ChevronDown className="w-4 h-4" />
                        </>
                      )}
                    </button>

                    {showExplanation && (
                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                        <div className="flex items-start gap-2">
                          <Lightbulb className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                          <div>
                            <span className="text-sm font-medium text-blue-900 block mb-1">参考解析</span>
                            <p className="text-sm text-blue-800 whitespace-pre-wrap">{exercise.explanation}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              /* ============ 选择题 ============ */
              <>
                {/* Question */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="text-gray-800 font-medium whitespace-pre-wrap">{exercise.question}</p>
                </div>

                {/* Options */}
                <div className="space-y-2">
                  {exercise.options.map((option, idx) => {
                    let optionClass = 'bg-white border-gray-200 hover:border-primary hover:bg-blue-50 cursor-pointer'

                    if (showResult) {
                      if (idx === exercise.correctAnswer) {
                        optionClass = 'bg-green-50 border-green-500 text-green-800'
                      } else if (idx === selectedAnswer && idx !== exercise.correctAnswer) {
                        optionClass = 'bg-red-50 border-red-500 text-red-800'
                      } else {
                        optionClass = 'bg-gray-50 border-gray-200 opacity-50'
                      }
                    }

                    return (
                      <div
                        key={idx}
                        onClick={() => handleSelectAnswer(idx)}
                        className={`p-3 rounded-lg border-2 transition-all ${optionClass}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full border-2 border-current flex items-center justify-center text-sm font-medium">
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span className="flex-1 text-sm">{option}</span>
                          {showResult && idx === exercise.correctAnswer && (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          )}
                          {showResult && idx === selectedAnswer && idx !== exercise.correctAnswer && (
                            <XCircle className="w-5 h-5 text-red-600" />
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Result & Explanation */}
                {showResult && (
                  <div className="mt-4 space-y-3">
                    <div className={`p-4 rounded-lg ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                      <div className="flex items-center gap-2 mb-2">
                        {isCorrect ? (
                          <>
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            <span className="font-semibold text-green-800">回答正确！</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-5 h-5 text-red-600" />
                            <span className="font-semibold text-red-800">回答错误</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Explanation */}
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <div className="flex items-start gap-3">
                        <Lightbulb className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="text-sm font-medium text-blue-900 block mb-1">解析</span>
                          <p className="text-sm text-blue-800">{exercise.explanation}</p>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={resetExercise}
                      className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
                    >
                      重新作答
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExerciseCard
