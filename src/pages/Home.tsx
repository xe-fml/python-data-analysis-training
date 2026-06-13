import React from 'react'
import { Link } from 'react-router-dom'
import { BarChart3, ArrowRight, Target, TrendingUp, Zap, Users, ShoppingCart } from 'lucide-react'
import ProjectCard from '../components/ProjectCard'
import { projects } from '../utils/data'

const Home: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-slate-50 via-white to-slate-100 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-sm font-medium text-primary">
                  优化Python数据分析代码
                </span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                掌握数据分析，从
                <span className="bg-gradient-to-r from-primary-800 to-secondary-800 bg-clip-text text-transparent">
                  实战项目开始
                </span>
              </h1>
              
              <p className="text-lg text-gray-600 mb-8 max-w-xl">
                通过优化后的实战项目代码示例，快速掌握数据分析技能。包括购物车分析、客户分群分析、销售数据分析等核心内容。
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/project/shopping-cart"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-700 to-secondary-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
                >
                  开始学习
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/expert-insights"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 font-semibold rounded-xl border border-gray-200 hover:border-primary transition-all hover:shadow-md"
                >
                  专家洞察
                </Link>
              </div>
              
              <div className="mt-12 flex items-center gap-8">
                <div>
                  <div className="text-3xl font-bold text-gray-900">10</div>
                  <div className="text-sm text-gray-600">实战项目</div>
                </div>
                <div className="w-px h-12 bg-gray-200" />
                <div>
                  <div className="text-3xl font-bold text-gray-900">50+</div>
                  <div className="text-sm text-gray-600">代码示例</div>
                </div>
                <div className="w-px h-12 bg-gray-200" />
                <div>
                  <div className="text-3xl font-bold text-gray-900">5</div>
                  <div className="text-sm text-gray-600">核心思维模式</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Projects Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              实战项目
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              通过优化后的代码示例，学习数据分析的最佳实践
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {projects.map((project, index) => (
              <ProjectCard
                key={project.id}
                id={project.id}
                title={project.title}
                description={project.description}
                icon={project.icon}
                color={project.color}
                path={project.path}
                delay={index * 80}
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-blue-50 to-teal-50 rounded-3xl p-12 text-center relative overflow-hidden border border-blue-100">
          <div className="absolute top-0 left-0 right-0 bottom-0 opacity-20">
            <div className="absolute top-8 left-8 w-32 h-32 bg-blue-200 rounded-full" />
            <div className="absolute bottom-8 right-8 w-24 h-24 bg-teal-200 rounded-full" />
          </div>
          
          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              准备开始学习了吗？
            </h2>
            <p className="text-gray-700 mb-8 max-w-xl mx-auto">
              选择一个实战项目，开始您的数据分析学习之旅
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/project/shopping-cart"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-700 to-secondary-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
              >
                立即开始
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
