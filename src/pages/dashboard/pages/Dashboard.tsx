import React, { useEffect, useState } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { Post, Comment, Product, DashboardStats } from '../../../types/index';
import { api, productService } from '../../../services/api';
import { 
  Package, MessageSquare, FileText, DollarSign
} from 'lucide-react';
import Sidebar from '../../../layouts/Sidebar';

// StatCard Props Interface
interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

const Dashboard: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [stats, setStats] = useState<DashboardStats>({
    totalPosts: 0,
    totalProducts: 0,
    totalComments: 0,
    totalRevenue: 0
  });

  // Colors for charts
  const COLORS = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD',
    '#FF9F1C', '#2EC4B6', '#E71D36', '#011627', '#7209B7',
    '#4361EE', '#4CC9F0', '#F72585', '#3A0CA3', '#4895EF'
  ];

  const generateMonthlyRevenue = (products: Product[]) => {
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    return months.map((month, index) => {
      const baseRevenue = products.reduce((acc, product) => 
        acc + (product.price * product.stock), 0) / 12;
      
      const variation = 0.3;
      const randomFactor = 1 + (Math.random() * variation * 2 - variation);
      const seasonalFactor = 1 + Math.sin((index / 11) * Math.PI) * 0.2;

      return {
        month,
        revenue: Math.round(baseRevenue * randomFactor * seasonalFactor)
      };
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [postsData, commentsData, productsData] = await Promise.all([
          api.getPosts(10),
          api.getComments(10),
          productService.fetchProducts(1, 100)
        ]);

        setPosts(postsData.posts);
        setComments(commentsData.comments);
        setProducts(productsData.products);

        // Generate monthly revenue data
        const monthlyRevenue = generateMonthlyRevenue(productsData.products);
        setRevenueData(monthlyRevenue);

        setStats({
          totalPosts: postsData.total,
          totalProducts: productsData.total,
          totalComments: commentsData.total,
          totalRevenue: productsData.products.reduce((acc: number, product: Product) => 
            acc + product.price * product.stock, 0)
        });

      } catch (err) {
        setError('Failed to fetch dashboard data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => (
    <div className="bg-white  shadow p-6 flex items-center space-x-4">
      <div className={`p-3 rounded-full ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <h3 className="text-2xl font-bold">{value.toLocaleString()}</h3>
      </div>
    </div>
  );

  // Prepare data for category distribution pie chart
  const categoryData = products.reduce((acc: any[], product: Product) => {
    const existingCategory = acc.find(item => item.name === product.category);
    if (existingCategory) {
      existingCategory.value += 1;
    } else {
      acc.push({ name: product.category, value: 1 });
    }
    return acc;
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-red-500">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-6 bg-gray-50">
          <h1 className="text-3xl font-bold mb-8 ml-10 text-purple-500">Dashboard</h1>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Posts"
              value={stats.totalPosts}
              icon={<FileText className="text-blue-500" />}
              color="bg-blue-100"
            />
            <StatCard
              title="Total Products"
              value={stats.totalProducts}
              icon={<Package className="text-green-500" />}
              color="bg-green-100"
            />
            <StatCard
              title="Total Comments"
              value={stats.totalComments}
              icon={<MessageSquare className="text-yellow-500" />}
              color="bg-yellow-100"
            />
            <StatCard
              title="Total Revenue"
              value={stats.totalRevenue}
              icon={<DollarSign className="text-purple-500" />}
              color="bg-purple-100"
            />
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Monthly Revenue Line Chart */}
            <div className="bg-white p-6  shadow">
              <h2 className="text-xl font-semibold mb-4">Monthly Revenue Trend</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="month" 
                    label={{ value: 'Month', position: 'bottom' }}
                  />
                  <YAxis 
                    label={{ 
                      value: 'Revenue ($)', 
                      angle: -90, 
                      position: 'insideLeft' 
                    }}
                  />
                  <Tooltip 
                    formatter={(value: any) => [`$${value.toLocaleString()}`, 'Revenue']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#8884d8" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Category Distribution Pie Chart */}
            <div className="bg-white p-6  shadow">
              <h2 className="text-xl font-semibold mb-4">Product Categories Distribution</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Lists Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Posts */}
            <div className="bg-white p-6  shadow">
              <h2 className="text-xl font-semibold mb-4">Recent Posts</h2>
              <div className="space-y-4">
                {posts.slice(0, 5).map((post) => (
                  <div key={post.id} className="border-b pb-4">
                    <h3 className="font-medium">{post.title}</h3>
                    <p className="text-sm text-gray-500 truncate">{post.body}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Comments */}
            <div className="bg-white p-6  shadow">
              <h2 className="text-xl font-semibold mb-4">Recent Comments</h2>
              <div className="space-y-4">
                {comments.slice(0, 5).map((comment) => (
                  <div key={comment.id} className="border-b pb-4">
                    <p className="text-sm text-gray-500">{comment.body}</p>
                    <p className="text-xs text-gray-400 mt-1">by {comment.user.username}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Products */}
            <div className="bg-white p-6  shadow">
              <h2 className="text-xl font-semibold mb-4">Recent Products</h2>
              <div className="space-y-4">
                {products.slice(0, 5).map((product) => (
                  <div key={product.id} className="border-b pb-4 flex items-center space-x-4">
                    <img 
                      src={product.thumbnail} 
                      alt={product.title} 
                      className="w-12 h-12  object-cover"
                    />
                    <div>
                      <h3 className="font-medium">{product.title}</h3>
                      <p className="text-sm text-gray-500">${product.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
