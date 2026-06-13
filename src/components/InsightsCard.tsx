import React from 'react'
import { Lightbulb } from 'lucide-react'

interface InsightsCardProps {
  title: string
  content: string
  icon?: React.ReactNode
  color?: string
}

const InsightsCard: React.FC<InsightsCardProps> = ({
  title,
  content,
  icon,
  color = 'from-primary to-secondary'
}) => {
  return (
    <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center bg-gradient-to-br ${color} mb-4`}>
        {icon || <Lightbulb className="w-6 h-6 text-white" />}
      </div>
      
      <h4 className="text-lg font-semibold text-gray-900 mb-3">
        {title}
      </h4>
      
      <p className="text-gray-600 text-sm leading-relaxed">
        {content}
      </p>
    </div>
  )
}

export default InsightsCard
