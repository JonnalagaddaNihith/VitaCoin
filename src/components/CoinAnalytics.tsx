"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { DailyStats } from '@/lib/types';
import { getDailyStats, getUserData } from '@/lib/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Coins, Trophy, AlertTriangle } from 'lucide-react';

export function CoinAnalytics() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DailyStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;
      
      try {
        // Get user data to access registration date
        const userData = await getUserData(user.uid);
        if (!userData) return;
        
        // Get registration date or default to now
        const registrationDate = userData.createdAt?.toDate() || new Date();
        
        // Create a new date object for the start date
        const startDate = new Date(registrationDate);
        // Set to start of day in local timezone
        startDate.setUTCHours(0, 0, 0, 0);
        // Adjust for timezone offset to ensure we get the correct local date
        const timezoneOffset = startDate.getTimezoneOffset() * 60000;
        startDate.setTime(startDate.getTime() - timezoneOffset);
        
        const statsData = await getDailyStats(user.uid, startDate);
        setStats(statsData);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  if (loading) {
    return <div className="flex justify-center p-8">Loading analytics...</div>;
  }

  const totalCoinsEarned = stats.reduce((sum, day) => sum + day.coinsEarned, 0);
  const totalQuizzesTaken = stats.reduce((sum, day) => sum + day.quizzesTaken, 0);
  const totalPenalties = stats.reduce((sum, day) => sum + day.penalties, 0);
  const averageDaily = totalCoinsEarned / stats.length;

  // Prepare data for charts
  const chartData = stats.map(stat => {
    const dayTransactions = stat.transactions || [];
    const loginBonus = dayTransactions
      .filter(t => t.category === 'bonus' && t.type === 'credit')
      .reduce((sum, t) => sum + t.amount, 0);
    
    return {
      date: new Date(stat.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      coins: stat.coinsEarned,
      quizzes: stat.quizzesTaken,
      bonus: loginBonus,
      penalties: stat.penalties,
      transactions: dayTransactions // Keep transactions for detailed calculations
    };
  });

  // Calculate coin sources with Register Bonus as a separate category
  const categoryData = [
    { name: 'Quiz Rewards', 
      value: stats.reduce((sum, day) => {
        const dayTransactions = day.transactions || [];
        return sum + dayTransactions
          .filter(t => t.category === 'quiz' && t.type === 'credit')
          .reduce((s, t) => s + t.amount, 0);
      }, 0), 
      color: '#8884d8' 
    },
    { 
      name: 'Login Bonuses', 
      value: stats.reduce((sum, day) => {
        const dayTransactions = day.transactions || [];
        return sum + dayTransactions
          .filter(t => t.category === 'bonus' && t.type === 'credit')
          .reduce((s, t) => s + t.amount, 0);
      }, 0), 
      color: '#82ca9d' 
    },
    { 
      name: 'Register Bonus',
      value: stats.reduce((sum, day) => {
        const dayTransactions = day.transactions || [];
        return sum + dayTransactions
          .filter(t => t.category === 'welcome' && t.type === 'credit')
          .reduce((s, t) => s + t.amount, 0);
      }, 0),
      color: '#FFC107' // Gold color for register bonus
    },
    { 
      name: 'Penalties', 
      value: totalPenalties, 
      color: '#ff7c7c' 
    }
  ].filter(category => category.value > 0); // Only show categories with values

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Earned</p>
                <p className="text-2xl font-bold">{totalCoinsEarned}</p>
              </div>
              <Coins className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Daily Average</p>
                <p className="text-2xl font-bold">{Math.round(averageDaily)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Quizzes Taken</p>
                <p className="text-2xl font-bold">{totalQuizzesTaken}</p>
              </div>
              <Trophy className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Penalties</p>
                <p className="text-2xl font-bold text-red-500">{totalPenalties}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Coin Earnings Over Time */}
      <Card>
        <CardHeader>
          <CardTitle>Coin Earnings Over Time</CardTitle>
          <CardDescription>Your daily coin earnings for the past 30 days</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="coins" 
                stroke="#F0B90B" 
                strokeWidth={2}
                dot={{ fill: '#F0B90B' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Daily Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Activity</CardTitle>
          <CardDescription>Breakdown of your daily activities</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="quizzes" fill="#8884d8" name="Quizzes" />
              <Bar dataKey="bonus" fill="#82ca9d" name="Login Bonus" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Coin Sources */}
      <Card>
        <CardHeader>
          <CardTitle>Coin Sources</CardTitle>
          <CardDescription>Where your coins come from</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
