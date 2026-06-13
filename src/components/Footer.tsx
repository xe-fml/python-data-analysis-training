import React from 'react'
import { BarChart3 } from 'lucide-react'

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary-800 to-secondary-800 bg-clip-text text-transparent">
                Python数据分析
              </span>
            </div>
            <p className="text-gray-600 text-sm">
              通过实战项目和优化后的代码示例，快速掌握数据分析技能。
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-4">学习资源</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>购物车分析</li>
              <li>客户分群分析</li>
              <li>销售数据分析</li>
              <li>专家洞察</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-4">优化要点</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>代码规范 (PEP8)</li>
              <li>性能优化</li>
              <li>数据清洗</li>
              <li>可视化与解读</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
          <p>© 2024 Python数据分析训练平台. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
