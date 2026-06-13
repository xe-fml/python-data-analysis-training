import React from 'react'
import { Link } from 'react-router-dom'
import { Zap, ArrowLeft, CheckCircle2, Lightbulb } from 'lucide-react'
import CodeBlock from '../components/CodeBlock'
import StepIndicator from '../components/StepIndicator'
import InsightsCard from '../components/InsightsCard'
import { projects } from '../utils/data'

const SalesAnalysis: React.FC = () => {
  const project = projects.find(p => p.id === 'sales-analysis')!

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-gradient-to-br from-orange-500 to-yellow-500 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Link to="/" className="flex items-center gap-2 text-white/80 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span>返回首页</span>
            </Link>
          </div>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">销售数据分析</h1>
              <p className="text-white/90">{project.description}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Learning Path */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">学习路径</h2>
            <p className="text-gray-600">按照以下步骤完成销售数据分析</p>
          </div>
          
          <StepIndicator steps={project.steps} />
        </div>
      </section>

      {/* Code Examples */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">代码示例</h2>
            <p className="text-gray-600">优化后的Python代码，带详细注释</p>
          </div>
          
          {project.codeExamples.map((codeExample, index) => (
            <CodeBlock
              key={index}
              title={codeExample.title}
              description={codeExample.description}
              code={codeExample.code}
            />
          ))}
        </div>
      </section>

      {/* Insights */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">业务洞察</h2>
            <p className="text-gray-600">基于数据分析得出的关键发现和建议</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {project.insights.map((insight, index) => (
              <InsightsCard
                key={index}
                title={insight.title}
                content={insight.content}
                icon={index === 0 ? <CheckCircle2 className="w-6 h-6 text-white" /> : <Lightbulb className="w-6 h-6 text-white" />}
                color={index === 0 ? 'from-green-500 to-emerald-500' : 'from-amber-500 to-orange-500'}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Related Projects */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">相关项目</h2>
            <p className="text-gray-600">继续学习其他数据分析项目</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.filter(p => p.id !== 'sales-analysis').map((p) => (
              <Link
                key={p.id}
                to={p.path}
                className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all group"
              >
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center bg-gradient-to-br ${p.color} mb-4 group-hover:scale-110 transition-transform`}>
                  <p.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{p.title}</h3>
                <p className="text-gray-600 text-sm">{p.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default SalesAnalysis
