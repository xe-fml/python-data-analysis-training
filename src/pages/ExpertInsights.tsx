import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Brain, MessageSquare, BookOpen, Target, TrendingUp, CheckCircle2 } from 'lucide-react'
import { coreMindsets, debates } from '../utils/data'

const ExpertInsights: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-gradient-to-br from-primary to-secondary py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Link to="/" className="flex items-center gap-2 text-white/80 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span>返回首页</span>
            </Link>
          </div>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">专家洞察</h1>
              <p className="text-white/90">深入理解数据分析的核心思维模式和争议话题</p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Mindsets */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">核心思维模式</h2>
            <p className="text-gray-600">成为优秀数据分析师所需的关键思维能力</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {coreMindsets.map((mindset, index) => (
              <div 
                key={mindset.id} 
                className="bg-white rounded-xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    <span className="text-white font-bold text-xl">{index + 1}</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{mindset.title}</h3>
                    <p className="text-gray-600 text-sm">{mindset.description}</p>
                  </div>
                </div>
                
                <ul className="space-y-3">
                  {mindset.points.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 text-sm">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Debates */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">争议话题讨论</h2>
            <p className="text-gray-600">数据分析领域的热门争议和权衡</p>
          </div>
          
          <div className="space-y-8">
            {debates.map((debate) => (
              <div 
                key={debate.id} 
                className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
              >
                <div className="bg-gradient-to-r from-primary/5 to-secondary/5 px-8 py-6 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="w-5 h-5 text-primary" />
                    <h3 className="text-xl font-semibold text-gray-900">{debate.title}</h3>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2">
                  <div className="p-8 border-r border-gray-100">
                    <div className="flex items-center gap-2 mb-4">
                      <Target className="w-5 h-5 text-green-500" />
                      <h4 className="font-semibold text-gray-900">支持方观点</h4>
                    </div>
                    <ul className="space-y-3">
                      {debate.pros.map((pro, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <span className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-sm font-medium flex-shrink-0">
                            {idx + 1}
                          </span>
                          <span className="text-gray-700 text-sm">{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="p-8">
                    <div className="flex items-center gap-2 mb-4">
                      <TrendingUp className="w-5 h-5 text-orange-500" />
                      <h4 className="font-semibold text-gray-900">反对方观点</h4>
                    </div>
                    <ul className="space-y-3">
                      {debate.cons.map((con, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm font-medium flex-shrink-0">
                            {idx + 1}
                          </span>
                          <span className="text-gray-700 text-sm">{con}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="bg-blue-50 px-8 py-6 border-t border-gray-100">
                  <div className="flex items-start gap-3">
                    <BookOpen className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">总结观点</h4>
                      <p className="text-gray-600 text-sm">{debate.conclusion}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">开始实践</h2>
          <p className="text-gray-600 mb-8">将这些思维模式应用到实际项目中</p>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { path: '/project/shopping-cart', label: '购物车分析' },
              { path: '/project/customer-segmentation', label: '客户分群分析' },
              { path: '/project/sales-analysis', label: '销售数据分析' }
            ].map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white font-medium rounded-xl hover:shadow-lg transition-all hover:-translate-y-0.5"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default ExpertInsights
