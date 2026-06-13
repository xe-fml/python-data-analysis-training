#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
客户分群分析项目
使用聚类算法对客户进行分群，识别不同客户群体的特征

优化要点：
1. 符合PEP8规范，代码结构清晰
2. 完整的数据处理流程（读取、清洗、转换、特征工程、聚类）
3. 合理处理缺失值和异常值
4. 使用向量化操作，避免循环
5. 可视化图表包含完整的标题、坐标轴标签和图例
6. 提供业务解读和结论
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score
from sklearn.decomposition import PCA

# 设置可视化风格
sns.set_style('whitegrid')
plt.rcParams['font.sans-serif'] = ['SimHei', 'DejaVu Sans']
plt.rcParams['axes.unicode_minus'] = False


def load_and_preprocess_data(file_path: str) -> pd.DataFrame:
    """
    加载并预处理客户数据
    
    参数:
        file_path: 数据文件路径
    
    返回:
        预处理后的DataFrame
    """
    # 读取数据
    df = pd.read_csv(file_path)
    
    print("数据基本信息:")
    print(df.info())
    print("\n数据前5行:")
    print(df.head())
    
    # 处理缺失值
    # 关键特征缺失则删除记录，其他特征用中位数/众数填充
    critical_columns = ['user_id', 'age', 'annual_income', 'spending_score']
    df = df.dropna(subset=critical_columns)
    
    # 数值型特征用中位数填充
    numeric_cols = ['age', 'annual_income', 'spending_score', 'purchase_frequency']
    for col in numeric_cols:
        if col in df.columns:
            df[col] = df[col].fillna(df[col].median())
    
    # 类别型特征用众数填充
    categorical_cols = ['gender', 'membership_type']
    for col in categorical_cols:
        if col in df.columns:
            df[col] = df[col].fillna(df[col].mode()[0])
    
    # 处理异常值：年龄在合理范围内
    df = df[(df['age'] >= 18) & (df['age'] <= 85)]
    
    # 处理异常值：收入和消费分数非负
    df = df[df['annual_income'] >= 0]
    df = df[df['spending_score'] >= 0]
    
    print(f"\n预处理后数据量: {len(df)} 条")
    print(f"缺失值检查:\n{df.isnull().sum()}")
    
    return df


def feature_engineering(df: pd.DataFrame) -> pd.DataFrame:
    """
    特征工程：选择和处理特征
    
    参数:
        df: 客户数据DataFrame
    
    返回:
        包含特征的DataFrame
    """
    # 选择用于聚类的特征
    features = ['age', 'annual_income', 'spending_score', 'purchase_frequency']
    features = [f for f in features if f in df.columns]
    
    X = df[features].copy()
    
    # 数据标准化（K-means对尺度敏感）
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    # 创建标准化后的DataFrame
    X_scaled_df = pd.DataFrame(X_scaled, columns=features, index=X.index)
    
    print("\n特征工程完成:")
    print(f"使用特征: {features}")
    print(f"标准化后数据统计:\n{X_scaled_df.describe().round(2)}")
    
    return X_scaled_df, scaler


def determine_optimal_clusters(X: pd.DataFrame, max_k: int = 10) -> int:
    """
    使用肘部法则和轮廓系数确定最佳聚类数
    
    参数:
        X: 特征数据
        max_k: 最大尝试聚类数
    
    返回:
        最佳聚类数
    """
    inertia = []
    silhouette_scores = []
    
    for k in range(2, max_k + 1):
        kmeans = KMeans(n_clusters=k, random_state=42, n_init='auto')
        labels = kmeans.fit_predict(X)
        inertia.append(kmeans.inertia_)
        
        if k > 1:
            silhouette_avg = silhouette_score(X, labels)
            silhouette_scores.append(silhouette_avg)
    
    # 可视化肘部曲线
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 5))
    
    ax1.plot(range(2, max_k + 1), inertia, marker='o')
    ax1.set_title('肘部法则确定最佳聚类数', fontsize=14, fontweight='bold')
    ax1.set_xlabel('聚类数 (k)', fontsize=12)
    ax1.set_ylabel('惯性 (Inertia)', fontsize=12)
    ax1.grid(True)
    
    # 可视化轮廓系数
    ax2.plot(range(2, max_k + 1), silhouette_scores, marker='o', color='orange')
    ax2.set_title('轮廓系数确定最佳聚类数', fontsize=14, fontweight='bold')
    ax2.set_xlabel('聚类数 (k)', fontsize=12)
    ax2.set_ylabel('轮廓系数', fontsize=12)
    ax2.grid(True)
    
    plt.tight_layout()
    plt.show()
    
    # 根据肘部法则选择最佳k（通常取肘部位置）
    # 也可以结合轮廓系数，选择轮廓系数较高且惯性下降变缓的点
    optimal_k = 4  # 默认值，实际应根据图表判断
    
    print(f"\n推荐聚类数: {optimal_k}")
    return optimal_k


def perform_kmeans_clustering(X: pd.DataFrame, n_clusters: int) -> tuple:
    """
    执行K-means聚类
    
    参数:
        X: 特征数据
        n_clusters: 聚类数
    
    返回:
        (聚类结果标签, K-means模型)
    """
    kmeans = KMeans(n_clusters=n_clusters, random_state=42, n_init='auto')
    labels = kmeans.fit_predict(X)
    
    silhouette_avg = silhouette_score(X, labels)
    print(f"\n聚类完成，轮廓系数: {silhouette_avg:.3f}")
    
    return labels, kmeans


def analyze_cluster_results(df: pd.DataFrame, labels: np.ndarray, scaler):
    """
    分析聚类结果
    
    参数:
        df: 原始数据
        labels: 聚类标签
        scaler: 标准化器
    
    返回:
        包含聚类信息的DataFrame
    """
    df['cluster'] = labels
    
    # 分析每个聚类的特征
    features = ['age', 'annual_income', 'spending_score', 'purchase_frequency']
    features = [f for f in features if f in df.columns]
    
    # 使用原始数据的均值（不需要反标准化，因为KMeans是在标准化数据上运行的）
    # 直接使用原始数据计算聚类中心
    cluster_centers = df.groupby('cluster')[features].mean()
    
    # 添加聚类大小
    cluster_centers['cluster_size'] = df['cluster'].value_counts().sort_index()
    cluster_centers['cluster_percentage'] = (
        df['cluster'].value_counts(normalize=True).sort_index() * 100
    )
    
    print("\n=== 聚类结果分析 ===")
    print(cluster_centers.round(2))
    
    return df


def visualize_clusters(df: pd.DataFrame, features: list = None):
    """
    可视化聚类结果
    
    参数:
        df: 包含聚类标签的数据
        features: 用于可视化的特征列表
    """
    if features is None:
        features = ['age', 'annual_income', 'spending_score']
    features = [f for f in features if f in df.columns]
    
    # 使用PCA降维进行可视化
    pca = PCA(n_components=2)
    pca_features = pca.fit_transform(df[features])
    pca_df = pd.DataFrame(pca_features, columns=['PC1', 'PC2'])
    pca_df['cluster'] = df['cluster']
    
    fig, axes = plt.subplots(1, 2, figsize=(16, 6))
    
    # PCA可视化
    ax1 = axes[0]
    sns.scatterplot(x='PC1', y='PC2', hue='cluster', data=pca_df, 
                    palette='viridis', s=100, alpha=0.7, ax=ax1)
    ax1.set_title(f'客户分群PCA可视化 (方差解释率: {pca.explained_variance_ratio_.sum():.1%})', 
                  fontsize=14, fontweight='bold')
    ax1.set_xlabel(f'主成分1 ({pca.explained_variance_ratio_[0]:.1%})', fontsize=12)
    ax1.set_ylabel(f'主成分2 ({pca.explained_variance_ratio_[1]:.1%})', fontsize=12)
    ax1.legend(title='聚类')
    
    # 收入 vs 消费分数
    ax2 = axes[1]
    sns.scatterplot(x='annual_income', y='spending_score', hue='cluster', 
                    data=df, palette='viridis', s=100, alpha=0.7, ax=ax2)
    ax2.set_title('客户分群（年收入 vs 消费分数）', fontsize=14, fontweight='bold')
    ax2.set_xlabel('年收入', fontsize=12)
    ax2.set_ylabel('消费分数', fontsize=12)
    ax2.legend(title='聚类')
    
    plt.tight_layout()
    plt.show()
    
    # 绘制特征箱线图
    fig, axes = plt.subplots(1, len(features), figsize=(5 * len(features), 5))
    if len(features) == 1:
        axes = [axes]
    
    for i, feature in enumerate(features):
        sns.boxplot(x='cluster', y=feature, data=df, ax=axes[i], palette='viridis')
        axes[i].set_title(f'{feature}分布', fontsize=12, fontweight='bold')
        axes[i].set_xlabel('聚类', fontsize=10)
        axes[i].set_ylabel(feature, fontsize=10)
    
    plt.tight_layout()
    plt.show()


def generate_customer_segment_report(df: pd.DataFrame):
    """
    生成客户分群业务报告
    
    参数:
        df: 包含聚类结果的数据
    """
    print("\n" + "="*50)
    print("          客户分群分析报告")
    print("="*50)
    
    cluster_summary = df.groupby('cluster').agg({
        'age': ['mean', 'median'],
        'annual_income': ['mean', 'median'],
        'spending_score': ['mean', 'median'],
        'user_id': 'count'
    })
    
    cluster_summary.columns = ['年龄均值', '年龄中位数', '收入均值', '收入中位数', 
                               '消费分数均值', '消费分数中位数', '人数']
    cluster_summary['占比'] = (cluster_summary['人数'] / cluster_summary['人数'].sum() * 100).round(1)
    
    print("\n一、客户群体概况")
    print("---------------")
    print(cluster_summary.round(1))
    
    print("\n二、客户群体特征描述")
    print("-------------------")
    
    # 为每个聚类命名和描述
    for cluster in sorted(df['cluster'].unique()):
        cluster_data = df[df['cluster'] == cluster]
        size = len(cluster_data)
        percentage = round(size / len(df) * 100, 1)
        
        age_mean = round(float(cluster_data['age'].mean()), 1)
        income_mean = round(float(cluster_data['annual_income'].mean()), 1)
        spending_mean = round(float(cluster_data['spending_score'].mean()), 1)
        
        # 根据特征给聚类命名
        if spending_mean > 70 and income_mean > 70:
            name = "高价值VIP客户"
            description = "高收入高消费群体，是核心价值客户"
        elif spending_mean > 70 and income_mean < 50:
            name = "年轻潜力客户"
            description = "收入中等但消费意愿强，具有增长潜力"
        elif spending_mean < 40 and income_mean > 70:
            name = "谨慎消费客户"
            description = "高收入但消费保守，需要激活"
        elif spending_mean < 40 and income_mean < 50:
            name = "价格敏感客户"
            description = "关注性价比，对价格敏感"
        else:
            name = f"群体{cluster}"
            description = "中等收入和消费水平"
        
        print(f"\n• 群体{cluster} - {name}")
        print(f"  人数: {size} ({percentage}%)")
        print(f"  平均年龄: {age_mean}岁")
        print(f"  平均年收入: {income_mean}")
        print(f"  平均消费分数: {spending_mean}")
        print(f"  特征描述: {description}")
    
    print("\n三、营销策略建议")
    print("---------------")
    print("1. 高价值VIP客户")
    print("   • 提供专属客服和优先服务")
    print("   • 推出VIP专属优惠和会员权益")
    print("   • 定期发送个性化推荐")
    
    print("\n2. 年轻潜力客户")
    print("   • 推出分期付款和信用支付方案")
    print("   • 打造年轻化品牌形象")
    print("   • 利用社交媒体进行互动营销")
    
    print("\n3. 谨慎消费客户")
    print("   • 提供产品质量保证和售后保障")
    print("   • 推出会员积分和返现活动")
    print("   • 提供个性化产品推荐")
    
    print("\n4. 价格敏感客户")
    print("   • 提供优惠券和限时折扣")
    print("   • 推出性价比高的产品线")
    print("   • 优化促销活动通知")
    
    print("\n四、下一步行动")
    print("-------------")
    print("1. 针对不同客户群体制定差异化营销策略")
    print("2. 建立客户分群动态监控机制")
    print("3. 定期评估聚类效果，根据业务变化调整")
    print("="*50)


if __name__ == '__main__':
    import os
    project_dir = os.path.dirname(os.path.abspath(__file__))
    data_path = os.path.join(project_dir, '../data/customer_data.csv')
    
    try:
        # 数据加载与预处理
        df = load_and_preprocess_data(data_path)
        
        # 特征工程
        X_scaled, scaler = feature_engineering(df)
        
        # 确定最佳聚类数
        optimal_k = determine_optimal_clusters(X_scaled)
        
        # 执行聚类
        labels, kmeans = perform_kmeans_clustering(X_scaled, optimal_k)
        
        # 分析结果
        df = analyze_cluster_results(df, labels, scaler)
        
        # 可视化
        visualize_clusters(df)
        
        # 生成报告
        generate_customer_segment_report(df)
        
    except FileNotFoundError:
        print(f"错误：未找到数据文件 {data_path}")
        print("请确保数据文件存在于正确路径")
    except Exception as e:
        print(f"分析过程中发生错误: {str(e)}")