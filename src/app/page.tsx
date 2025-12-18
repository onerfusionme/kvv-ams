export const dynamic = 'force-dynamic';

'use client';

import { useEffect } from 'react';

import { useAssetStore } from '@/store/useAssetStore';
import Sidebar from '@/components/layout/Sidebar';
import StatCard from '@/components/ui/StatCard';
import Card, { CardHeader, CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import {
  CubeIcon,
  WrenchScrewdriverIcon,
  ClipboardDocumentCheckIcon,
  ExclamationTriangleIcon,
  CurrencyRupeeIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CalendarDaysIcon,
  BellAlertIcon,
} from '@heroicons/react/24/outline';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
} from 'recharts';
import {
  monthlyMaintenanceCost,
  assetValueByCategory,
  assetStatusDistribution,
  departmentAssetCount,
} from '@/data/mockData';

export default function DashboardPage() {
  const { dashboardStats, notifications, maintenanceRecords, assetTransfers, assets, fetchDashboardStats, isLoading } = useAssetStore();

  // Fetch dashboard data on mount
  useEffect(() => {
    fetchDashboardStats();
  }, [fetchDashboardStats]);

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)} Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)} L`;
    }
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const recentNotifications = notifications.filter((n) => !n.isRead).slice(0, 5);
  const pendingMaintenace = maintenanceRecords.filter((m) => m.status === 'Scheduled' || m.status === 'In-Progress').slice(0, 5);
  const pendingTransfers = assetTransfers.filter((t) => t.approvalStatus === 'Pending').slice(0, 5);

  return (
    <Sidebar>
      <div className="p-6 space-y-6">
        {/* Welcome Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-8">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
          <div className="relative">
            <h1 className="text-3xl font-bold text-white mb-2">Welcome back, Rajesh! 👋</h1>
            <p className="text-indigo-100 max-w-2xl">
              Here&apos;s what&apos;s happening with your assets today. You have{' '}
              <span className="font-semibold text-white">{dashboardStats.pendingTransfers} pending transfers</span> and{' '}
              <span className="font-semibold text-white">{dashboardStats.warrantyExpiringSoon} warranties expiring soon</span>.
            </p>
          </div>
          <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -top-10 -right-20 w-32 h-32 bg-pink-500/30 rounded-full blur-3xl" />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Assets"
            value={dashboardStats.totalAssets.toLocaleString()}
            change={12.5}
            changeLabel="from last month"
            trend="up"
            icon={<CubeIcon className="w-6 h-6 text-white" />}
            iconBg="from-indigo-500 to-purple-600"
            href="/assets"
          />
          <StatCard
            title="Total Asset Value"
            value={formatCurrency(dashboardStats.totalValue)}
            subtitle={`Book Value: ${formatCurrency(dashboardStats.depreciatedValue)}`}
            icon={<CurrencyRupeeIcon className="w-6 h-6 text-white" />}
            iconBg="from-emerald-500 to-green-600"
            href="/depreciation"
          />
          <StatCard
            title="Maintenance YTD"
            value={formatCurrency(dashboardStats.maintenanceCostYTD)}
            change={-8.3}
            changeLabel="vs last year"
            trend="down"
            icon={<WrenchScrewdriverIcon className="w-6 h-6 text-white" />}
            iconBg="from-amber-500 to-orange-600"
            href="/maintenance"
          />
          <StatCard
            title="Pending Audits"
            value={dashboardStats.pendingAudits}
            subtitle={`${dashboardStats.complianceIssues} compliance issues`}
            icon={<ClipboardDocumentCheckIcon className="w-6 h-6 text-white" />}
            iconBg="from-rose-500 to-pink-600"
            href="/audit"
          />
        </div>

        {/* Alert Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <ExclamationTriangleIcon className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-amber-400">Warranty Expiring</p>
              <p className="text-2xl font-bold text-white">{dashboardStats.warrantyExpiringSoon}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <CalendarDaysIcon className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-blue-400">AMC Renewals Due</p>
              <p className="text-2xl font-bold text-white">{dashboardStats.amcExpiringSoon}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <BellAlertIcon className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-purple-400">Calibration Due</p>
              <p className="text-2xl font-bold text-white">{dashboardStats.calibrationDueSoon}</p>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Maintenance Cost Trend */}
          <Card>
            <CardHeader>
              <div>
                <h3 className="text-lg font-semibold text-white">Maintenance Cost Trend</h3>
                <p className="text-sm text-slate-400">Monthly breakdown of maintenance expenses</p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyMaintenanceCost}>
                    <defs>
                      <linearGradient id="colorPreventive" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorBreakdown" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                    <YAxis stroke="#64748b" fontSize={12} tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1e293b',
                        border: '1px solid #334155',
                        borderRadius: '8px',
                      }}
                      formatter={(value) => [`₹${(Number(value || 0) / 1000).toFixed(0)}K`, '']}
                    />
                    <Area
                      type="monotone"
                      dataKey="preventive"
                      stackId="1"
                      stroke="#6366f1"
                      fill="url(#colorPreventive)"
                      name="Preventive"
                    />
                    <Area
                      type="monotone"
                      dataKey="breakdown"
                      stackId="1"
                      stroke="#f59e0b"
                      fill="url(#colorBreakdown)"
                      name="Breakdown"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Asset Value by Category */}
          <Card>
            <CardHeader>
              <div>
                <h3 className="text-lg font-semibold text-white">Asset Value by Category</h3>
                <p className="text-sm text-slate-400">Distribution of asset values across categories</p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center">
                <div className="w-1/2">
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={assetValueByCategory}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {assetValueByCategory.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1e293b',
                          border: '1px solid #334155',
                          borderRadius: '8px',
                        }}
                        formatter={(value) => [formatCurrency(Number(value || 0)), '']}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="w-1/2 space-y-3">
                  {assetValueByCategory.map((item) => (
                    <div key={item.name} className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white">{item.name}</p>
                        <p className="text-xs text-slate-400">{formatCurrency(item.value)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Asset Status & Department Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Asset Status Distribution */}
          <Card>
            <CardHeader>
              <div>
                <h3 className="text-lg font-semibold text-white">Asset Status Distribution</h3>
                <p className="text-sm text-slate-400">Current status of all assets</p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {assetStatusDistribution.map((item) => (
                  <div key={item.name} className="flex items-center gap-4">
                    <div className="w-24 text-sm text-slate-300">{item.name}</div>
                    <div className="flex-1 h-8 bg-slate-800 rounded-lg overflow-hidden">
                      <div
                        className="h-full rounded-lg transition-all duration-500"
                        style={{
                          width: `${(item.value / dashboardStats.totalAssets) * 100}%`,
                          backgroundColor: item.color,
                        }}
                      />
                    </div>
                    <div className="w-16 text-right text-sm font-medium text-white">
                      {item.value.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Department Asset Count */}
          <Card>
            <CardHeader>
              <div>
                <h3 className="text-lg font-semibold text-white">Assets by Department</h3>
                <p className="text-sm text-slate-400">Asset distribution across departments</p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={departmentAssetCount} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                    <XAxis type="number" stroke="#64748b" fontSize={12} />
                    <YAxis type="category" dataKey="department" stroke="#64748b" fontSize={11} width={100} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1e293b',
                        border: '1px solid #334155',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar dataKey="count" fill="#6366f1" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Notifications */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-white">Recent Alerts</h3>
            </CardHeader>
            <CardContent padding={false}>
              <div className="divide-y divide-white/5">
                {recentNotifications.length === 0 ? (
                  <div className="p-6 text-center text-slate-400">No unread notifications</div>
                ) : (
                  recentNotifications.map((notification) => (
                    <div key={notification.id} className="p-4 hover:bg-white/5 transition-colors cursor-pointer">
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-2 h-2 mt-2 rounded-full flex-shrink-0 ${notification.type === 'Warning'
                            ? 'bg-amber-400'
                            : notification.type === 'Alert'
                              ? 'bg-red-400'
                              : notification.type === 'Success'
                                ? 'bg-emerald-400'
                                : 'bg-blue-400'
                            }`}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate">{notification.title}</p>
                          <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{notification.message}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Pending Maintenance */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-white">Upcoming Maintenance</h3>
            </CardHeader>
            <CardContent padding={false}>
              <div className="divide-y divide-white/5">
                {pendingMaintenace.length === 0 ? (
                  <div className="p-6 text-center text-slate-400">No pending maintenance</div>
                ) : (
                  pendingMaintenace.map((record) => {
                    const asset = assets.find((a) => a.id === record.assetId);
                    return (
                      <div key={record.id} className="p-4 hover:bg-white/5 transition-colors cursor-pointer">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-medium text-white truncate">{record.ticketNumber}</p>
                          <Badge
                            variant={
                              record.status === 'Scheduled'
                                ? 'info'
                                : record.status === 'In-Progress'
                                  ? 'warning'
                                  : 'default'
                            }
                          >
                            {record.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-400 truncate">{asset?.name || 'Unknown Asset'}</p>
                        <p className="text-xs text-slate-500 mt-1">
                          {record.type} • {record.scheduledDate}
                        </p>
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>

          {/* Pending Transfers */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-white">Pending Approvals</h3>
            </CardHeader>
            <CardContent padding={false}>
              <div className="divide-y divide-white/5">
                {pendingTransfers.length === 0 ? (
                  <div className="p-6 text-center text-slate-400">No pending transfers</div>
                ) : (
                  pendingTransfers.map((transfer) => {
                    const asset = assets.find((a) => a.id === transfer.assetId);
                    return (
                      <div key={transfer.id} className="p-4 hover:bg-white/5 transition-colors cursor-pointer">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-medium text-white truncate">{asset?.assetId}</p>
                          <Badge variant="warning" dot>
                            Pending
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-400 truncate">{asset?.name || 'Unknown Asset'}</p>
                        <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                          <span>{transfer.transferType}</span>
                          <span>•</span>
                          <span>{transfer.requestedDate}</span>
                        </p>
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-white">Quick Actions</h3>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[
                { name: 'Add Asset', icon: '📦', color: 'from-indigo-500 to-purple-600' },
                { name: 'New Transfer', icon: '🔄', color: 'from-blue-500 to-cyan-600' },
                { name: 'Create Ticket', icon: '🔧', color: 'from-amber-500 to-orange-600' },
                { name: 'Start Audit', icon: '📋', color: 'from-emerald-500 to-green-600' },
                { name: 'View Reports', icon: '📊', color: 'from-pink-500 to-rose-600' },
                { name: 'Scan Asset', icon: '📸', color: 'from-violet-500 to-purple-600' },
              ].map((action) => (
                <button
                  key={action.name}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl bg-gradient-to-br ${action.color} hover:opacity-90 transition-opacity`}
                >
                  <span className="text-2xl">{action.icon}</span>
                  <span className="text-sm font-medium text-white">{action.name}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Sidebar>
  );
}
