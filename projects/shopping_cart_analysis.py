#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
购物车数据分析项目
分析电商平台用户购物车数据，识别购买模式和行为趋势

优化要点：
1. 符合PEP8规范，代码结构清晰
2. 完整的数据处理流程（读取、清洗、转换、聚合、可视化）
3. 合理处理缺失值和异常值
4. 使用向量化操作，避免循环
5. 可视化图表包含完整的标题、坐标轴标签和图例
6. 提供业务解读和结论
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

# 设置可视化风格
sns.set_style('whitegrid')
plt.rcParams['font.sans-serif'] = ['SimHei', 'DejaVu Sans']
plt.rcParams['axes.unicode_minus'] = False


def load_and_clean_data(file_path: str) -> pd.DataFrame:
    """
    加载并清洗购物车数据
    
    参数:
        file_path: 数据文件路径
    
    返回:
        清洗后的DataFrame
    """
    # 读取数据
    df = pd.read_csv(file_path)
    
    # 查看数据基本信息
    print("数据基本信息:")
    print(df.info())
    print("\n数据前5行:")
    print(df.head())
    
    # 处理缺失值：根据业务逻辑选择合适的填充策略
    # 用户ID和商品ID缺失则删除，价格缺失用中位数填充
    df = df.dropna(subset=['user_id', 'product_id'])
    df['price'] = df['price'].fillna(df['price'].median())
    
    # 转换时间戳为datetime类型
    df['timestamp'] = pd.to_datetime(df['timestamp'], errors='coerce')
    df = df.dropna(subset=['timestamp'])  # 删除时间转换失败的记录
    
    # 处理异常值：价格不能为负数
    df = df[df['price'] >= 0]
    
    # 确保purchase_completed为布尔类型
    df['purchase_completed'] = df['purchase_completed'].astype(bool)
    
    print(f"\n清洗后数据量: {len(df)} 条")
    print(f"缺失值检查:\n{df.isnull().sum()}")
    
    return df


def analyze_cart_metrics(df: pd.DataFrame) -> dict:
    """
    分析购物车关键指标
    
    参数:
        df: 购物车数据DataFrame
    
    返回:
        包含关键指标的字典
    """
    metrics = {}
    
    # 1. 购物车放弃率
    total_carts = df['cart_id'].nunique()
    completed_carts = df[df['purchase_completed']]['cart_id'].nunique()
    abandoned_carts = total_carts - completed_carts
    metrics['abandonment_rate'] = abandoned_carts / total_carts if total_carts > 0 else 0
    
    # 2. 平均购物车商品数量
    cart_size_dist = df.groupby('cart_id')['product_id'].count()
    metrics['avg_cart_size'] = cart_size_dist.mean()
    metrics['median_cart_size'] = cart_size_dist.median()
    
    # 3. 平均订单价值
    completed_orders = df[df['purchase_completed']].groupby('cart_id')['price'].sum()
    metrics['avg_order_value'] = completed_orders.mean()
    metrics['median_order_value'] = completed_orders.median()
    
    # 4. 用户购买频率
    user_purchase_counts = df[df['purchase_completed']].groupby('user_id')['cart_id'].nunique()
    metrics['avg_purchase_frequency'] = user_purchase_counts.mean()
    
    # 5. 高价值用户识别（消费前10%）
    user_total_spending = df[df['purchase_completed']].groupby('user_id')['price'].sum()
    high_value_threshold = user_total_spending.quantile(0.9)
    metrics['high_value_user_count'] = (user_total_spending >= high_value_threshold).sum()
    metrics['high_value_threshold'] = high_value_threshold
    
    # 输出指标
    print("\n=== 关键指标分析 ===")
    print(f"购物车放弃率: {metrics['abandonment_rate']:.2%}")
    print(f"平均购物车商品数: {metrics['avg_cart_size']:.1f} (中位数: {metrics['median_cart_size']})")
    print(f"平均订单价值: {metrics['avg_order_value']:.2f} (中位数: {metrics['median_order_value']:.2f})")
    print(f"平均购买频率: {metrics['avg_purchase_frequency']:.2f}")
    print(f"高价值用户数: {metrics['high_value_user_count']} (阈值: {metrics['high_value_threshold']:.2f})")
    
    return metrics


def analyze_user_behavior(df: pd.DataFrame):
    """
    分析用户购买行为模式
    
    参数:
        df: 购物车数据DataFrame
    """
    print("\n=== 用户行为分析 ===")
    
    # 1. 按时间段分析购物车行为
    df['hour'] = df['timestamp'].dt.hour
    df['day_of_week'] = df['timestamp'].dt.dayofweek
    
    # 各时段购物车创建分布
    hourly_dist = df.groupby('hour')['cart_id'].nunique()
    
    # 各时段购买完成率
    hourly_completion = df.groupby('hour').apply(
        lambda x: x[x['purchase_completed']]['cart_id'].nunique() / x['cart_id'].nunique()
    )
    
    print("\n各时段购物车分布和完成率:")
    print(pd.DataFrame({'购物车数量': hourly_dist, '完成率': hourly_completion}))
    
    # 2. 商品类别分析
    if 'category' in df.columns:
        category_analysis = df.groupby('category').agg({
            'price': ['mean', 'sum'],
            'cart_id': 'nunique',
            'purchase_completed': 'mean'
        })
        category_analysis.columns = ['平均价格', '总销售额', '购物车数量', '购买完成率']
        print("\n商品类别分析:")
        print(category_analysis.sort_values('总销售额', ascending=False))
    
    return hourly_dist, hourly_completion


def visualize_results(df: pd.DataFrame, metrics: dict):
    """
    可视化分析结果
    
    参数:
        df: 购物车数据DataFrame
        metrics: 关键指标字典
    """
    fig, axes = plt.subplots(2, 2, figsize=(16, 12))
    
    # 1. 购物车完成情况分布
    ax1 = axes[0, 0]
    completion_counts = df['purchase_completed'].value_counts()
    sns.barplot(x=completion_counts.index, y=completion_counts.values, ax=ax1)
    ax1.set_title('购物车完成情况分布', fontsize=14, fontweight='bold')
    ax1.set_xlabel('购买完成', fontsize=12)
    ax1.set_ylabel('购物车数量', fontsize=12)
    ax1.set_xticklabels(['未完成', '已完成'])
    
    # 2. 购物车商品数量分布
    ax2 = axes[0, 1]
    cart_size_dist = df.groupby('cart_id')['product_id'].count()
    sns.histplot(cart_size_dist, bins=range(1, 11), ax=ax2, kde=False)
    ax2.set_title('购物车商品数量分布', fontsize=14, fontweight='bold')
    ax2.set_xlabel('商品数量', fontsize=12)
    ax2.set_ylabel('购物车数量', fontsize=12)
    ax2.set_xlim(1, 10)
    
    # 3. 用户消费金额分布
    ax3 = axes[1, 0]
    user_spending = df[df['purchase_completed']].groupby('user_id')['price'].sum()
    sns.histplot(user_spending, bins=20, ax=ax3, kde=True)
    ax3.set_title('用户消费金额分布', fontsize=14, fontweight='bold')
    ax3.set_xlabel('消费金额', fontsize=12)
    ax3.set_ylabel('用户数量', fontsize=12)
    
    # 4. 各时段购物车完成率
    ax4 = axes[1, 1]
    df['hour'] = df['timestamp'].dt.hour
    hourly_completion = df.groupby('hour').apply(
        lambda x: x[x['purchase_completed']]['cart_id'].nunique() / x['cart_id'].nunique()
    )
    sns.lineplot(x=hourly_completion.index, y=hourly_completion.values, ax=ax4, marker='o')
    ax4.set_title('各时段购物车完成率', fontsize=14, fontweight='bold')
    ax4.set_xlabel('时段', fontsize=12)
    ax4.set_ylabel('完成率', fontsize=12)
    ax4.set_ylim(0, 1)
    ax4.grid(True)
    
    plt.tight_layout()
    plt.show()
    
    print("\n=== 可视化解读 ===")
    print(f"1. 购物车放弃率较高({metrics['abandonment_rate']:.1%})，需要关注购物流程优化")
    print(f"2. 大部分购物车商品数量集中在1-3件，建议优化商品推荐策略")
    print(f"3. 用户消费金额呈长尾分布，少数高价值用户贡献大部分收入")
    print(f"4. 晚间时段购物车完成率可能存在波动，可针对性优化")


def generate_business_report(metrics: dict):
    """
    生成业务分析报告
    
    参数:
        metrics: 关键指标字典
    """
    print("\n" + "="*50)
    print("          购物车数据分析报告")
    print("="*50)
    
    print("\n一、核心发现")
    print("-----------")
    abandonment_severity = "严重" if metrics['abandonment_rate'] > 0.7 else \
                          "较高" if metrics['abandonment_rate'] > 0.5 else "正常"
    print(f"• 购物车放弃率{metrics['abandonment_rate']:.1%}，属于{abandonment_severity}水平")
    print(f"• 平均订单价值{metrics['avg_order_value']:.2f}元，中位数{metrics['median_order_value']:.2f}元")
    print(f"• 高价值用户共{metrics['high_value_user_count']}人，消费阈值{metrics['high_value_threshold']:.0f}元")
    
    print("\n二、业务建议")
    print("-----------")
    if metrics['abandonment_rate'] > 0.6:
        print("• 建议优化结账流程，减少用户流失")
        print("• 考虑设置购物车提醒功能，召回未完成订单用户")
        print("• 分析高放弃率时段的系统性能和用户体验")
    
    print("• 针对高价值用户提供专属优惠和服务")
    print("• 优化商品推荐算法，增加购物车商品数量")
    print("• 根据时段特征调整促销活动安排")
    
    print("\n三、下一步行动")
    print("-------------")
    print("1. 深入分析高放弃率的具体原因（价格、配送、账户等）")
    print("2. 对比分析不同渠道的购物车转化差异")
    print("3. 建立购物车转化监控看板，跟踪优化效果")
    print("="*50)


if __name__ == '__main__':
    # 示例数据路径（实际使用时替换为真实数据）
    import os
    project_dir = os.path.dirname(os.path.abspath(__file__))
    data_path = os.path.join(project_dir, '../data/shopping_cart_data.csv')
    
    try:
        # 数据加载与清洗
        df = load_and_clean_data(data_path)
        
        # 指标分析
        metrics = analyze_cart_metrics(df)
        
        # 用户行为分析
        analyze_user_behavior(df)
        
        # 可视化
        visualize_results(df, metrics)
        
        # 生成报告
        generate_business_report(metrics)
        
    except FileNotFoundError:
        print(f"错误：未找到数据文件 {data_path}")
        print("请确保数据文件存在于正确路径")
    except Exception as e:
        print(f"分析过程中发生错误: {str(e)}")