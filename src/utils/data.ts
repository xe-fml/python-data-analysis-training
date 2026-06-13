import { ShoppingCart, Users, Zap, Activity, TrendingUp, Package, BarChart2, GitCompare, MessageSquare, DollarSign } from 'lucide-react'

export interface Step {
  number: number
  title: string
  content: string
}

export interface CodeExample {
  title: string
  description: string
  code: string
}

export interface Insight {
  title: string
  content: string
}

export interface Exercise {
  id: number
  title: string
  description: string
  difficulty: 'easy' | 'medium' | 'hard'
  type: 'concept' | 'code' | 'coding'
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  // 实操题字段：代码编辑器
  initialCode?: string
  expectedOutput?: string
  hint?: string
}

export interface Project {
  id: string
  title: string
  description: string
  icon: any
  color: string
  path: string
  steps: Step[]
  codeExamples: CodeExample[]
  insights: Insight[]
  exercises: Exercise[]
}

export const projects: Project[] = [
  {
    id: 'shopping-cart',
    title: '购物车分析',
    description: '分析电商平台用户购物车数据，识别购买模式和行为趋势',
    icon: ShoppingCart,
    color: 'from-blue-500 to-cyan-500',
    path: '/project/shopping-cart',
    steps: [
      {
        number: 1,
        title: '数据加载与清洗',
        content: '使用pandas读取CSV文件，根据业务逻辑合理处理缺失值（关键字段缺失则删除，价格等用中位数填充），转换日期格式，处理异常值（价格不能为负）。'
      },
      {
        number: 2,
        title: '关键指标分析',
        content: '计算购物车放弃率、平均购物车商品数量、平均订单价值、平均购买频率，识别高价值用户（消费前10%）。'
      },
      {
        number: 3,
        title: '用户行为分析',
        content: '分析各时段购物车分布和完成率，商品类别销售表现，购买完成率等深度洞察。'
      },
      {
        number: 4,
        title: '可视化与业务解读',
        content: '创建可视化图表展示购物车完成情况分布、购物车商品数量分布、用户消费金额分布、各时段购物车完成率，并提供业务建议。'
      }
    ],
    codeExamples: [
      {
        title: '数据加载与清洗',
        description: '完整的数据清洗流程，包括缺失值处理和异常值过滤',
        code: `import pandas as pd

def load_and_clean_data(file_path: str):
    # 读取数据
    df = pd.read_csv(file_path)
    
    # 处理缺失值：根据业务逻辑选择合适的填充策略
    df = df.dropna(subset=['user_id', 'product_id'])
    df['price'] = df['price'].fillna(df['price'].median())
    
    # 转换时间戳为datetime类型
    df['timestamp'] = pd.to_datetime(df['timestamp'], errors='coerce')
    df = df.dropna(subset=['timestamp'])
    
    # 处理异常值：价格不能为负数
    df = df[df['price'] >= 0]
    
    # 确保purchase_completed为布尔类型
    df['purchase_completed'] = df['purchase_completed'].astype(bool)
    
    return df`
      },
      {
        title: '关键指标计算',
        description: '使用向量化操作计算购物车分析关键指标',
        code: `import pandas as pd

def analyze_cart_metrics(df: pd.DataFrame):
    metrics = {}
    
    # 购物车放弃率
    total_carts = df['cart_id'].nunique()
    completed_carts = df[df['purchase_completed']]['cart_id'].nunique()
    abandoned_carts = total_carts - completed_carts
    metrics['abandonment_rate'] = abandoned_carts / total_carts if total_carts > 0 else 0
    
    # 平均购物车商品数量
    cart_size_dist = df.groupby('cart_id')['product_id'].count()
    metrics['avg_cart_size'] = cart_size_dist.mean()
    
    # 平均订单价值
    completed_orders = df[df['purchase_completed']].groupby('cart_id')['price'].sum()
    metrics['avg_order_value'] = completed_orders.mean()
    
    # 高价值用户识别（消费前10%）
    user_total_spending = df[df['purchase_completed']].groupby('user_id')['price'].sum()
    high_value_threshold = user_total_spending.quantile(0.9)
    metrics['high_value_user_count'] = (user_total_spending >= high_value_threshold).sum()
    
    return metrics`
      }
    ],
    insights: [
      {
        title: '核心发现',
        content: '购物车放弃率过高是影响转化率的关键因素，高价值用户贡献了主要收入，建议针对高放弃率时段进行优化。'
      },
      {
        title: '业务建议',
        content: '优化结账流程减少用户流失，设置购物车提醒功能召回未完成订单用户，针对高价值用户提供专属优惠。'
      }
    ],
    exercises: [
      {
        id: 1,
        title: '数据加载基础',
        description: '使用pandas加载CSV数据并查看基本信息',
        difficulty: 'easy',
        type: 'concept',
        question: '使用pandas读取CSV文件的正确方法是？',
        options: [
          'pd.read_csv("data.csv")',
          'pd.load_csv("data.csv")',
          'pd.open_csv("data.csv")',
          'pd.import_csv("data.csv")'
        ],
        correctAnswer: 0,
        explanation: 'pandas使用read_csv()方法读取CSV文件，这是标准的读取方法。'
      },
      {
        id: 2,
        title: 'Python代码：数据加载',
        description: '编写代码加载购物车数据',
        difficulty: 'easy',
        type: 'code',
        question: '以下代码的输出结果是什么？\n\nimport pandas as pd\ndf = pd.read_csv("cart.csv")\nprint(df.shape)',
        options: [
          '数据的列名',
          '数据的行数和列数',
          '数据的前5行',
          '数据的列数据类型'
        ],
        correctAnswer: 1,
        explanation: 'df.shape返回元组(dataframe的行数, dataframe的列数)，所以是行数和列数。'
      },
      {
        id: 3,
        title: '缺失值处理',
        description: '处理数据中的缺失值',
        difficulty: 'easy',
        type: 'concept',
        question: '在购物车分析中，user_id字段有缺失值，最佳处理方式是？',
        options: [
          '用0填充',
          '用平均值填充',
          '删除包含缺失值的行',
          '用"unknown"填充'
        ],
        correctAnswer: 2,
        explanation: 'user_id是关键标识字段，不能为空或用其他值填充，删除是最佳选择。'
      },
      {
        id: 4,
        title: 'Python代码：缺失值检测',
        description: '检测数据中的缺失值',
        difficulty: 'medium',
        type: 'code',
        question: '以下代码的输出结果是什么？\n\nimport pandas as pd\ndf = pd.DataFrame({\n  "A": [1, 2, None],\n  "B": [4, None, 6]\n})\nprint(df.isnull().sum())',
        options: [
          'A    1\nB    1\ndtype: int64',
          'A    1\nB    2\ndtype: int64',
          'A    2\nB    1\ndtype: int64',
          'A    3\nB    3\ndtype: int64'
        ],
        correctAnswer: 0,
        explanation: 'isnull().sum()统计每列的缺失值数量。A列有1个None，B列有1个None，所以输出A:1, B:1。'
      },
      {
        id: 5,
        title: '购物车放弃率计算',
        description: '计算购物车的放弃率',
        difficulty: 'medium',
        type: 'concept',
        question: '购物车放弃率的正确计算公式是？',
        options: [
          '放弃的购物车数 / 总购物车数 × 100%',
          '成功的购物车数 / 总购物车数 × 100%',
          '总购物车数 / 放弃的购物车数 × 100%',
          '(放弃的购物车数 - 成功的购物车数) / 总购物车数 × 100%'
        ],
        correctAnswer: 0,
        explanation: '购物车放弃率 = 放弃的购物车数 / 总购物车数 × 100%，表示未完成购买的比例。'
      },
      {
        id: 6,
        title: 'Python代码：放弃率计算',
        description: '编写代码计算购物车放弃率',
        difficulty: 'medium',
        type: 'code',
        question: '假设total_carts=1000, completed_carts=300, abandoned_carts=700，计算放弃率的方法正确的是？',
        options: [
          'abandoned_carts / total_carts',
          'completed_carts / total_carts',
          'abandoned_carts / completed_carts',
          '(total_carts - completed_carts) / completed_carts'
        ],
        correctAnswer: 0,
        explanation: '放弃率 = 放弃的购物车数 / 总购物车数 = 700/1000 = 0.7 (70%)'
      },
      {
        id: 7,
        title: '高价值用户识别',
        description: '识别消费金额前10%的用户',
        difficulty: 'medium',
        type: 'concept',
        question: '在识别高价值用户时，使用quantile(0.9)方法的含义是？',
        options: [
          '找出消费金额排在后10%的用户',
          '找出消费金额排在前10%的用户',
          '找出消费金额等于90元的用户',
          '找出消费金额等于第90百分位的用户'
        ],
        correctAnswer: 1,
        explanation: 'quantile(0.9)返回第90百分位数，即找出排在前10%（大于等于90%）的用户。'
      },
      {
        id: 8,
        title: 'Python代码：时段分析',
        description: '分析不同时间段的购物车表现',
        difficulty: 'hard',
        type: 'code',
        question: '以下代码的输出结果是什么？\n\nimport pandas as pd\ndf = pd.DataFrame({\n  "hour": [9, 14, 21, 9, 14],\n  "converted": [True, False, True, True, False]\n})\nprint(df.groupby("hour")["converted"].mean())',
        options: [
          'hour\n9     0.67\n14    0.00\n21    1.00\nName: converted, dtype: float64',
          'hour\n9     2\n14    0\n21    1\nName: converted, dtype: int64',
          'hour\n9     1.00\n14    0.50\n21    1.00\nName: converted, dtype: float64',
          'hour\n9     0.5\n14    0.5\n21    1.0\nName: converted, dtype: float64'
        ],
        correctAnswer: 0,
        explanation: 'groupby("hour")["converted"].mean()计算每小时的转化率。hour=9有2条记录(1个True)，所以0.5...等等，True=1, False=0，平均值是0.67，但选项中更接近的是0.67 (2/3≈0.67)。hour=14有2个False，平均0。hour=21有1个True，平均1.0。'
      },
      {
        id: 9,
        title: '复购周期分析',
        description: '分析用户的复购周期特征',
        difficulty: 'hard',
        type: 'concept',
        question: '计算用户复购周期的正确步骤是？',
        options: [
          '所有订单日期直接相加求平均',
          '每个用户按日期排序，计算相邻订单日期差，取平均值',
          '找出最早和最晚订单日期相减',
          '统计每个月的订单数量'
        ],
        correctAnswer: 1,
        explanation: '复购周期 = 用户每次购买的间隔时间。需要先按用户分组，再按日期排序，计算相邻订单的时间差。'
      },
      {
        id: 10,
        title: '实战编程：完整购物车分析函数',
        description: '编写完整的购物车分析函数，整合数据清洗、指标计算和结果输出',
        difficulty: 'hard',
        type: 'coding',
        question: '请在下面的编辑器中编写一个完整的购物车分析函数。\n\n任务：\n1. 创建一组模拟购物车数据（3个购物车，其中2个完成购买）\n2. 统计唯一购物车数量\n3. 统计完成购买的购物车数量\n4. 计算购物车放弃率（未完成/总数）\n5. 打印结果\n\n期望输出包含：Total carts、Completed carts、Abandonment rate（70%左右）',
        options: [],
        correctAnswer: 0,
        explanation: '参考实现：\n\n# 模拟3个购物车的数据\ndata = [\n    {"cart_id": 1, "user_id": 101, "price": 29.9, "purchase_completed": True},\n    {"cart_id": 1, "user_id": 101, "price": 15.5, "purchase_completed": True},\n    {"cart_id": 2, "user_id": 102, "price": 89.0, "purchase_completed": False},\n    {"cart_id": 2, "user_id": 102, "price": 12.3, "purchase_completed": False},\n    {"cart_id": 3, "user_id": 103, "price": 45.0, "purchase_completed": True},\n]\n\ntotal_carts = len(set(item["cart_id"] for item in data))  # = 3\ncompleted_carts = len(set(d["cart_id"] for d in data if d["purchase_completed"]))  # = 2\nabandonment_rate = (total_carts - completed_carts) / total_carts * 100  # = 33.3%\n\nprint(f"Total carts: {total_carts}")\nprint(f"Completed carts: {completed_carts}")\nprint(f"Abandonment rate: {abandonment_rate:.1f}%")',
        initialCode: `# ========== 购物车分析练习 ==========
# 任务：创建模拟购物车数据，统计总数、完成数，并计算放弃率

# 1) 模拟 3 个购物车（同 cart_id 可能多条商品）
data = [
    {"cart_id": 1, "user_id": 101, "price": 29.9, "purchase_completed": True},
    {"cart_id": 1, "user_id": 101, "price": 15.5, "purchase_completed": True},
    {"cart_id": 2, "user_id": 102, "price": 89.0, "purchase_completed": False},
    {"cart_id": 2, "user_id": 102, "price": 12.3, "purchase_completed": False},
    {"cart_id": 3, "user_id": 103, "price": 45.0, "purchase_completed": True},
]

# 2) 统计
total_carts = len(set(item["cart_id"] for item in data))
completed_carts = len(set(d["cart_id"] for d in data if d["purchase_completed"]))
abandonment_rate = (total_carts - completed_carts) / total_carts * 100

# 3) 打印
print(f"Total carts: {total_carts}")
print(f"Completed carts: {completed_carts}")
print(f"Abandonment rate: {abandonment_rate:.1f}%")
`,
        expectedOutput: 'Total carts',
        hint: '核心思路：\n1. 用列表推导式创建数据：[{"cart_id":1, "price":29.9, "purchase_completed":True}, ...]\n2. 用set(item["cart_id"] for item in data)去重后取len()\n3. completed用条件过滤：d for d in data if d["purchase_completed"]\n4. 打印时使用 f-string 格式化：f"Abandonment rate: {rate:.1f}%"'
      }
    ]
  },
  {
    id: 'customer-segmentation',
    title: '客户分群分析',
    description: '使用聚类算法对客户进行分群，识别不同客户群体的特征',
    icon: Users,
    color: 'from-purple-500 to-pink-500',
    path: '/project/customer-segmentation',
    steps: [
      {
        number: 1,
        title: '数据预处理与特征工程',
        content: '准备客户数据，选择合适的特征（年龄、年收入、消费分数、购买频率等），进行标准化处理（K-means对尺度敏感）。'
      },
      {
        number: 2,
        title: '确定最佳聚类数',
        content: '使用肘部法则和轮廓系数确定最佳聚类数，可视化惯性和轮廓系数变化曲线，选择合适的k值。'
      },
      {
        number: 3,
        title: '执行K-means聚类',
        content: '使用K-means算法进行聚类，评估轮廓系数，将聚类结果合并到原始数据中。'
      },
      {
        number: 4,
        title: '聚类结果分析与营销建议',
        content: '分析每个聚类的特征，为不同客户群体命名和制定差异化营销策略。'
      }
    ],
    codeExamples: [
      {
        title: '特征工程与数据标准化',
        description: 'K-means聚类前的数据预处理和特征工程',
        code: `import pandas as pd
from sklearn.preprocessing import StandardScaler

def feature_engineering(df: pd.DataFrame):
    features = ['age', 'annual_income', 'spending_score', 'purchase_frequency']
    features = [f for f in features if f in df.columns]
    
    X = df[features].copy()
    
    # 数据标准化（K-means对尺度敏感）
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    return X_scaled, scaler`
      },
      {
        title: 'K-means聚类实现',
        description: '完整的K-means聚类实现，包括肘部法则和轮廓系数',
        code: `from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score

def determine_optimal_clusters(X, max_k=10):
    inertia = []
    silhouette_scores = []
    
    for k in range(2, max_k + 1):
        kmeans = KMeans(n_clusters=k, random_state=42, n_init='auto')
        labels = kmeans.fit_predict(X)
        inertia.append(kmeans.inertia_)
        
        if k > 1:
            silhouette_avg = silhouette_score(X, labels)
            silhouette_scores.append(silhouette_avg)
    
    # 实际使用时根据肘部和轮廓系数选择最佳k
    return 4  # 默认值

def perform_kmeans_clustering(X, n_clusters):
    kmeans = KMeans(n_clusters=n_clusters, random_state=42, n_init='auto')
    labels = kmeans.fit_predict(X)
    
    silhouette_avg = silhouette_score(X, labels)
    return labels, kmeans`
      }
    ],
    insights: [
      {
        title: '客户群体特征',
        content: '通常可识别出高价值VIP客户、年轻潜力客户、谨慎消费客户、价格敏感客户等群体，不同群体需要差异化的营销策略。'
      },
      {
        title: '营销建议',
        content: '对高价值客户提供专属服务，对年轻客户使用社交媒体营销，对谨慎客户提供质量保证，对价格敏感客户提供优惠券。'
      }
    ],
    exercises: [
      {
        id: 1,
        title: '特征标准化',
        description: '理解K-means聚类前的特征标准化',
        difficulty: 'easy',
        type: 'concept',
        question: '为什么K-means聚类前需要对特征进行标准化？',
        options: [
          '加快计算速度',
          '因为K-means对特征尺度敏感，不同量纲会影响聚类结果',
          '避免缺失值',
          '必须的数据格式要求'
        ],
        correctAnswer: 1,
        explanation: 'K-means使用欧氏距离计算，不同量纲的特征会导致距离计算被大尺度特征主导，影响聚类效果。'
      },
      {
        id: 2,
        title: 'Python代码：特征标准化',
        description: '使用sklearn进行特征标准化',
        difficulty: 'easy',
        type: 'code',
        question: '以下代码的输出结果是什么？\n\nfrom sklearn.preprocessing import StandardScaler\nscaler = StandardScaler()\nX = [[1, 2], [3, 4]]\nprint(scaler.fit_transform(X)[0])',
        options: [
          '[1, 2]',
          '[-1, -1]',
          '[-1.0, -1.0]',
          '[0.5, 0.5]'
        ],
        correctAnswer: 2,
        explanation: 'StandardScaler对数据进行标准化：(x-mean)/std。第一列均值2，标准差1，结果为[-1, 1]。第二列均值3，标准差1，结果为[-1, 1]。'
      },
      {
        id: 3,
        title: '肘部法则',
        description: '理解确定最佳聚类数的肘部法则',
        difficulty: 'medium',
        type: 'concept',
        question: '肘部法则中，"肘部"点代表什么意思？',
        options: [
          '聚类效果最好的点',
          '增加聚类数后inertia下降最明显的点',
          '增加聚类数后inertia下降趋于平缓的点',
          'inertia等于0的点'
        ],
        correctAnswer: 2,
        explanation: '肘部法则是找inertia下降从陡峭变为平缓的转折点（肘部），该点之后增加K值收益递减，是最佳聚类数。'
      },
      {
        id: 4,
        title: 'Python代码：肘部法则实现',
        description: '编写代码实现肘部法则',
        difficulty: 'medium',
        type: 'code',
        question: 'KMeans的inertia_属性表示什么？',
        options: [
          '聚类数量',
          '样本到其所属簇中心的距离平方和',
          '轮廓系数',
          '聚类迭代次数'
        ],
        correctAnswer: 1,
        explanation: 'inertia_是KMeans的一个重要指标，表示所有样本到其所属簇中心的距离平方和（组内平方和），越小表示聚类越紧凑。'
      },
      {
        id: 5,
        title: '轮廓系数',
        description: '理解轮廓系数的含义',
        difficulty: 'medium',
        type: 'concept',
        question: '轮廓系数的取值范围是？',
        options: [
          '[0, 1]',
          '[-1, 1]',
          '[0, 100]',
          '[-∞, +∞]'
        ],
        correctAnswer: 1,
        explanation: '轮廓系数范围[-1, 1]。接近1表示聚类紧凑且分离良好，接近0表示簇重叠，接近-1表示样本可能被分到了错误的簇。'
      },
      {
        id: 6,
        title: 'Python代码：轮廓系数计算',
        description: '使用sklearn计算轮廓系数',
        difficulty: 'medium',
        type: 'code',
        question: '以下代码的输出结果最可能是多少？\n\nfrom sklearn.metrics import silhouette_score\nlabels = [0, 0, 0, 1, 1, 1]\nX = [[1, 2], [1.5, 1.8], [1.2, 2.1], [5, 6], [5.5, 5.8], [5.2, 6.1]]\nprint(silhouette_score(X, labels))',
        options: [
          '-0.5',
          '0.8',
          '0',
          '1.5'
        ],
        correctAnswer: 1,
        explanation: '数据明显分成两组（[1,2]附近和[5,6]附近），聚类正确且紧凑，轮廓系数会很高，接近1表示聚类效果很好。'
      },
      {
        id: 7,
        title: '聚类结果分析',
        description: '理解聚类结果的分析方法',
        difficulty: 'medium',
        type: 'concept',
        question: '分析各聚类特征时，应该关注什么统计量？',
        options: [
          '众数',
          '均值、中位数、标准差',
          '最大值',
          '缺失值数量'
        ],
        correctAnswer: 1,
        explanation: '分析聚类特征时，均值和中位数反映聚类中心特征，标准差反映特征分布，完整描述各聚类的典型特征。'
      },
      {
        id: 8,
        title: 'Python代码：聚类结果统计',
        description: '统计各聚类的特征分布',
        difficulty: 'hard',
        type: 'code',
        question: '假设有聚类标签labels，以下代码的作用是？\n\ndf["cluster"] = labels\nprint(df.groupby("cluster").mean())',
        options: [
          '计算每个聚类的样本数量',
          '计算每个聚类各特征的均值',
          '计算每个聚类的标准差',
          '过滤每个聚类的数据'
        ],
        correctAnswer: 1,
        explanation: 'groupby("cluster").mean()按聚类标签分组，计算每个聚类内各数值特征的平均值，反映各聚类的典型特征。'
      },
      {
        id: 9,
        title: 'PCA降维',
        description: '理解PCA降维可视化',
        difficulty: 'hard',
        type: 'concept',
        question: '使用PCA将高维数据降到2维后，2个主成分能解释的方差比例是？',
        options: [
          '100%',
          '由PCA自动决定',
          '不一定，可能需要查看explained_variance_ratio_',
          '50%'
        ],
        correctAnswer: 2,
        explanation: 'PCA降维后的方差解释比例需要查看explained_variance_ratio_属性，不一定很高，可能丢失较多信息。'
      },
      {
        id: 10,
        title: '实战编程：完整客户分群分析函数',
        description: '编写完整的客户分群分析函数，包括数据标准化、聚类算法和结果分析',
        difficulty: 'hard',
        type: 'coding',
        question: '请在下面的编辑器中编写客户分群分析代码。\n\n任务：\n1. 创建5个客户的模拟数据，每人有age(年龄)、annual_income(年收入万)、spending_score(消费评分1-100)\n2. 为每个客户计算综合价值分：age*0.1 + annual_income*0.5 + spending_score*0.4\n3. 按照价值分分群：High (>60)、Medium (30-60)、Low (<30)\n4. 统计并打印每群的客户数量\n\n期望输出包含："High value customers" 或各群人数统计',
        options: [],
        correctAnswer: 0,
        explanation: '参考实现：\n\n# 5个客户数据\ncustomers = [\n    {"id": 1, "age": 25, "annual_income": 40, "spending_score": 85},\n    {"id": 2, "age": 45, "annual_income": 120, "spending_score": 70},\n    {"id": 3, "age": 35, "annual_income": 70, "spending_score": 55},\n    {"id": 4, "age": 55, "annual_income": 150, "spending_score": 45},\n    {"id": 5, "age": 30, "annual_income": 55, "spending_score": 95},\n]\n\nfor c in customers:\n    c["value_score"] = c["age"]*0.1 + c["annual_income"]*0.5 + c["spending_score"]*0.4\n    if c["value_score"] > 60:\n        c["segment"] = "High"\n    elif c["value_score"] >= 30:\n        c["segment"] = "Medium"\n    else:\n        c["segment"] = "Low"\n\nseg_counts = {}\nfor c in customers:\n    s = c["segment"]\n    seg_counts[s] = seg_counts.get(s, 0) + 1\n\nfor seg in ["High", "Medium", "Low"]:\n    print(f"{seg} value customers: {seg_counts.get(seg, 0)}")',
        initialCode: `# ========== 客户分群分析练习 ==========
# 任务：创建客户数据，计算综合价值分，并按分群统计

# 1) 客户数据
customers = [
    {"id": 1, "age": 25, "annual_income": 40, "spending_score": 85},
    {"id": 2, "age": 45, "annual_income": 85, "spending_score": 35},
    {"id": 3, "age": 32, "annual_income": 65, "spending_score": 70},
    {"id": 4, "age": 55, "annual_income": 95, "spending_score": 20},
    {"id": 5, "age": 28, "annual_income": 55, "spending_score": 92},
]

# 2) 计算价值分：age*0.1 + income*0.5 + spending*0.4
for c in customers:
    c["value_score"] = c["age"] * 0.1 + c["annual_income"] * 0.5 + c["spending_score"] * 0.4
    if c["value_score"] > 60:
        c["segment"] = "High value customers"
    elif c["value_score"] >= 30:
        c["segment"] = "Medium value customers"
    else:
        c["segment"] = "Low value customers"

# 3) 统计各群数量
seg_counts = {}
for c in customers:
    seg_counts[c["segment"]] = seg_counts.get(c["segment"], 0) + 1

# 4) 打印
print("=== 客户分群结果 ===")
for c in customers:
    print(f"客户{c['id']}: 价值分={c['value_score']:.1f}  -> {c['segment']}")
print("\n=== 各群统计 ===")
for seg, cnt in seg_counts.items():
    print(f"{seg}: {cnt} 人")
`,
        expectedOutput: 'High value customers',
        hint: "解题思路：用列表存储客户数据，用 for 循环计算价值分并判断分群，统计各群客户数量后打印。"
      }
    ]
  },
  {
    id: 'sales-analysis',
    title: '销售数据分析',
    description: '分析销售数据，识别销售趋势、季节性模式和产品表现',
    icon: Zap,
    color: 'from-orange-500 to-yellow-500',
    path: '/project/sales-analysis',
    steps: [
      {
        number: 1,
        title: '时间序列数据处理',
        content: '读取销售数据，将日期转换为datetime格式，设置日期索引，按月份汇总销售数据，计算同比和环比增长率。'
      },
      {
        number: 2,
        title: '销售趋势分析',
        content: '绘制销售趋势图，分析月度环比增长率，识别销售高峰和低谷期。'
      },
      {
        number: 3,
        title: '季节性模式分析',
        content: '分析月度、季度、星期的平均销售模式，识别明显的季节性规律。'
      },
      {
        number: 4,
        title: '产品表现分析与预测',
        content: '分析产品销售排名、市场份额，使用移动平均法进行简单的销售预测。'
      }
    ],
    codeExamples: [
      {
        title: '时间序列分析',
        description: '销售数据的时间序列分析与趋势计算',
        code: `import pandas as pd

def analyze_sales_trends(df: pd.DataFrame):
    # 按月份汇总
    monthly_sales = df['sales'].resample('ME').sum().to_frame(name='sales')
    
    # 计算同比增长
    monthly_sales['yoy_growth'] = monthly_sales['sales'].pct_change(12) * 100
    monthly_sales['mom_growth'] = monthly_sales['sales'].pct_change() * 100
    
    return monthly_sales

def analyze_seasonality(df: pd.DataFrame):
    # 提取时间特征
    df['month'] = df.index.month
    df['quarter'] = df.index.quarter
    df['day_of_week'] = df.index.dayofweek
    
    # 月度销售模式
    monthly_pattern = df.groupby('month')['sales'].mean()
    # 季度销售模式
    quarterly_pattern = df.groupby('quarter')['sales'].mean()
    # 星期销售模式
    weekday_pattern = df.groupby('day_of_week')['sales'].mean()
    
    return monthly_pattern, quarterly_pattern, weekday_pattern`
      },
      {
        title: '产品表现分析',
        description: '产品销售排名和市场份额分析',
        code: `import pandas as pd

def analyze_product_performance(df: pd.DataFrame):
    if 'product_id' not in df.columns:
        return None
    
    # 产品销售排名
    product_sales = df.groupby('product_id')['sales'].sum().sort_values(ascending=False)
    product_quantity = df.groupby('product_id')['quantity'].sum()
    
    # 计算市场份额
    total_sales = df['sales'].sum()
    product_share = (product_sales / total_sales * 100).round(2)
    
    product_analysis = pd.DataFrame({
        'total_sales': product_sales.round(2),
        'total_quantity': product_quantity,
        'market_share': product_share
    })
    
    return product_analysis`
      }
    ],
    insights: [
      {
        title: '关键发现',
        content: '销售通常呈现明显的季节性波动，少数头部产品贡献了大部分销售额，周末销售额通常高于工作日。'
      },
      {
        title: '业务建议',
        content: '在销售旺季前增加库存储备，淡季推出促销活动，针对头部产品加大营销投入，优化周末服务能力。'
      }
    ],
    exercises: [
      {
        id: 1,
        title: '时间序列数据处理',
        description: '理解时间序列数据的处理方法',
        difficulty: 'easy',
        type: 'concept',
        question: '将日期列转换为datetime类型的原因是？',
        options: [
          '节省存储空间',
          '方便进行时间相关的分析和计算',
          '必须的数据格式',
          '加快读取速度'
        ],
        correctAnswer: 1,
        explanation: '转换为datetime后可以进行日期计算、提取年月周日、排序、时间区间分析等时间序列操作。'
      },
      {
        id: 2,
        title: 'Python代码：时间转换',
        description: '编写代码转换日期格式',
        difficulty: 'easy',
        type: 'code',
        question: '以下代码的输出结果是什么？\n\nimport pandas as pd\ndf = pd.DataFrame({\n  "date": ["2024-01-01", "2024-01-02"]\n})\ndf["date"] = pd.to_datetime(df["date"])\nprint(df["date"].dt.year)',
        options: [
          '[1, 2]',
          '[2024, 2024]',
          '["2024-01-01", "2024-01-02"]',
          '[0, 1]'
        ],
        correctAnswer: 1,
        explanation: 'pd.to_datetime()转换后，.dt.year提取年份，两条记录都是2024年，返回[2024, 2024]。'
      },
      {
        id: 3,
        title: '环比增长率',
        description: '理解环比增长率的计算',
        difficulty: 'medium',
        type: 'concept',
        question: '环比增长率的计算公式是？',
        options: [
          '(本期值 - 上期值) / 上期值 × 100%',
          '(本期值 - 去年同期值) / 去年同期值 × 100%',
          '本期值 / 上期值',
          '上期值 / 本期值'
        ],
        correctAnswer: 0,
        explanation: '环比是与上一期相比，所以是(本期-上期)/上期。同比是与去年同期相比。'
      },
      {
        id: 4,
        title: 'Python代码：环比计算',
        description: '编写代码计算环比增长率',
        difficulty: 'medium',
        type: 'code',
        question: '假设sales = [100, 120, 150]，以下代码的输出是什么？\n\nimport pandas as pd\ns = pd.Series([100, 120, 150])\nprint(s.pct_change())',
        options: [
          '[NaN, 0.2, 0.25]',
          '[0.2, 0.25, 0.3]',
          '[1.0, 1.2, 1.5]',
          '[NaN, 120, 150]'
        ],
        correctAnswer: 0,
        explanation: 'pct_change()计算环比增长率：第一个是NaN（没有上期），第二个是(120-100)/100=0.2，第三个是(150-120)/120=0.25。'
      },
      {
        id: 5,
        title: '季节性分析',
        description: '理解销售数据的季节性模式',
        difficulty: 'medium',
        type: 'concept',
        question: '销售数据通常在哪些月份会出现高峰？',
        options: [
          '1月、2月',
          '6月、7月',
          '11月、12月',
          '3月、4月'
        ],
        correctAnswer: 2,
        explanation: '11月（双十一）和12月（圣诞/元旦）是电商销售的旺季，通常会有销售高峰。'
      },
      {
        id: 6,
        title: 'Python代码：月度汇总',
        description: '编写代码按月汇总销售数据',
        difficulty: 'medium',
        type: 'code',
        question: '时间序列数据按月汇总的正确方法是？',
        options: [
          'df.groupby("month").sum()',
          'df.resample("ME").sum()',
          'df.sort_values("date").head()',
          'df["sales"].rolling(30).sum()'
        ],
        correctAnswer: 1,
        explanation: 'resample("ME")是时间序列数据的重采样方法，"ME"表示月结束，sum()对每月求和。'
      },
      {
        id: 7,
        title: '产品排名分析',
        description: '理解产品销售排名的分析方法',
        difficulty: 'medium',
        type: 'concept',
        question: '帕累托法则（二八定律）在销售分析中意味着什么？',
        options: [
          '80%的产品贡献20%的销售额',
          '20%的产品贡献80%的销售额',
          '80%的用户贡献20%的购买',
          '20%的用户贡献所有购买'
        ],
        correctAnswer: 1,
        explanation: '帕累托法则：通常20%的产品（爆款）贡献了80%的销售额，这是分析头部产品的重要依据。'
      },
      {
        id: 8,
        title: 'Python代码：产品排名',
        description: '编写代码统计产品销售排名',
        difficulty: 'hard',
        type: 'code',
        question: '以下代码的输出结果是？\n\nimport pandas as pd\ndf = pd.DataFrame({\n  "product": ["A", "B", "A", "C", "B"],\n  "sales": [100, 200, 150, 50, 300]\n})\nprint(df.groupby("product")["sales"].sum().sort_values(ascending=False))',
        options: [
          'B    500\nA    250\nC    50',
          'A    250\nB    500\nC    50',
          'C    50\nA    250\nB    500',
          'product\nB    500\nA    250\nC    50\nName: sales, dtype: int64'
        ],
        correctAnswer: 0,
        explanation: '按产品分组求和：A=100+150=250，B=200+300=500，C=50。sort_values(ascending=False)降序排列。'
      },
      {
        id: 9,
        title: '移动平均预测',
        description: '理解移动平均法的预测原理',
        difficulty: 'hard',
        type: 'concept',
        question: '移动平均法的主要优点是？',
        options: [
          '可以预测长期趋势',
          '可以消除短期波动，反映长期趋势',
          '可以处理季节性数据',
          '可以处理缺失值'
        ],
        correctAnswer: 1,
        explanation: '移动平均通过平均一定期间的数据来消除短期波动，能更好地反映数据的长期趋势。'
      },
      {
        id: 10,
        title: '实战编程：完整销售数据分析函数',
        description: '编写完整的销售数据分析函数，包括月度汇总、增长率计算和季节性分析',
        difficulty: 'hard',
        type: 'coding',
        question: '请在下面的编辑器中编写销售数据分析代码。任务要求：\n1. 创建6个月的模拟销售数据（月/销售额）\n2. 计算每月的环比增长率（%）\n3. 找出销售额最高和最低的月份\n4. 计算平均月销售额\n5. 打印出完整的分析报告',
        options: [],
        correctAnswer: 0,
        explanation: '参考实现：\n1) 使用列表存储每月数据：sales = [("Jan", 12000), ("Feb", 15000), ...]\n2) 环比增长率 = (本月 - 上月) / 上月 × 100\n3) 用 for idx in range(1, len(sales)): 遍历计算\n4) max_sale = max(sales, key=lambda x: x[1])\n5) avg = sum(s for _, s in sales) / len(sales)\n6) 用 print() 输出格式化报告，确保包含"Growth Rate"字样',
        initialCode: `# ========== 销售数据分析练习 ==========
# 任务：月度销售数据统计、增长率分析与最高最低月份识别

sales = [("Jan", 12000), ("Feb", 15000), ("Mar", 18000),
         ("Apr", 16500), ("May", 22000), ("Jun", 25000)]

total = sum(s for _, s in sales)
avg = total / len(sales)
top = max(sales, key=lambda x: x[1])
bottom = min(sales, key=lambda x: x[1])

print("=== 销售月度报告 ===")
for m, s in sales:
    print(f"{m}: \${s:,.0f}")
print(f"\n总销售额: \${total:,.0f}")
print(f"平均月销售额: \${avg:,.0f}")
print(f"最高月份: {top[0]} (\${top[1]:,.0f})")
print(f"最低月份: {bottom[0]} (\${bottom[1]:,.0f})")

print("\n--- 环比增长率 (Growth Rate) ---")
for i in range(1, len(sales)):
    rate = (sales[i][1] - sales[i - 1][1]) / sales[i - 1][1] * 100
    print(f"{sales[i - 1][0]} -> {sales[i][0]}: {rate:+.1f}%")
`,
        expectedOutput: 'Growth Rate',
        hint: "解题思路：用列表存储每月销售额，遍历计算环比增长率，用 max/min 找出最高最低月份，最后打印完整分析报告。"
      }
    ]
  },
  {
    id: 'user-behavior',
    title: '用户行为分析',
    description: '分析用户在网站或App上的行为数据，优化用户体验和转化率',
    icon: Activity,
    color: 'from-indigo-500 to-purple-500',
    path: '/project/user-behavior',
    steps: [
      {
        number: 1,
        title: '数据收集与清洗',
        content: '收集用户行为数据（页面浏览、点击、停留时间等），处理缺失值和异常值，统一时间格式。'
      },
      {
        number: 2,
        title: '行为漏斗分析',
        content: '分析用户从访问到转化的完整路径，识别转化瓶颈和流失环节。'
      },
      {
        number: 3,
        title: '用户分群与画像',
        content: '根据行为特征对用户进行分群，构建用户画像，理解不同用户群体的行为模式。'
      },
      {
        number: 4,
        title: '优化建议与测试',
        content: '基于分析结果提出优化建议，设计A/B测试验证效果。'
      }
    ],
    codeExamples: [
      {
        title: '漏斗分析',
        description: '计算用户转化漏斗各环节转化率',
        code: `import pandas as pd

def analyze_funnel(df: pd.DataFrame):
    # 定义漏斗步骤
    funnel_steps = ['visit', 'product_view', 'add_to_cart', 'checkout', 'purchase']
    
    # 计算每一步的用户数
    funnel_data = []
    for step in funnel_steps:
        count = df[df[step] == True]['user_id'].nunique()
        funnel_data.append({'step': step, 'users': count})
    
    funnel_df = pd.DataFrame(funnel_data)
    
    # 计算转化率
    funnel_df['conversion_rate'] = funnel_df['users'] / funnel_df['users'].iloc[0] * 100
    funnel_df['drop_off_rate'] = 100 - funnel_df['conversion_rate']
    
    return funnel_df`
      },
      {
        title: '用户行为路径分析',
        description: '分析用户在网站上的访问路径',
        code: `import pandas as pd

def analyze_user_paths(df: pd.DataFrame):
    # 按用户和时间排序
    df_sorted = df.sort_values(['user_id', 'timestamp'])
    
    # 生成用户路径
    user_paths = df_sorted.groupby('user_id')['page'].apply(list).reset_index()
    user_paths['path_length'] = user_paths['page'].apply(len)
    user_paths['path_str'] = user_paths['page'].apply(lambda x: ' -> '.join(x))
    
    # 统计路径频率
    path_counts = user_paths['path_str'].value_counts().head(20)
    
    return user_paths, path_counts`
      }
    ],
    insights: [
      {
        title: '核心发现',
        content: '用户在购物车阶段流失率最高，首页到产品页的转化率影响整体转化效果。'
      },
      {
        title: '业务建议',
        content: '优化购物车页面体验，简化结账流程，加强产品详情页的信息展示。'
      }
    ],
    exercises: [
      {
        id: 1,
        title: '用户会话识别',
        description: '理解用户会话的概念',
        difficulty: 'easy',
        type: 'concept',
        question: '用户会话(session)通常如何定义？',
        options: [
          '每个用户只有1个会话',
          '用户一次访问网站的所有行为，不管时间间隔',
          '用户在一定时间间隔内的连续行为',
          '用户每次点击算一个会话'
        ],
        correctAnswer: 2,
        explanation: '用户会话是用户在一定时间间隔内的连续行为。通常设定一个时间阈值（如30分钟），超过这个时间间隔的访问被视为新的会话。'
      },
      {
        id: 2,
        title: 'Python代码：会话识别',
        description: '编写代码识别用户会话',
        difficulty: 'easy',
        type: 'code',
        question: '以下代码的输出结果是什么？\n\nimport pandas as pd\ndf = pd.DataFrame({\n  "user_id": [1, 1, 1],\n  "timestamp": ["2024-01-01 10:00", "2024-01-01 10:30", "2024-01-01 11:00"]\n})\nprint(len(df["user_id"].unique()))',
        options: [
          '1',
          '2',
          '3',
          '0'
        ],
        correctAnswer: 0,
        explanation: 'unique()返回唯一值列表，len()得到数量。用户ID都是1，所以只有1个唯一用户。'
      },
      {
        id: 3,
        title: '转化漏斗分析',
        description: '理解转化漏斗的概念',
        difficulty: 'medium',
        type: 'concept',
        question: '电商转化漏斗通常包含哪些步骤？',
        options: [
          '访问 → 注册 → 登录',
          '访问 → 浏览 → 搜索',
          '访问 → 加购 → 下单 → 支付',
          '访问 → 收藏 → 分享'
        ],
        correctAnswer: 2,
        explanation: '标准电商转化漏斗：访问 → 浏览产品 → 加购物车 → 提交订单 → 完成支付，漏斗逐步递减。'
      },
      {
        id: 4,
        title: 'Python代码：漏斗分析',
        description: '编写代码计算转化漏斗',
        difficulty: 'medium',
        type: 'code',
        question: '访问=1000，加购=300，支付=100，计算加购转化率的正确方法是？',
        options: [
          '(1000 - 300) / 1000',
          '300 / 1000',
          '100 / 300',
          '100 / 1000'
        ],
        correctAnswer: 1,
        explanation: '加购转化率 = 加购人数 / 访问人数 = 300/1000 = 30%。'
      },
      {
        id: 5,
        title: '跳出率分析',
        description: '理解跳出率的概念',
        difficulty: 'medium',
        type: 'concept',
        question: '跳出率高的页面说明什么？',
        options: [
          '页面很受欢迎',
          '用户在该页面停留时间长',
          '用户到达页面后没有进一步操作就离开',
          '页面加载速度快'
        ],
        correctAnswer: 2,
        explanation: '跳出率=只访问一个页面就离开的访问次数/总访问次数。高跳出率说明页面未能引导用户继续浏览。'
      },
      {
        id: 6,
        title: 'Python代码：跳出率',
        description: '编写代码计算页面跳出率',
        difficulty: 'medium',
        type: 'code',
        question: '以下代码用于识别跳出用户，bounced_users包含什么？\n\npage_views = df.groupby("user_id")["page"].count()\nbounced_users = page_views[page_views == 1].index',
        options: [
          '访问超过1页的用户ID',
          '只访问1页的用户ID',
          '访问最多的用户ID',
          '访问最少的用户ID'
        ],
        correctAnswer: 1,
        explanation: 'page_views == 1筛选出访问页数等于1的用户，.index获取这些用户的ID。'
      },
      {
        id: 7,
        title: '用户路径分析',
        description: '理解用户路径分析方法',
        difficulty: 'hard',
        type: 'concept',
        question: '分析用户路径的主要目的是什么？',
        options: [
          '统计用户数量',
          '了解用户访问顺序，发现常见路径和异常路径',
          '计算用户停留时间',
          '识别高价值用户'
        ],
        correctAnswer: 1,
        explanation: '用户路径分析追踪用户在网站上的访问顺序，了解用户如何浏览，发现最常见路径，优化用户体验。'
      },
      {
        id: 8,
        title: 'Python代码：路径生成',
        description: '编写代码生成用户访问路径',
        difficulty: 'hard',
        type: 'code',
        question: '以下代码的输出是什么？\n\nimport pandas as pd\ndf = pd.DataFrame({\n  "user_id": [1, 1, 1],\n  "page": ["A", "B", "C"]\n})\npaths = df.groupby("user_id")["page"].apply(list)\nprint(paths[1])',
        options: [
          '"A"',
          '["A"]',
          '["A", "B", "C"]',
          'A, B, C'
        ],
        correctAnswer: 2,
        explanation: 'groupby("user_id")["page"].apply(list)将每个用户的页面访问按顺序组合成列表。'
      },
      {
        id: 9,
        title: '用户分群分析',
        description: '理解用户分群的方法',
        difficulty: 'hard',
        type: 'concept',
        question: '基于行为特征进行用户分群，可以使用的特征有哪些？',
        options: [
          '用户年龄、性别',
          '访问频率、停留时间、转化与否',
          '用户职业、收入',
          '用户地址、邮编'
        ],
        correctAnswer: 1,
        explanation: '行为特征包括：访问频率、页面停留时间、浏览深度、转化行为、购买金额等，用于识别不同类型的用户群体。'
      },
      {
        id: 10,
        title: '实战编程：用户行为漏斗分析',
        description: '编写用户转化漏斗分析代码，计算各环节转化率和流失率',
        difficulty: 'hard',
        type: 'coding',
        question: '请在下面的编辑器中编写用户行为漏斗分析代码。任务要求：\n1. 创建漏斗数据（5个步骤：访问→产品页→加购→结账→购买，每步用户数递减）\n2. 计算每步相对于首步的转化率（%）\n3. 计算每步相对于上一步的流失率（%）\n4. 找出流失最高的环节\n5. 打印完整漏斗分析报告',
        options: [],
        correctAnswer: 0,
        explanation: '参考实现：\n1) funnel = [("访问", 10000), ("产品页", 6500), ("加购", 2800), ("结账", 1500), ("购买", 1100)]\n2) 转化率 = 当前用户数 / 首步用户数 × 100\n3) 流失率 = (上一步-当前步) / 上一步 × 100\n4) 用 for i in range(len(funnel)): 遍历每步\n5) 输出中包含"Conversion"或"Funnel"字样',
        initialCode: `# ========== 用户行为漏斗分析练习 ==========
# 任务：计算用户行为漏斗（访问 -> 产品页 -> 加购 -> 结账 -> 购买）的转化率与流失率

funnel = [
    ("访问", 10000),
    ("产品页", 6500),
    ("加入购物车", 2800),
    ("结账", 1500),
    ("完成购买", 1100),
]

total_users = funnel[0][1]
highest_drop_stage = None
highest_drop_rate = -1.0

print("=== 用户行为漏斗分析报告 ===")
for i, (stage, users) in enumerate(funnel):
    conversion = users / total_users * 100
    if i == 0:
        drop_off = 0.0
    else:
        drop_off = (funnel[i - 1][1] - users) / funnel[i - 1][1] * 100
        if drop_off > highest_drop_rate:
            highest_drop_rate = drop_off
            highest_drop_stage = (funnel[i - 1][0], stage)
    print(f"{stage}: {users} 用户 | 转化率: {conversion:.1f}% | 流失率: {drop_off:.1f}%")

final_conversion = funnel[-1][1] / total_users * 100
print(f"\n总转化率: {final_conversion:.1f}%")
print(f"最严重流失环节: {highest_drop_stage[0]} -> {highest_drop_stage[1]} ({highest_drop_rate:.1f}%)")
`,
        expectedOutput: 'Funnel',
        hint: "解题思路：用列表存储漏斗每环节用户数，遍历计算转化率和流失率，找出流失最高环节并输出完整报告。"
      }
    ]
  },
  {
    id: 'ab-testing',
    title: 'A/B测试分析',
    description: '设计和分析A/B测试，评估不同版本的效果差异',
    icon: GitCompare,
    color: 'from-red-500 to-pink-500',
    path: '/project/ab-testing',
    steps: [
      {
        number: 1,
        title: '实验设计',
        content: '确定测试目标和假设，设计对照组和实验组，确保样本量足够。'
      },
      {
        number: 2,
        title: '数据收集',
        content: '收集两组用户的行为数据，确保数据完整性和准确性。'
      },
      {
        number: 3,
        title: '统计检验',
        content: '使用假设检验（如t检验、卡方检验）评估两组之间的差异是否显著。'
      },
      {
        number: 4,
        title: '结果解读与决策',
        content: '根据统计结果判断哪个版本更优，提出业务决策建议。'
      }
    ],
    codeExamples: [
      {
        title: 'A/B测试统计分析',
        description: '使用统计检验评估两组数据差异',
        code: `import pandas as pd
from scipy import stats

def analyze_ab_test(control_data, variant_data, metric='conversion_rate'):
    # 计算均值和标准差
    control_mean = control_data[metric].mean()
    variant_mean = variant_data[metric].mean()
    
    # 独立样本t检验
    t_stat, p_value = stats.ttest_ind(control_data[metric], variant_data[metric])
    
    # 计算效应量Cohen's d
    pooled_std = ((len(control_data) - 1) * control_data[metric].std() ** 2 + 
                  (len(variant_data) - 1) * variant_data[metric].std() ** 2) / \
                 (len(control_data) + len(variant_data) - 2)
    pooled_std = pooled_std ** 0.5
    effect_size = abs(variant_mean - control_mean) / pooled_std
    
    result = {
        'control_mean': control_mean,
        'variant_mean': variant_mean,
        'lift': (variant_mean - control_mean) / control_mean * 100,
        'p_value': p_value,
        'effect_size': effect_size,
        'statistically_significant': p_value < 0.05
    }
    
    return result`
      },
      {
        title: '样本量计算',
        description: '计算所需的最小样本量',
        code: `import math
from scipy import stats

def calculate_sample_size(
    baseline_conversion: float,
    minimum_detectable_effect: float,
    alpha: float = 0.05,
    power: float = 0.8
) -> int:
    """
    计算A/B测试所需的最小样本量
    
    参数:
        baseline_conversion: 基准转化率
        minimum_detectable_effect: 最小可检测效果（相对变化）
        alpha: 显著性水平
        power: 检验效能
    """
    # 计算效应大小
    p1 = baseline_conversion
    p2 = baseline_conversion * (1 + minimum_detectable_effect)
    
    # 计算合并比例
    p_pooled = (p1 + p2) / 2
    
    # 计算Z分数
    z_alpha = stats.norm.ppf(1 - alpha / 2)
    z_power = stats.norm.ppf(power)
    
    # 计算样本量
    sample_size = (z_alpha * math.sqrt(2 * p_pooled * (1 - p_pooled)) + 
                   z_power * math.sqrt(p1 * (1 - p1) + p2 * (1 - p2))) ** 2 / \
                  (p2 - p1) ** 2
    
    return math.ceil(sample_size)`
      }
    ],
    insights: [
      {
        title: '核心发现',
        content: 'B版本转化率比A版本提升了15%，统计检验显示差异显著（p<0.05）。'
      },
      {
        title: '业务建议',
        content: '将B版本推广到全部用户，持续监测效果，考虑进一步优化。'
      }
    ],
    exercises: [
      {
        id: 1,
        title: '实验设计基础',
        description: '理解A/B测试的实验设计',
        difficulty: 'easy',
        type: 'concept',
        question: 'A/B测试中，对照组和实验组的划分原则是？',
        options: [
          '随意分配',
          '按用户ID单双号分配',
          '随机分配，保证两组用户特征相似',
          '按用户年龄分配'
        ],
        correctAnswer: 2,
        explanation: 'A/B测试要求随机分配用户到两组，保证两组用户特征分布一致，避免选择偏差影响实验结果。'
      },
      {
        id: 2,
        title: 'Python代码：随机分组',
        description: '编写代码进行随机分组',
        difficulty: 'easy',
        type: 'code',
        question: '以下代码的输出是什么？\n\nimport numpy as np\nnp.random.seed(42)\nusers = list(range(10))\nprint(np.random.choice(users, 4, replace=False))',
        options: [
          '[0, 1, 2, 3]',
          '随机4个不同用户的列表',
          '[4, 2, 5, 7]',
          '报错'
        ],
        correctAnswer: 2,
        explanation: 'np.random.seed(42)设定随机种子保证可复现，choice(users, 4, replace=False)从10个用户中随机选4个不重复的。固定种子时结果是[4 2 5 7]。'
      },
      {
        id: 3,
        title: '统计显著性',
        description: '理解统计显著性的概念',
        difficulty: 'medium',
        type: 'concept',
        question: '统计显著性p<0.05意味着什么？',
        options: [
          '实验组效果比对照组好50%',
          '两组差异由随机因素造成的概率小于5%',
          '对照组效果更好',
          '实验可以停止了'
        ],
        correctAnswer: 1,
        explanation: 'p<0.05表示如果两组没有真实差异，观察到这样或更大差异的概率<5%，我们有95%把握认为差异真实存在。'
      },
      {
        id: 4,
        title: 'Python代码：t检验',
        description: '使用Python进行统计检验',
        difficulty: 'medium',
        type: 'code',
        question: 't检验用于比较什么？',
        options: [
          '两个分类变量的差异',
          '两个连续变量的均值差异',
          '一个变量的方差',
          '多个分组的均值'
        ],
        correctAnswer: 1,
        explanation: 't检验(独立样本t检验)用于比较两组连续变量的均值是否存在显著差异。'
      },
      {
        id: 5,
        title: '效应量',
        description: '理解效应量的含义',
        difficulty: 'medium',
        type: 'concept',
        question: '为什么需要报告效应量(Cohen\'s d)？',
        options: [
          'p值不够准确',
          '统计显著性不等于实际重要性，效应量反映实际差异大小',
          '样本量太小',
          '需要计算置信区间'
        ],
        correctAnswer: 1,
        explanation: '大样本时p值容易显著但差异很小。效应量Cohen\'s d反映实际差异大小，帮助判断结果的实际意义。'
      },
      {
        id: 6,
        title: 'Python代码：效应量计算',
        description: '计算Cohen\'s d',
        difficulty: 'medium',
        type: 'code',
        question: 'Cohen\'s d的计算公式是？',
        options: [
          '(均值1 - 均值2) / 标准差',
          '(均值1 - 均值2) / 合并标准差',
          '(均值1 + 均值2) / 方差',
          '均值1 / 均值2'
        ],
        correctAnswer: 1,
        explanation: 'Cohen\'s d = (均值差) / 合并标准差，消除了数据波动的影响，反映标准化的差异大小。'
      },
      {
        id: 7,
        title: '置信区间',
        description: '理解置信区间的含义',
        difficulty: 'hard',
        type: 'concept',
        question: '95%置信区间的正确解释是？',
        options: [
          '有95%的概率包含真实值',
          '如果重复实验100次，约95次会包含真实值',
          '真实值有95%在这个范围内',
          '误差不超过5%'
        ],
        correctAnswer: 1,
        explanation: '置信区间是频率学派概念：重复抽样100次，约95次的置信区间会包含真实参数值。不是"有95%概率包含"。'
      },
      {
        id: 8,
        title: 'Python代码：置信区间',
        description: '计算均值置信区间',
        difficulty: 'hard',
        type: 'code',
        question: '计算置信区间需要知道哪些值？',
        options: [
          '样本均值和样本最大值',
          '样本均值、标准误和z/t值',
          '样本中位数和方差',
          '样本大小和方差'
        ],
        correctAnswer: 1,
        explanation: '置信区间 = 样本均值 ± 关键值(z/t) × 标准误，需要这三个组成部分。'
      },
      {
        id: 9,
        title: '样本量计算',
        description: '理解样本量计算原理',
        difficulty: 'hard',
        type: 'concept',
        question: '影响所需样本量的因素有哪些？',
        options: [
          '实验持续时间',
          '基准转化率和最小可检测效应',
          '用户总数',
          '服务器性能'
        ],
        correctAnswer: 1,
        explanation: '样本量主要取决于：基准转化率（决定方差）和最小可检测效应（决定需要检测的差异大小）。'
      },
      {
        id: 10,
        title: '实战编程：完整A/B测试分析函数',
        description: '编写完整的A/B测试分析函数，包括数据分组、转化率计算和显著性判断',
        difficulty: 'hard',
        type: 'coding',
        question: '请在下面的编辑器中编写A/B测试分析代码。任务要求：\n1. 创建对照组和实验组数据（每组分母总数和转化数）\n2. 计算各组转化率（%）\n3. 计算实验组相对对照组的提升率（Lift %）\n4. 使用简易规则判断是否显著（转化率差异>5%且样本量>1000视为显著）\n5. 打印完整测试分析报告',
        options: [],
        correctAnswer: 0,
        explanation: '参考实现：\n1) control = {"total": 5000, "converted": 520}  variant = {"total": 5000, "converted": 610}\n2) 转化率 = converted / total × 100\n3) Lift = (实验组-对照组)/对照组 × 100\n4) 显著性规则：abs(lift) > 5 and min(total) > 1000\n5) 输出中包含"Lift"字样',
        initialCode: `# ========== A/B 测试分析练习 ==========
# 任务：计算对照组 / 实验组的转化率，并评估 Lift

# 对照组（旧版）
control_total, control_conv = 5000, 520
# 实验组（新 UI）
variant_total, variant_conv = 5000, 610

control_rate = control_conv / control_total * 100
variant_rate = variant_conv / variant_total * 100
lift = (variant_rate - control_rate) / control_rate * 100

print("=== A/B 测试分析报告 ===")
print(f"对照组: {control_conv}/{control_total} 转化，转化率 {control_rate:.2f}%")
print(f"实验组: {variant_conv}/{variant_total} 转化，转化率 {variant_rate:.2f}%")
print(f"Lift: {lift:+.2f}%")

# 简易显著性判定
significant = abs(lift) > 5 and min(control_total, variant_total) > 1000
print(f"显著: {'是 (pseudo significant)' if significant else '否'}")
`,
        expectedOutput: 'Lift',
        hint: "解题思路：用字典存储对照组/实验组总人数和转化数，计算转化率及 Lift，用简单规则判断显著性后打印报告。"
      }
    ]
  },
  {
    id: 'marketing-analysis',
    title: '营销活动分析',
    description: '评估营销活动的效果，优化营销预算分配',
    icon: DollarSign,
    color: 'from-green-500 to-emerald-500',
    path: '/project/marketing-analysis',
    steps: [
      {
        number: 1,
        title: '数据整合',
        content: '整合营销活动数据、销售数据、用户数据，建立统一的分析数据集。'
      },
      {
        number: 2,
        title: 'ROI分析',
        content: '计算各营销渠道的投资回报率，评估活动效果。'
      },
      {
        number: 3,
        title: '归因分析',
        content: '使用多触点归因模型，确定各渠道对转化的贡献。'
      },
      {
        number: 4,
        title: '优化建议',
        content: '基于分析结果优化营销预算分配，提高整体ROI。'
      }
    ],
    codeExamples: [
      {
        title: '营销ROI分析',
        description: '计算各营销渠道的投资回报率',
        code: `import pandas as pd

def calculate_marketing_roi(marketing_data: pd.DataFrame):
    # 计算各渠道ROI
    marketing_data['roi'] = (marketing_data['revenue'] - marketing_data['spend']) / \
                          marketing_data['spend'] * 100
    
    # 计算各渠道贡献
    marketing_data['revenue_share'] = marketing_data['revenue'] / \
                                    marketing_data['revenue'].sum() * 100
    marketing_data['spend_share'] = marketing_data['spend'] / \
                                  marketing_data['spend'].sum() * 100
    
    # 按ROI排序
    marketing_data = marketing_data.sort_values('roi', ascending=False)
    
    return marketing_data`
      },
      {
        title: '首次触点归因',
        description: '实现首次触点归因模型',
        code: `import pandas as pd

def first_touch_attribution(df: pd.DataFrame):
    # 按用户和时间排序
    df_sorted = df.sort_values(['user_id', 'timestamp'])
    
    # 获取每个用户的首次触点
    first_touch = df_sorted.groupby('user_id').first().reset_index()
    
    # 计算各渠道归因收入
    attribution = first_touch.groupby('channel').agg({
        'revenue': 'sum',
        'user_id': 'nunique'
    }).reset_index()
    
    attribution.columns = ['channel', 'attributed_revenue', 'users']
    
    return attribution`
      }
    ],
    insights: [
      {
        title: '核心发现',
        content: '社交媒体渠道ROI最高，搜索引擎渠道带来最多新用户。'
      },
      {
        title: '业务建议',
        content: '增加社交媒体渠道预算，优化搜索引擎投放策略，尝试新的营销渠道。'
      }
    ],
    exercises: [
      {
        id: 1,
        title: '营销ROI概念',
        description: '理解营销投资回报率',
        difficulty: 'easy',
        type: 'concept',
        question: '营销ROI的计算公式是？',
        options: [
          '(收入 - 成本) / 成本 × 100%',
          '收入 / 成本 × 100%',
          '(收入 - 成本) / 收入 × 100%',
          '成本 / 收入 × 100%'
        ],
        correctAnswer: 0,
        explanation: 'ROI = (收入 - 成本) / 成本 × 100%，反映每投入1元能获得多少回报。'
      },
      {
        id: 2,
        title: 'Python代码：ROI计算',
        description: '编写代码计算营销渠道ROI',
        difficulty: 'easy',
        type: 'code',
        question: '收入=1000元，成本=200元，ROI是多少？',
        options: [
          '500%',
          '400%',
          '80%',
          '20%'
        ],
        correctAnswer: 1,
        explanation: 'ROI = (1000-200)/200 × 100% = 800/200 × 100% = 400%'
      },
      {
        id: 3,
        title: '归因模型',
        description: '理解营销归因的概念',
        difficulty: 'medium',
        type: 'concept',
        question: '首次触点归因模型将转化功劳归给？',
        options: [
          '用户最后一次接触的渠道',
          '用户第一次接触的渠道',
          '用户接触的所有渠道平均分配',
          '转化发生时的渠道'
        ],
        correctAnswer: 1,
        explanation: '首次触点归因模型认为第一次接触渠道对用户转化影响最大，将100%功劳归给首次触点。'
      },
      {
        id: 4,
        title: 'Python代码：归因分析',
        description: '编写代码实现首次触点归因',
        difficulty: 'medium',
        type: 'code',
        question: '以下代码实现了什么归因模型？\n\ndf_sorted = df.sort_values("timestamp")\nfirst_touch = df_sorted.groupby("user_id").first()\nattribution = first_touch["channel"].value_counts()',
        options: [
          '末次触点归因',
          '首次触点归因',
          '线性归因',
          '时间衰减归因'
        ],
        correctAnswer: 1,
        explanation: '先按时间排序，然后取每个用户的first()记录，就是首次触点，统计各渠道次数就是首次触点归因。'
      },
      {
        id: 5,
        title: '渠道效果对比',
        description: '理解多渠道营销效果分析',
        difficulty: 'medium',
        type: 'concept',
        question: '评估营销渠道效果时，主要关注哪些指标？',
        options: [
          '仅关注收入',
          'ROI、转化率、CPA、曝光量',
          '仅关注成本',
          '仅关注转化量'
        ],
        correctAnswer: 1,
        explanation: '全面评估需要ROI（收益效率）、转化率（用户响应）、CPA（获取成本）、曝光量（覆盖范围）等多个指标。'
      },
      {
        id: 6,
        title: 'Python代码：渠道对比',
        description: '按渠道分组统计',
        difficulty: 'medium',
        type: 'code',
        question: '计算各渠道转化率的代码是？',
        options: [
          'df.groupby("channel")["visits"].mean()',
          'df.groupby("channel").agg({"conversions": "sum", "visits": "sum"}).assign(rate=lambda x: x["conversions"]/x["visits"])',
          'df["conversions"].sum() / df["visits"].sum()',
          'df.groupby("channel")["conversions"].count()'
        ],
        correctAnswer: 1,
        explanation: '先分组计算总数，然后计算转化率=成交数/访问数，这才是真正的渠道转化率。'
      },
      {
        id: 7,
        title: '线性归因',
        description: '理解线性归因模型',
        difficulty: 'hard',
        type: 'concept',
        question: '用户经过3个渠道后转化，线性归因下每个渠道分得多少功劳？',
        options: [
          '每个渠道100%',
          '每个渠道33.3%',
          '首个渠道50%，其余各25%',
          '末个渠道100%'
        ],
        correctAnswer: 1,
        explanation: '线性归因平均分配功劳：100%/3 = 33.3%，不区分渠道位置。'
      },
      {
        id: 8,
        title: 'Python代码：线性归因',
        description: '实现线性归因模型',
        difficulty: 'hard',
        type: 'code',
        question: '线性归因中，权重分配的原则是？',
        options: [
          '每个触点权重相同',
          '越接近转化的触点权重越高',
          '首个触点权重最高',
          '随机分配权重'
        ],
        correctAnswer: 0,
        explanation: '线性归因将功劳平均分配给所有触点，每个触点权重相同。'
      },
      {
        id: 9,
        title: '时间衰减归因',
        description: '理解时间衰减归因模型',
        difficulty: 'hard',
        type: 'concept',
        question: '时间衰减归因中，权重分配的原则是？',
        options: [
          '每个触点权重相同',
          '越接近转化的触点权重越高',
          '首个触点权重最高',
          '权重随机'
        ],
        correctAnswer: 1,
        explanation: '时间衰减归因假设越接近转化时刻的触点影响越大，权重越高。'
      },
      {
        id: 10,
        title: '实战编程：完整营销归因分析函数',
        description: '编写完整的营销归因分析函数，包括渠道ROI计算和归因收入分配',
        difficulty: 'hard',
        type: 'coding',
        question: '请在下面的编辑器中编写营销归因分析代码。任务要求：\n1. 创建4个营销渠道数据（渠道名/成本/收入/转化用户数）\n2. 计算每个渠道的ROI（(收入-成本)/成本 × 100%）\n3. 计算每个渠道的归因收入占比（%）\n4. 找出ROI最高的渠道\n5. 打印完整归因分析报告',
        options: [],
        correctAnswer: 0,
        explanation: '参考实现：\n1) channels = [{"name": "搜索引擎", "cost": 5000, "revenue": 25000, "users": 300}, ...]\n2) ROI = (revenue - cost) / cost × 100\n3) total_revenue = sum(c["revenue"] for c in channels)\n4) pct = revenue / total_revenue × 100\n5) 输出中包含"ROI"字样',
        initialCode: `# ========== 营销归因分析练习 ==========
# 任务：按渠道统计 ROI 与归因收入占比

channels = [
    {"name": "搜索引擎", "cost": 5000, "revenue": 25000, "users": 300},
    {"name": "社交媒体", "cost": 3000, "revenue": 18000, "users": 250},
    {"name": "邮件营销", "cost": 1500, "revenue": 9000, "users": 120},
    {"name": "展示广告", "cost": 4000, "revenue": 12000, "users": 180},
]

total_revenue = sum(c["revenue"] for c in channels)
total_cost = sum(c["cost"] for c in channels)

best_channel = max(channels, key=lambda c: (c["revenue"] - c["cost"]) / c["cost"])

print("=== 营销渠道归因分析报告 ===")
for c in channels:
    roi = (c["revenue"] - c["cost"]) / c["cost"] * 100
    share = c["revenue"] / total_revenue * 100
    print(f'{c["name"]}: 成本=\${c["cost"]} 收入=\${c["revenue"]} ROI={roi:.1f}% 占比={share:.1f}%')

overall_roi = (total_revenue - total_cost) / total_cost * 100
print(f"\n总成本: \${total_cost} / 总收入: \${total_revenue} / 整体 ROI: {overall_roi:.1f}%")
print(f'最佳 ROI 渠道: {best_channel["name"]}')
`,
        expectedOutput: 'ROI',
        hint: "解题思路：用列表存储各渠道成本、收入和用户数，计算 ROI 和占比，用 max 找出最高 ROI 渠道并打印分析报告。"
      }
    ]
  },
  {
    id: 'inventory-analysis',
    title: '库存管理分析',
    description: '优化库存水平，减少缺货和积压',
    icon: Package,
    color: 'from-amber-500 to-orange-500',
    path: '/project/inventory-analysis',
    steps: [
      {
        number: 1,
        title: '库存数据整理',
        content: '收集库存水平、销售数据、采购数据，建立完整的库存数据集。'
      },
      {
        number: 2,
        title: '库存周转率分析',
        content: '计算库存周转率，识别滞销和畅销商品。'
      },
      {
        number: 3,
        title: '需求预测',
        content: '使用时间序列模型预测未来需求，优化补货策略。'
      },
      {
        number: 4,
        title: '安全库存计算',
        content: '确定合理的安全库存水平，平衡缺货成本和持有成本。'
      }
    ],
    codeExamples: [
      {
        title: '库存周转率分析',
        description: '计算库存周转率和周转天数',
        code: `import pandas as pd

def analyze_inventory_turnover(df: pd.DataFrame):
    # 计算库存周转率
    df['turnover_rate'] = df['cost_of_goods_sold'] / df['average_inventory']
    
    # 计算周转天数
    df['days_inventory'] = 365 / df['turnover_rate']
    
    # 按周转率排序
    df = df.sort_values('turnover_rate', ascending=False)
    
    # 识别滞销商品（周转率低于阈值）
    df['is_slow_moving'] = df['turnover_rate'] < 3
    
    return df`
      },
      {
        title: '安全库存计算',
        description: '计算安全库存水平',
        code: `import math
from scipy import stats

def calculate_safety_stock(
    demand_std: float,
    lead_time_days: int,
    service_level: float = 0.95
) -> float:
    """
    计算安全库存
    
    参数:
        demand_std: 日需求标准差
        lead_time_days: 提前期（天）
        service_level: 服务水平
    """
    # 计算Z分数
    z_score = stats.norm.ppf(service_level)
    
    # 计算安全库存
    safety_stock = z_score * demand_std * math.sqrt(lead_time_days)
    
    return safety_stock

def calculate_reorder_point(
    avg_daily_demand: float,
    lead_time_days: int,
    safety_stock: float
) -> float:
    """计算再订货点"""
    return avg_daily_demand * lead_time_days + safety_stock`
      }
    ],
    insights: [
      {
        title: '核心发现',
        content: '20%的商品占库存价值的80%，部分商品库存周转天数超过90天。'
      },
      {
        title: '业务建议',
        content: '对滞销商品进行促销清仓，优化畅销商品补货策略，建立ABC分类管理体系。'
      }
    ],
    exercises: [
      {
        id: 1,
        title: '库存周转率概念',
        description: '理解库存周转率的含义',
        difficulty: 'easy',
        type: 'concept',
        question: '库存周转率越高意味着什么？',
        options: [
          '库存积压严重',
          '商品销售速度快，库存管理效率高',
          '采购成本高',
          '商品质量好'
        ],
        correctAnswer: 1,
        explanation: '库存周转率=销售成本/平均库存，周转率高说明商品销售快，资金回笼迅速。'
      },
      {
        id: 2,
        title: 'Python代码：周转率计算',
        description: '编写代码计算库存周转率',
        difficulty: 'easy',
        type: 'code',
        question: '销售成本=10000，平均库存=2000，库存周转率是？',
        options: [
          '2',
          '5',
          '0.2',
          '8'
        ],
        correctAnswer: 1,
        explanation: '库存周转率 = 销售成本 / 平均库存 = 10000 / 2000 = 5'
      },
      {
        id: 3,
        title: 'ABC分类法',
        description: '理解ABC分类管理',
        difficulty: 'medium',
        type: 'concept',
        question: 'ABC分类中，A类商品的特点是？',
        options: [
          '数量多，价值低',
          '数量少，价值高，需重点管理',
          '数量和价值都中等',
          '数量和价值都很高'
        ],
        correctAnswer: 1,
        explanation: 'A类商品通常占品种的20%，但贡献80%的销售额，需要重点管理和监控。'
      },
      {
        id: 4,
        title: 'Python代码：ABC分类',
        description: '实现ABC分类',
        difficulty: 'medium',
        type: 'code',
        question: 'ABC分类的主要依据是什么？',
        options: [
          '商品数量',
          '商品销售额累计占比',
          '商品重量',
          '商品进货价'
        ],
        correctAnswer: 1,
        explanation: 'ABC分类按销售额累计占比排序，前80%为A类，80-95%为B类，剩余为C类。'
      },
      {
        id: 5,
        title: '安全库存',
        description: '理解安全库存的概念',
        difficulty: 'medium',
        type: 'concept',
        question: '设置安全库存的目的是？',
        options: [
          '降低采购成本',
          '防止意外缺货',
          '提高周转率',
          '减少仓储空间'
        ],
        correctAnswer: 1,
        explanation: '安全库存作为缓冲，防止因需求波动或供应延迟导致的缺货。'
      },
      {
        id: 6,
        title: 'Python代码：安全库存',
        description: '计算安全库存',
        difficulty: 'medium',
        type: 'code',
        question: '安全库存主要考虑哪些因素？',
        options: [
          '商品重量和体积',
          '需求波动和供应提前期',
          '采购成本和仓储费用',
          '供应商距离'
        ],
        correctAnswer: 1,
        explanation: '安全库存 = Z值 × 需求标准差 × √提前期，主要考虑需求的不确定性和供应时间的不确定性。'
      },
      {
        id: 7,
        title: '再订货点',
        description: '理解再订货点的概念',
        difficulty: 'hard',
        type: 'concept',
        question: '再订货点(ROP)的计算公式是？',
        options: [
          '平均日销量 × 订货周期',
          '安全库存 + 平均日销量 × 订货周期',
          '最高库存 - 安全库存',
          '最低库存 + 安全库存'
        ],
        correctAnswer: 1,
        explanation: 'ROP = 安全库存 + 平均日销量 × 订货周期，保证在库存降到安全线前有足够时间订货。'
      },
      {
        id: 8,
        title: 'Python代码：再订货点',
        description: '计算再订货点',
        difficulty: 'hard',
        type: 'code',
        question: '日销量=10，订货周期=5天，安全库存=20，ROP是？',
        options: [
          '30',
          '50',
          '70',
          '15'
        ],
        correctAnswer: 2,
        explanation: 'ROP = 安全库存 + 日销量 × 订货周期 = 20 + 10 × 5 = 70'
      },
      {
        id: 9,
        title: '滞销商品识别',
        description: '理解滞销商品的判断标准',
        difficulty: 'hard',
        type: 'concept',
        question: '判断滞销商品的主要指标是？',
        options: [
          '商品价格',
          '商品重量',
          '库存周转天数',
          '商品体积'
        ],
        correctAnswer: 2,
        explanation: '库存周转天数=365/周转率，周转天数过长（如超过90天）通常被认为是滞销商品。'
      },
      {
        id: 10,
        title: '实战编程：完整库存分析函数',
        description: '编写完整的库存分析函数，包括周转率计算、ABC分类和滞销商品识别',
        difficulty: 'hard',
        type: 'coding',
        question: '请在下面的编辑器中编写库存分析代码。任务要求：\n1. 创建5个商品数据（商品名/销售成本/平均库存/销售额）\n2. 计算每个商品的库存周转率（cogs/avg_inventory）和周转天数（365/周转率）\n3. 按销售额降序排列，进行ABC分类（累计占比<=80%A, <=95%B, 其余C）\n4. 识别滞销商品（周转天数>90天）\n5. 打印完整库存分析报告',
        options: [],
        correctAnswer: 0,
        explanation: '参考实现：\n1) items = [{"name": "商品A", "cogs": 50000, "avg_inventory": 5000, "sales": 80000}, ...]\n2) turnover_rate = cogs / avg_inventory\n3) days_inventory = 365 / turnover_rate\n4) ABC分类：先按销售额降序，累加计算累计占比，再分类\n5) 输出中包含"Turnover"或"ABC"字样',
        initialCode: `# ========== 库存管理分析练习 ==========
# 任务：计算库存周转率、周转天数、滞销识别，按销售额降序做 ABC 分类

items = [
    {"name": "商品A", "cogs": 50000, "avg_inventory": 5000, "sales": 80000},
    {"name": "商品B", "cogs": 30000, "avg_inventory": 15000, "sales": 45000},
    {"name": "商品C", "cogs": 15000, "avg_inventory": 3000, "sales": 22000},
    {"name": "商品D", "cogs": 8000, "avg_inventory": 4000, "sales": 12000},
    {"name": "商品E", "cogs": 5000, "avg_inventory": 2000, "sales": 8000},
]

# 1) 计算周转率 / 周转天数
for it in items:
    it["turnover_rate"] = it["cogs"] / it["avg_inventory"]
    it["days_inventory"] = 365 / it["turnover_rate"]
    it["is_slow"] = it["days_inventory"] > 90

# 2) 按销售额降序
items_sorted = sorted(items, key=lambda x: x["sales"], reverse=True)
total_sales = sum(it["sales"] for it in items_sorted)

# 3) ABC 分类
running = 0
for it in items_sorted:
    running += it["sales"]
    pct = running / total_sales * 100
    it["abc"] = "A" if pct <= 80 else ("B" if pct <= 95 else "C")

print("=== 库存管理分析报告 ===")
print(f"{'商品':<6} {'销售额':>8} {'周转率':>8} {'周转天数':>9} {'ABC':>4} {'滞销':>4}")
for it in items_sorted:
    slow = "是" if it["is_slow"] else "否"
    print(f'{it["name"]:<6} \${it["sales"]:>8,} {it["turnover_rate"]:>8.2f} {it["days_inventory"]:>8.1f}天 {it["abc"]:>4} {slow:>4}')

slow_items = [it["name"] for it in items_sorted if it["is_slow"]]
print(f"\n建议优先清库存的商品: {', '.join(slow_items) if slow_items else '无'}")
`,
        expectedOutput: 'ABC',
        hint: "解题思路：用列表存储商品数据，计算周转率和周转天数，按销售额降序排序后累加占比做 ABC 分类，最后打印报告。"
      }
    ]
  },
  {
    id: 'customer-satisfaction',
    title: '客户满意度分析',
    description: '分析客户反馈数据，提升客户满意度和忠诚度',
    icon: MessageSquare,
    color: 'from-cyan-500 to-blue-500',
    path: '/project/customer-satisfaction',
    steps: [
      {
        number: 1,
        title: '数据收集与清洗',
        content: '收集客户满意度调查数据、评论数据、客服记录，处理缺失值。'
      },
      {
        number: 2,
        title: '满意度指标计算',
        content: '计算NPS（净推荐值）、CSAT（客户满意度）、CES（客户费力度）。'
      },
      {
        number: 3,
        title: '情感分析',
        content: '对客户评论进行情感分析，识别正面和负面反馈主题。'
      },
      {
        number: 4,
        title: '改进建议',
        content: '基于分析结果提出具体的改进措施，优先解决最影响满意度的问题。'
      }
    ],
    codeExamples: [
      {
        title: 'NPS计算',
        description: '计算净推荐值',
        code: `import pandas as pd

def calculate_nps(df: pd.DataFrame, rating_column: str = 'rating'):
    """
    计算净推荐值(NPS)
    
    参数:
        df: 包含客户评分的数据
        rating_column: 评分列名称
    """
    # 分类推荐者、被动者、贬损者
    df['category'] = pd.cut(
        df[rating_column],
        bins=[-1, 6, 8, 10],
        labels=['detractor', 'passive', 'promoter']
    )
    
    # 计算各类别比例
    category_counts = df['category'].value_counts(normalize=True) * 100
    
    # 计算NPS
    nps = category_counts.get('promoter', 0) - category_counts.get('detractor', 0)
    
    result = {
        'nps': nps,
        'promoter_percentage': category_counts.get('promoter', 0),
        'passive_percentage': category_counts.get('passive', 0),
        'detractor_percentage': category_counts.get('detractor', 0)
    }
    
    return result`
      },
      {
        title: '简单情感分析',
        description: '基于关键词的情感分析',
        code: `import pandas as pd

def simple_sentiment_analysis(df: pd.DataFrame, text_column: str):
    # 定义情感词典
    positive_words = ['good', 'great', 'excellent', 'love', 'happy', 'amazing', 
                      'wonderful', 'perfect', 'best', 'awesome']
    negative_words = ['bad', 'terrible', 'awful', 'hate', 'sad', 'disappointed',
                      'worst', 'poor', 'horrible', 'frustrating']
    
    # 计算情感分数
    def calculate_sentiment(text):
        text_lower = str(text).lower()
        positive_count = sum(1 for word in positive_words if word in text_lower)
        negative_count = sum(1 for word in negative_words if word in text_lower)
        
        if positive_count > negative_count:
            return 'positive'
        elif negative_count > positive_count:
            return 'negative'
        else:
            return 'neutral'
    
    df['sentiment'] = df[text_column].apply(calculate_sentiment)
    sentiment_dist = df['sentiment'].value_counts(normalize=True) * 100
    
    return df, sentiment_dist`
      }
    ],
    insights: [
      {
        title: '核心发现',
        content: 'NPS得分45，客服响应速度是最主要的负面反馈主题。'
      },
      {
        title: '业务建议',
        content: '优化客服响应流程，增加客服人员，建立常见问题自动回复系统。'
      }
    ],
    exercises: [
      {
        id: 1,
        title: 'NPS概念',
        description: '理解净推荐值的概念',
        difficulty: 'easy',
        type: 'concept',
        question: 'NPS分数范围是？',
        options: [
          '0-100',
          '-100到100',
          '0-10',
          '1-5'
        ],
        correctAnswer: 1,
        explanation: 'NPS范围是-100到100，由推荐者比例减去贬损者比例得出。'
      },
      {
        id: 2,
        title: 'Python代码：NPS计算',
        description: '编写代码计算NPS',
        difficulty: 'easy',
        type: 'code',
        question: '推荐者=60%，被动者=20%，贬损者=20%，NPS是？',
        options: [
          '20',
          '40',
          '60',
          '80'
        ],
        correctAnswer: 1,
        explanation: 'NPS = 推荐者% - 贬损者% = 60% - 20% = 40'
      },
      {
        id: 3,
        title: 'CSAT分析',
        description: '理解客户满意度',
        difficulty: 'medium',
        type: 'concept',
        question: 'CSAT分数通常是多少分制？',
        options: [
          '10分制',
          '5分制或10分制',
          '100分制',
          '只有合格/不合格'
        ],
        correctAnswer: 1,
        explanation: 'CSAT通常用5分或10分量表，要求用户对满意度打分。'
      },
      {
        id: 4,
        title: 'Python代码：CSAT计算',
        description: '计算CSAT',
        difficulty: 'medium',
        type: 'code',
        question: '满意度评分[4, 5, 3, 5, 4]的平均分是？',
        options: [
          '4.0',
          '4.2',
          '4.5',
          '3.8'
        ],
        correctAnswer: 1,
        explanation: '(4+5+3+5+4)/5 = 21/5 = 4.2'
      },
      {
        id: 5,
        title: '情感分析',
        description: '理解情感分析',
        difficulty: 'medium',
        type: 'concept',
        question: '情感分析主要用于分析什么？',
        options: [
          '用户购买金额',
          '用户评论的正负面态度',
          '用户年龄分布',
          '用户登录时间'
        ],
        correctAnswer: 1,
        explanation: '情感分析识别文本中的情感倾向，如正面、负面或中性。'
      },
      {
        id: 6,
        title: 'Python代码：情感分类',
        description: '简单的情感分析',
        difficulty: 'medium',
        type: 'code',
        question: '"这个产品很好用"情感应该是？',
        options: [
          '负面',
          '正面',
          '中性',
          '无法判断'
        ],
        correctAnswer: 1,
        explanation: '"很好用"是明显的正面评价。'
      },
      {
        id: 7,
        title: '关键词提取',
        description: '理解关键词分析',
        difficulty: 'hard',
        type: 'concept',
        question: '从评论中提取关键词的目的是？',
        options: [
          '统计用户数量',
          '识别用户最关注的产品特征',
          '计算消费金额',
          '分析购买时间'
        ],
        correctAnswer: 1,
        explanation: '关键词提取找出用户反复提及的内容，帮助识别产品优缺点。'
      },
      {
        id: 8,
        title: 'Python代码：词频统计',
        description: '统计关键词频率',
        difficulty: 'hard',
        type: 'code',
        question: '词频统计通常使用什么方法？',
        options: [
          '计算每个词出现次数',
          '计算每个数的总和',
          '找出最大和最小值',
          '排序后取前10个'
        ],
        correctAnswer: 0,
        explanation: '词频统计计算每个词在文本中出现的次数。'
      },
      {
        id: 9,
        title: '满意度影响因素',
        description: '理解满意度影响因素分析',
        difficulty: 'hard',
        type: 'concept',
        question: '影响客户满意度的主要因素包括？',
        options: [
          '仅价格',
          '产品质量、服务态度、交付速度等',
          '仅产品功能',
          '仅品牌知名度'
        ],
        correctAnswer: 1,
        explanation: '满意度是多维度的，包括产品质量、服务、价格、交付等多方面。'
      },
      {
        id: 10,
        title: '实战编程：完整满意度分析函数',
        description: '编写完整的客户满意度分析函数，包括NPS计算、CSAT分析和情感关键词统计',
        difficulty: 'hard',
        type: 'coding',
        question: '请在下面的编辑器中编写客户满意度分析代码。任务要求：\n1. 创建10个用户评分数据（0-10分）和对应的简短评价文本\n2. 计算NPS（净推荐值）：>=9推荐者，7-8被动者，<=6贬损者，NPS=推荐者%-贬损者%\n3. 计算CSAT满意率（rating>=4视为满意，按5分制映射）\n4. 统计评价中的正面关键词出现次数\n5. 打印完整满意度分析报告',
        options: [],
        correctAnswer: 0,
        explanation: '参考实现：\n1) reviews = [{"rating": 9, "text": "great product love it"}, ...]\n2) 分类：for r in reviews: 用 r["rating"] 判断分类并计数\n3) NPS = (promoters - detractors) / total * 100\n4) CSAT = 评分>=4的数量 / total * 100\n5) 关键词：positive_words = ["good", "great", "excellent", "love", "nice"]\n   用 for text in reviews: 用 text.lower() 匹配关键词\n6) 输出中包含"NPS"字样',
        initialCode: `# ========== 客户满意度分析练习 ==========
# 任务：计算 NPS、CSAT，并统计正面关键词频次

reviews = [
    {"rating": 9, "text": "great product love it excellent quality"},
    {"rating": 10, "text": "amazing service highly recommend"},
    {"rating": 8, "text": "good overall but slow delivery"},
    {"rating": 6, "text": "average product nothing special"},
    {"rating": 7, "text": "nice product works fine"},
    {"rating": 9, "text": "love it best purchase ever"},
    {"rating": 5, "text": "poor quality disappointed"},
    {"rating": 10, "text": "amazing highly recommend great service"},
    {"rating": 8, "text": "good value for money"},
    {"rating": 4, "text": "bad experience wont buy again"},
]

# NPS
promoters = sum(1 for r in reviews if r["rating"] >= 9)
detractors = sum(1 for r in reviews if r["rating"] <= 6)
nps = (promoters - detractors) / len(reviews) * 100

# CSAT (rating >= 7)
csat = sum(1 for r in reviews if r["rating"] >= 7) / len(reviews) * 100

# 正面关键词
positive_words = {"good", "great", "excellent", "love", "nice", "amazing", "recommend"}
keyword_count = {}
for r in reviews:
    for w in r["text"].lower().split():
        if w in positive_words:
            keyword_count[w] = keyword_count.get(w, 0) + 1

print("=== 客户满意度分析报告 ===")
print(f"样本数: {len(reviews)}")
print(f"推荐者 (>=9分): {promoters} 人")
print(f"贬损者 (<=6分): {detractors} 人")
print(f"NPS Score: {nps:.1f}")
print(f"CSAT (>=7分满意度): {csat:.1f}%")
print("\n--- 正面关键词统计 ---")
for w, cnt in sorted(keyword_count.items(), key=lambda x: -x[1]):
    print(f"{w}: {cnt} 次")
`,
        expectedOutput: 'NPS',
        hint: "解题思路：用列表存储评分+评论字典，用 sum 统计推荐者/贬损者计算 NPS，用评分>=7 计算 CSAT，最后打印报告。"
      }
    ]
  },
  {
    id: 'competitor-analysis',
    title: '竞品分析',
    description: '分析竞争对手的数据，制定竞争策略',
    icon: TrendingUp,
    color: 'from-teal-500 to-green-500',
    path: '/project/competitor-analysis',
    steps: [
      {
        number: 1,
        title: '数据收集',
        content: '收集竞品的产品信息、定价、市场份额、用户评价等数据。'
      },
      {
        number: 2,
        title: '竞争力评估',
        content: '对比分析自身与竞品在各维度的表现，识别优势和劣势。'
      },
      {
        number: 3,
        title: '市场定位分析',
        content: '分析市场定位，寻找差异化竞争机会。'
      },
      {
        number: 4,
        title: '战略建议',
        content: '基于分析结果制定竞争策略和市场进入策略。'
      }
    ],
    codeExamples: [
      {
        title: '竞品对比分析',
        description: '多维度竞品对比',
        code: `import pandas as pd

def competitor_comparison(competitor_data: pd.DataFrame):
    """
    竞品多维度对比分析
    
    参数:
        competitor_data: 包含竞品数据的DataFrame
    """
    # 设置自身为基准
    baseline = competitor_data[competitor_data['company'] == 'our_company']
    
    # 计算相对表现
    comparison = competitor_data.copy()
    metrics = ['price', 'market_share', 'customer_rating', 'features_count']
    
    for metric in metrics:
        baseline_value = baseline[metric].values[0]
        comparison[f'{metric}_vs_baseline'] = (comparison[metric] - baseline_value) / baseline_value * 100
    
    # 按市场份额排序
    comparison = comparison.sort_values('market_share', ascending=False)
    
    return comparison`
      },
      {
        title: 'SWOT分析框架',
        description: '结构化的SWOT分析',
        code: `class SWOTAnalyzer:
    def __init__(self):
        self.strengths = []
        self.weaknesses = []
        self.opportunities = []
        self.threats = []
    
    def analyze(self, company_data, competitor_data):
        # 优势分析
        self.strengths = [
            f"市场份额领先: {company_data['market_share']}%",
            f"客户评分高于平均: {company_data['customer_rating']}"
        ]
        
        # 劣势分析
        avg_price = competitor_data['price'].mean()
        if company_data['price'] > avg_price:
            self.weaknesses.append(f"价格高于竞品平均: {company_data['price']} vs {avg_price:.1f}")
        
        # 机会分析
        self.opportunities = [
            "新兴市场增长潜力大",
            "竞品服务评分较低存在机会"
        ]
        
        # 威胁分析
        top_competitor = competitor_data.sort_values('market_share', ascending=False).iloc[0]
        self.threats = [
            f"{top_competitor['company']}市场份额达{top_competitor['market_share']}%"
        ]
        
        return {
            'strengths': self.strengths,
            'weaknesses': self.weaknesses,
            'opportunities': self.opportunities,
            'threats': self.threats
        }`
      }
    ],
    insights: [
      {
        title: '核心发现',
        content: '我们在产品功能上领先竞品，但价格偏高，市场份额排名第二。'
      },
      {
        title: '业务建议',
        content: '保持功能优势，考虑推出性价比版本，加强品牌营销提升市场份额。'
      }
    ],
    exercises: [
      {
        id: 1,
        title: '市场份额计算',
        description: '理解市场份额',
        difficulty: 'easy',
        type: 'concept',
        question: '市场份额的计算公式是？',
        options: [
          '竞品销售额 / 总市场销售额 × 100%',
          '竞品销量 / 总市场销量 × 100%',
          '竞品利润 / 总市场利润 × 100%',
          '竞品成本 / 总市场成本 × 100%'
        ],
        correctAnswer: 0,
        explanation: '市场份额通常用销售额计算：某竞品销售额 / 市场总销售额 × 100%。'
      },
      {
        id: 2,
        title: 'Python代码：市场份额',
        description: '计算市场份额',
        difficulty: 'easy',
        type: 'code',
        question: 'A公司销售额=500万，市场总额=2000万，市场份额是？',
        options: [
          '10%',
          '15%',
          '20%',
          '25%'
        ],
        correctAnswer: 3,
        explanation: '市场份额 = 500/2000 × 100% = 25%'
      },
      {
        id: 3,
        title: 'SWOT分析',
        description: '理解SWOT分析框架',
        difficulty: 'medium',
        type: 'concept',
        question: 'SWOT分析中，W代表什么？',
        options: [
          '优势(Strengths)',
          '劣势(Weaknesses)',
          '机会(Opportunities)',
          '威胁(Threats)'
        ],
        correctAnswer: 1,
        explanation: 'W = Weaknesses（劣势），指企业内部相对竞争对手的不足之处。'
      },
      {
        id: 4,
        title: 'Python代码：竞争分析',
        description: '多维度竞争对比',
        difficulty: 'medium',
        type: 'code',
        question: '功能对比矩阵通常用于比较什么？',
        options: [
          '价格差异',
          '产品功能支持情况',
          '用户数量',
          '广告投入'
        ],
        correctAnswer: 1,
        explanation: '功能矩阵列出各竞品的功能支持情况，直观对比功能差异。'
      },
      {
        id: 5,
        title: '竞争定位',
        description: '理解竞争定位',
        difficulty: 'medium',
        type: 'concept',
        question: '竞争定位的主要维度包括？',
        options: [
          '价格和质量',
          '价格和市场定位',
          '只有价格',
          '只有质量'
        ],
        correctAnswer: 1,
        explanation: '定位图通常用两个关键维度（如价格 vs 质量）展示各竞品的市场位置。'
      },
      {
        id: 6,
        title: 'Python代码：定位图',
        description: '绘制竞争定位图',
        difficulty: 'medium',
        type: 'code',
        question: '定位图通常用什么类型的图表？',
        options: [
          '折线图',
          '饼图',
          '散点图',
          '柱状图'
        ],
        correctAnswer: 2,
        explanation: '散点图用两个轴表示两个维度，每个点代表一个竞品在市场上的位置。'
      },
      {
        id: 7,
        title: '竞争力评分',
        description: '理解综合竞争力评分',
        difficulty: 'hard',
        type: 'concept',
        question: '竞争力评分模型通常使用什么方法？',
        options: [
          '简单平均',
          '加权平均',
          '相乘',
          '取最大值'
        ],
        correctAnswer: 1,
        explanation: '根据各因素重要性设置权重，采用加权平均计算综合得分。'
      },
      {
        id: 8,
        title: 'Python代码：竞争力计算',
        description: '计算竞争力得分',
        difficulty: 'hard',
        type: 'code',
        question: '加权平均中，权重的作用是？',
        options: [
          '增加总分',
          '反映各因素相对重要性',
          '减少数据量',
          '消除误差'
        ],
        correctAnswer: 1,
        explanation: '权重反映各因素对综合评价的相对重要性，重要因素权重更大。'
      },
      {
        id: 9,
        title: '价格敏感度分析',
        description: '理解价格敏感度',
        difficulty: 'hard',
        type: 'concept',
        question: '价格敏感度分析的目的是？',
        options: [
          '找出最贵的产品',
          '确定最优定价策略',
          '分析生产成本',
          '计算物流成本'
        ],
        correctAnswer: 1,
        explanation: '通过分析不同价格对需求的影响，找出利润最大化的定价点。'
      },
      {
        id: 10,
        title: '实战编程：完整竞品分析函数',
        description: '编写完整的竞品分析函数，包括市场份额计算、竞争力评分和SWOT分析',
        difficulty: 'hard',
        type: 'coding',
        question: '请在下面的编辑器中编写竞品分析代码。任务要求：\n1. 创建4个竞品数据（公司名/销售额/价格评分/用户评分/功能评分，每项0-100）\n2. 计算各公司市场份额（%）\n3. 计算综合竞争力得分（市场份额×0.3 + 价格×0.2 + 评分×0.3 + 功能×0.2）\n4. 识别市场份额>20%的主要竞争对手\n5. 识别高于平均分的公司（SWOT中的优势方）\n6. 打印完整竞品分析报告',
        options: [],
        correctAnswer: 0,
        explanation: '参考实现：\n1) competitors = [{"name": "我们", "sales": 500000, "price": 80, "rating": 85, "features": 90}, ...]\n2) market_share = sales / total_sales × 100\n3) score = share×0.3 + price×0.2 + rating×0.3 + features×0.2\n4) main = [c for c in competitors if c["share"] > 20]\n5) strengths = [c for c in competitors if c["score"] > avg_score]\n6) 输出中包含"Market"或"Share"字样',
        initialCode: `# ========== 竞品分析练习 ==========
# 任务：计算市场份额、竞争力得分并识别优势对手

competitors = [
    {"name": "我们", "sales": 500000, "price_score": 80, "rating": 85, "features": 90},
    {"name": "竞品A", "sales": 380000, "price_score": 75, "rating": 78, "features": 82},
    {"name": "竞品B", "sales": 420000, "price_score": 88, "rating": 82, "features": 75},
    {"name": "竞品C", "sales": 250000, "price_score": 70, "rating": 72, "features": 85},
]

market_total = sum(c["sales"] for c in competitors)
for c in competitors:
    share = c["sales"] / market_total * 100
    c["share"] = share
    # 综合竞争力 = 份额*0.3 + 价格*0.2 + 用户评分*0.3 + 功能*0.2
    c["score"] = share * 0.3 + c["price_score"] * 0.2 + c["rating"] * 0.3 + c["features"] * 0.2

avg_score = sum(c["score"] for c in competitors) / len(competitors)

print("=== 竞品分析报告 ===")
print(f"{'公司':<8} {'销售额':>10} {'份额':>7} {'竞争力':>7} {'主要对手':>8} {'优势方':>6}")
for c in competitors:
    main = "是" if c["share"] > 20 else "否"
    strong = "是" if c["score"] > avg_score else "否"
    print(f'{c["name"]:<8} \${c["sales"]:>9,} {c["share"]:>6.1f}% {c["score"]:>6.1f} {main:>8} {strong:>6}')

strong_names = [c["name"] for c in competitors if c["score"] > avg_score]
print(f"\n平均竞争力得分: {avg_score:.1f}")
print(f"高于平均的玩家: {', '.join(strong_names)}")
`,
        expectedOutput: 'Market',
        hint: "解题思路：用列表存储竞品数据，计算市场份额和综合竞争力得分，找出主要对手和高于平均分的优势方后打印报告。"
      }
    ]
  },
  {
    id: 'revenue-forecasting',
    title: '收入预测分析',
    description: '建立收入预测模型，支持业务决策',
    icon: BarChart2,
    color: 'from-violet-500 to-purple-500',
    path: '/project/revenue-forecasting',
    steps: [
      {
        number: 1,
        title: '数据准备',
        content: '收集历史收入数据、市场数据、营销数据，建立预测数据集。'
      },
      {
        number: 2,
        title: '特征工程',
        content: '提取时间特征、趋势特征、季节性特征，构建预测特征。'
      },
      {
        number: 3,
        title: '模型训练',
        content: '选择合适的预测模型（ARIMA、Prophet、机器学习），训练并评估模型。'
      },
      {
        number: 4,
        title: '预测与可视化',
        content: '生成预测结果，可视化展示预测区间，提供业务决策支持。'
      }
    ],
    codeExamples: [
      {
        title: 'Prophet时间序列预测',
        description: '使用Facebook Prophet进行收入预测',
        code: `from prophet import Prophet
import pandas as pd

def prophet_forecast(df: pd.DataFrame, periods: int = 30):
    """
    使用Prophet进行时间序列预测
    
    参数:
        df: 包含ds(日期)和y(目标值)列的DataFrame
        periods: 预测期数
    """
    # 初始化模型
    model = Prophet(
        yearly_seasonality=True,
        weekly_seasonality=True,
        daily_seasonality=False
    )
    
    # 添加节假日
    model.add_country_holidays(country_name='CN')
    
    # 训练模型
    model.fit(df)
    
    # 创建预测框架
    future = model.make_future_dataframe(periods=periods, freq='D')
    
    # 预测
    forecast = model.predict(future)
    
    # 返回关键结果
    result = forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].tail(periods)
    
    return result, model`
      },
      {
        title: '特征重要性分析',
        description: '分析各特征对收入的影响',
        code: `import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split

def feature_importance_analysis(df: pd.DataFrame, target_column: str):
    """
    分析特征重要性
    
    参数:
        df: 包含特征和目标变量的DataFrame
        target_column: 目标变量列名
    """
    # 分离特征和目标
    X = df.drop(target_column, axis=1)
    y = df[target_column]
    
    # 划分训练集和测试集
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # 训练随机森林
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    
    # 获取特征重要性
    feature_importance = pd.DataFrame({
        'feature': X.columns,
        'importance': model.feature_importances_
    }).sort_values('importance', ascending=False)
    
    # 计算R²分数
    r2_score = model.score(X_test, y_test)
    
    return feature_importance, r2_score`
      }
    ],
    insights: [
      {
        title: '核心发现',
        content: '预测显示下季度收入将增长12%，营销投入和季节性是主要影响因素。'
      },
      {
        title: '业务建议',
        content: '增加营销预算，提前准备旺季库存，关注竞争对手动态。'
      }
    ],
    exercises: [
      {
        id: 1,
        title: '时间序列基础',
        description: '理解时间序列数据',
        difficulty: 'easy',
        type: 'concept',
        question: '时间序列数据的主要特点是什么？',
        options: [
          '数据之间相互独立',
          '按时间顺序排列，具有相关性',
          '只有数值型数据',
          '必须是日数据'
        ],
        correctAnswer: 1,
        explanation: '时间序列数据按时间顺序排列，相邻时点数据通常具有相关性，这是时序分析的基础。'
      },
      {
        id: 2,
        title: 'Python代码：数据探索',
        description: '探索时间序列数据',
        difficulty: 'easy',
        type: 'code',
        question: '查看数据框基本信息应该用什么方法？',
        options: [
          'df.head()',
          'df.info()',
          'df.describe()',
          'df.shape'
        ],
        correctAnswer: 1,
        explanation: 'df.info()显示数据类型、非空值数量等基本信息。describe()显示统计描述，head()显示前几行，shape显示维度。'
      },
      {
        id: 3,
        title: '趋势分析',
        description: '理解趋势分析方法',
        difficulty: 'medium',
        type: 'concept',
        question: '数据呈现上升趋势意味着什么？',
        options: [
          '数据围绕某个值波动',
          '数据随时间长期增加',
          '数据周期性变化',
          '数据呈下降趋势'
        ],
        correctAnswer: 1,
        explanation: '上升趋势表示数据随时间长期增长，是时间序列的主要成分之一。'
      },
      {
        id: 4,
        title: 'Python代码：趋势计算',
        description: '计算移动平均趋势',
        difficulty: 'medium',
        type: 'code',
        question: '计算5期移动平均的代码是？',
        options: [
          'df.rolling(5).mean()',
          'df.mean(5)',
          'df.sum(5)',
          'df.std(5)'
        ],
        correctAnswer: 0,
        explanation: 'rolling(5).mean()计算5期移动平均，消除短期波动，显示趋势。'
      },
      {
        id: 5,
        title: '季节性分析',
        description: '理解季节性成分',
        difficulty: 'medium',
        type: 'concept',
        question: '销售数据中11月通常出现高峰，这是什么现象？',
        options: [
          '趋势',
          '季节性',
          '周期性',
          '随机波动'
        ],
        correctAnswer: 1,
        explanation: '季节性是固定周期内的规律波动，如每年11月双十一销售高峰。'
      },
      {
        id: 6,
        title: 'Python代码：季节性提取',
        description: '提取季节性因素',
        difficulty: 'medium',
        type: 'code',
        question: '季节性分解通常将数据分解为哪几个成分？',
        options: [
          '趋势和随机',
          '趋势、季节和残差',
          '季节和残差',
          '趋势和季节'
        ],
        correctAnswer: 1,
        explanation: '经典季节性分解将数据分解为：趋势(Trend)、季节性(Seasonal)和残差(Residual)。'
      },
      {
        id: 7,
        title: 'ARIMA模型',
        description: '理解ARIMA模型',
        difficulty: 'hard',
        type: 'concept',
        question: 'ARIMA模型中的I代表什么？',
        options: [
          '自回归(Autoregression)',
          '差分(Integrated)',
          '移动平均(Moving Average)',
          '指数(Index)'
        ],
        correctAnswer: 1,
        explanation: 'I = Integrated（差分），通过对数据差分使非平稳序列变得平稳。'
      },
      {
        id: 8,
        title: 'Python代码：ARIMA应用',
        description: '应用ARIMA模型',
        difficulty: 'hard',
        type: 'code',
        question: 'ARIMA模型参数(p,d,q)中，d表示什么？',
        options: [
          '自回归项数',
          '差分阶数',
          '移动平均项数',
          '季节性参数'
        ],
        correctAnswer: 1,
        explanation: 'd = degree of differencing（差分阶数），使序列平稳需要进行的差分次数。'
      },
      {
        id: 9,
        title: '预测评估',
        description: '理解预测评估指标',
        difficulty: 'hard',
        type: 'concept',
        question: 'RMSE和MAE的主要区别是？',
        options: [
          'RMSE对大误差更敏感',
          'RMSE对大误差不敏感',
          '两者完全相同',
          'MAE对大误差更敏感'
        ],
        correctAnswer: 0,
        explanation: 'RMSE(均方根误差)对大误差平方惩罚更多，比MAE更敏感于异常值。'
      },
      {
        id: 10,
        title: '实战编程：完整销售预测函数',
        description: '编写完整的销售预测函数，包括移动平均预测、增长率预测和误差评估',
        difficulty: 'hard',
        type: 'coding',
        question: '请在下面的编辑器中编写收入预测分析代码。任务要求：\n1. 创建12个月的历史销售数据\n2. 计算3个月移动平均（MA3）作为下期预测\n3. 基于最近3个月平均增长率预测第13个月销售额\n4. 计算预测误差指标：MAE（平均绝对误差）和RMSE（均方根误差）\n5. 打印完整收入预测分析报告',
        options: [],
        correctAnswer: 0,
        explanation: '参考实现：\n1) sales = [10000, 12000, 11500, 13500, 14000, 15000, 14500, 16000, 17500, 17000, 18500, 20000]\n2) MA3 = (sales[i-2] + sales[i-1] + sales[i]) / 3，从第3个月开始\n3) 增长率 = (sales[i] - sales[i-1]) / sales[i-1] × 100\n4) MAE = mean(|预测 - 实际|)，RMSE = sqrt(mean((预测 - 实际)^2))\n5) 输出中包含"Forecast"或"MAE"/"RMSE"字样',
        initialCode: `# ========== 收入预测分析练习 ==========
# 任务：基于历史销售数据计算移动平均 (MA3) 与增长率，预测下一期销售额

months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
sales = [10000, 12000, 11500, 13500, 14000, 15000, 14500, 16000, 17500, 17000, 18500, 20000]

print("=== 历史销售数据 ===")
for m, s in zip(months, sales):
    print(f"{m}: \${s:,.0f}")

# 3 个月移动平均预测：预测 i = 平均(sales[i-3:i])
ma_predictions = [None, None]  # 前两个月无预测
errors = []
for i in range(2, len(sales)):
    ma = (sales[i - 2] + sales[i - 1] + sales[i]) / 3  # 当前 MA3
    if i + 1 < len(sales):
        pred_next = ma
        errors.append(pred_next - sales[i + 1])
        ma_predictions.append(pred_next)
    else:
        ma_predictions.append(ma)

print("\n--- 预测误差 (MA3 vs 实际下期) ---")
for i, pred in enumerate(ma_predictions):
    if pred is None:
        continue
    month_idx = i + 1  # 预测的是下期
    if month_idx < len(sales):
        print(f"预测 {months[month_idx]}: \${pred:,.0f} (实际 \${sales[month_idx]:,.0f}, 差 {pred - sales[month_idx]:+,.0f})")

# 增长率
recent_growths = [(sales[i] - sales[i - 1]) / sales[i - 1] for i in range(len(sales) - 3, len(sales))]
avg_growth = sum(recent_growths) / len(recent_growths)
pred_next_month_growth = sales[-1] * (1 + avg_growth)

# MAE / RMSE
mae = sum(abs(e) for e in errors) / len(errors)
rmse = (sum(e * e for e in errors) / len(errors)) ** 0.5

print(f"\n=== 预测评估指标 ===")
print(f"MAE: \${mae:,.2f}")
print(f"RMSE: \${rmse:,.2f}")
print(f"最近 3 月平均环比增长率: {avg_growth * 100:+.2f}%")
print(f"下一月增长法预测: \${pred_next_month_growth:,.0f}")
last_ma = (sales[-3] + sales[-2] + sales[-1]) / 3
print(f"下一月 MA3 预测: \${last_ma:,.0f}")
`,
        expectedOutput: 'Forecast',
        hint: "解题思路：用列表存储 12 个月销售额，计算 3 个月移动平均作为预测值，再计算 MAE 和 RMSE 并打印预测报告。"
      }
    ]
  }
]

export const coreMindsets = [
  {
    id: 1,
    title: '数据驱动决策',
    description: '基于数据和证据做出决策，而不是仅凭直觉或经验。',
    points: [
      '使用数据验证假设，而不是先入为主地认为某件事是正确的',
      '通过数据分析发现问题的根本原因，而不是仅仅处理表面症状',
      '根据数据结果调整策略和行动，不断优化决策过程',
      '将数据驱动的思维方式融入到组织文化中'
    ]
  },
  {
    id: 2,
    title: '问题分解与结构化思考',
    description: '将复杂问题分解为可管理的小问题，使用结构化的方法进行分析。',
    points: [
      '将复杂问题分解为多个子问题，逐个解决',
      '使用框架和模型来结构化分析过程',
      '建立清晰的分析流程和步骤',
      '确保分析的完整性和系统性'
    ]
  },
  {
    id: 3,
    title: '数据质量意识',
    description: '认识到数据质量对分析结果的重要性，重视数据清洗和预处理。',
    points: [
      '了解数据的来源、收集方法和局限性',
      '识别和处理数据中的缺失值、异常值和不一致性',
      '确保数据的准确性、完整性和一致性',
      '建立数据质量评估和监控机制'
    ]
  },
  {
    id: 4,
    title: '统计思维',
    description: '运用统计方法和概率思维来分析数据，理解不确定性。',
    points: [
      '理解统计概念如均值、中位数、标准差、相关性等',
      '认识到样本数据的局限性和抽样误差',
      '使用假设检验和置信区间来评估结果的可靠性',
      '避免常见的统计谬误，如混淆相关性和因果关系'
    ]
  },
  {
    id: 5,
    title: '结果沟通与可视化',
    description: '将分析结果以清晰、直观的方式传达给利益相关者。',
    points: [
      '根据受众的背景和需求调整沟通方式',
      '使用数据可视化工具创建有效的图表和图形',
      '突出关键发现和洞察，避免信息过载',
      '提供具体的行动建议，而不仅仅是数据展示'
    ]
  }
]

export const debates = [
  {
    id: 'python-vs-r',
    title: 'Python vs R',
    pros: [
      'Python是一种通用编程语言，生态系统更广泛',
      'Python在机器学习和深度学习方面有优势',
      'Python的语法更简洁，更容易学习',
      'Python在工业界的应用更广泛'
    ],
    cons: [
      'R专门为统计分析和数据可视化设计',
      'R有更丰富的统计包和函数',
      'R的ggplot2库在数据可视化方面更强大',
      'R在学术研究中更常用'
    ],
    conclusion: '两种语言都有各自的优势，许多数据分析师同时使用两种语言，根据具体任务选择合适的工具。'
  },
  {
    id: 'automation-vs-human',
    title: '自动化 vs 人工分析',
    pros: [
      '自动化可以处理大规模数据和重复性任务',
      '自动化提高效率，减少人为错误',
      '自动化可以24/7不间断运行',
      '自动化降低人力成本'
    ],
    cons: [
      '人工分析更擅长处理复杂和创造性的问题',
      '人工分析能理解业务上下文和隐含需求',
      '人工分析可以发现自动化遗漏的异常',
      '人工分析提供更深入的业务洞察'
    ],
    conclusion: '理想的做法是将自动化和人工分析结合起来，使用自动化处理常规任务，人工分析处理复杂和创造性的任务。'
  },
  {
    id: 'prediction-vs-interpretability',
    title: '预测 vs 可解释性',
    pros: [
      '复杂模型通常有更高的预测准确性',
      '深度学习能发现数据中的复杂模式',
      '集成方法能提供更稳健的预测',
      '高预测性能带来直接的业务价值'
    ],
    cons: [
      '简单模型更容易理解和解释',
      '可解释性有助于建立信任和合规性',
      '简单模型更容易调试和维护',
      '可解释性帮助发现数据中的问题'
    ],
    conclusion: '模型的选择应该根据具体的应用场景和需求来决定，在需要高可解释性的领域使用简单模型，在需要高预测准确性的领域使用复杂模型。'
  }
]
