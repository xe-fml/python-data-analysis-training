import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { BarChart3, ShoppingCart, Users, Zap } from 'lucide-react'

const Navbar: React.FC = () => {
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  return (
    <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Python数据分析
            </span>
          </Link>

          <div className="flex items-center gap-6">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors duration-200 ${
                isActive('/') ? 'text-primary' : 'text-gray-600 hover:text-primary'
              }`}
            >
              首页
            </Link>
            <div className="flex items-center gap-4">
              <Link
                to="/project/shopping-cart"
                className={`text-sm font-medium transition-colors duration-200 flex items-center gap-1.5 ${
                  isActive('/project/shopping-cart') ? 'text-primary' : 'text-gray-600 hover:text-primary'
                }`}
              >
                <ShoppingCart className="w-4 h-4" />
                购物车分析
              </Link>
              <Link
                to="/project/customer-segmentation"
                className={`text-sm font-medium transition-colors duration-200 flex items-center gap-1.5 ${
                  isActive('/project/customer-segmentation') ? 'text-primary' : 'text-gray-600 hover:text-primary'
                }`}
              >
                <Users className="w-4 h-4" />
                客户分群
              </Link>
              <Link
                to="/project/sales-analysis"
                className={`text-sm font-medium transition-colors duration-200 flex items-center gap-1.5 ${
                  isActive('/project/sales-analysis') ? 'text-primary' : 'text-gray-600 hover:text-primary'
                }`}
              >
                <Zap className="w-4 h-4" />
                销售数据分析
              </Link>
            </div>
            <Link
              to="/expert-insights"
              className={`text-sm font-medium transition-colors duration-200 ${
                isActive('/expert-insights') ? 'text-primary' : 'text-gray-600 hover:text-primary'
              }`}
            >
              专家洞察
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
