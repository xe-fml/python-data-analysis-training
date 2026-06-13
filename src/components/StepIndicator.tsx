import React from 'react'

interface Step {
  number: number
  title: string
  content: string
}

interface StepIndicatorProps {
  steps: Step[]
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ steps }) => {
  return (
    <div className="relative">
      <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-gray-200" />
      
      <div className="space-y-8">
        {steps.map((step, index) => (
          <div key={step.number} className="relative flex gap-4">
            <div className="flex-shrink-0">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg z-10 bg-gradient-to-br from-primary to-secondary`}>
                {step.number}
              </div>
            </div>
            
            <div className="flex-1 bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                {step.title}
              </h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                {step.content}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default StepIndicator
