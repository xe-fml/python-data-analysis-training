import React from 'react'
import { Link } from 'react-router-dom'
import { LucideIcon } from 'lucide-react'

interface ProjectCardProps {
  id: string
  title: string
  description: string
  icon: LucideIcon
  color: string
  path: string
  delay?: number
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  id,
  title,
  description,
  icon: Icon,
  color,
  path,
  delay = 0
}) => {
  return (
    <Link
      to={path}
      className="group relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${color} rounded-t-2xl`} />
      
      <div className="flex items-start justify-between mb-4">
        <div className={`w-14 h-14 rounded-xl flex items-center justify-center bg-gradient-to-br ${color} group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-7 h-7 text-white" />
        </div>
      </div>

      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
        {title}
      </h3>
      
      <p className="text-gray-600 text-sm leading-relaxed mb-4">
        {description}
      </p>

      <div className="flex items-center text-sm font-medium text-primary group-hover:text-secondary transition-colors">
        查看详情
        <svg
          className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  )
}

export default ProjectCard
