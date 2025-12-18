export const dynamic = 'force-dynamic';

'use client';

import { useAssetStore } from '@/store/useAssetStore';
import Sidebar from '@/components/layout/Sidebar';
import Card, { CardHeader, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import {
    BellIcon,
    CheckIcon,
    ExclamationTriangleIcon,
    InformationCircleIcon,
    CheckCircleIcon,
    TrashIcon,
} from '@heroicons/react/24/outline';

export default function NotificationsPage() {
    const { notifications, markNotificationRead, markAllNotificationsRead } = useAssetStore();

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'Warning': return <ExclamationTriangleIcon className="w-5 h-5 text-amber-400" />;
            case 'Alert': return <ExclamationTriangleIcon className="w-5 h-5 text-red-400" />;
            case 'Success': return <CheckCircleIcon className="w-5 h-5 text-emerald-400" />;
            default: return <InformationCircleIcon className="w-5 h-5 text-blue-400" />;
        }
    };

    const getNotificationBg = (type: string) => {
        switch (type) {
            case 'Warning': return 'bg-amber-500/10 border-amber-500/20';
            case 'Alert': return 'bg-red-500/10 border-red-500/20';
            case 'Success': return 'bg-emerald-500/10 border-emerald-500/20';
            default: return 'bg-blue-500/10 border-blue-500/20';
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(hours / 24);

        if (hours < 1) return 'Just now';
        if (hours < 24) return `${hours}h ago`;
        if (days < 7) return `${days}d ago`;
        return date.toLocaleDateString();
    };

    const groupedNotifications = notifications.reduce((acc, notif) => {
        const date = new Date(notif.createdAt).toDateString();
        if (!acc[date]) acc[date] = [];
        acc[date].push(notif);
        return acc;
    }, {} as Record<string, typeof notifications>);

    return (
        <Sidebar>
            <div className="p-6 space-y-6">
                {/* Page Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                            <BellIcon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white">Notifications</h1>
                            <p className="text-slate-400 mt-1">
                                {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="secondary" onClick={markAllNotificationsRead}>
                            Mark All as Read
                        </Button>
                    </div>
                </div>

                {/* Notification Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                        <div className="flex items-center gap-3">
                            <ExclamationTriangleIcon className="w-6 h-6 text-amber-400" />
                            <div>
                                <p className="text-sm text-slate-400">Warnings</p>
                                <p className="text-xl font-bold text-amber-400">
                                    {notifications.filter((n) => n.type === 'Warning').length}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                        <div className="flex items-center gap-3">
                            <ExclamationTriangleIcon className="w-6 h-6 text-red-400" />
                            <div>
                                <p className="text-sm text-slate-400">Alerts</p>
                                <p className="text-xl font-bold text-red-400">
                                    {notifications.filter((n) => n.type === 'Alert').length}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                        <div className="flex items-center gap-3">
                            <InformationCircleIcon className="w-6 h-6 text-blue-400" />
                            <div>
                                <p className="text-sm text-slate-400">Info</p>
                                <p className="text-xl font-bold text-blue-400">
                                    {notifications.filter((n) => n.type === 'Info').length}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                        <div className="flex items-center gap-3">
                            <CheckCircleIcon className="w-6 h-6 text-emerald-400" />
                            <div>
                                <p className="text-sm text-slate-400">Success</p>
                                <p className="text-xl font-bold text-emerald-400">
                                    {notifications.filter((n) => n.type === 'Success').length}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Notifications List */}
                <Card>
                    <CardContent padding={false}>
                        {notifications.length === 0 ? (
                            <div className="p-12 text-center">
                                <BellIcon className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-white mb-2">No Notifications</h3>
                                <p className="text-slate-400">You&apos;re all caught up!</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-white/5">
                                {Object.entries(groupedNotifications).map(([date, notifs]) => (
                                    <div key={date}>
                                        <div className="px-6 py-3 bg-slate-800/50">
                                            <p className="text-sm font-medium text-slate-400">{date}</p>
                                        </div>
                                        {notifs.map((notification) => (
                                            <div
                                                key={notification.id}
                                                className={`flex items-start gap-4 p-6 hover:bg-white/5 transition-colors cursor-pointer ${!notification.isRead ? 'bg-indigo-500/5' : ''
                                                    }`}
                                                onClick={() => markNotificationRead(notification.id)}
                                            >
                                                <div className={`w-10 h-10 rounded-xl ${getNotificationBg(notification.type)} flex items-center justify-center flex-shrink-0`}>
                                                    {getNotificationIcon(notification.type)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <p className="font-medium text-white">{notification.title}</p>
                                                        {!notification.isRead && (
                                                            <span className="w-2 h-2 rounded-full bg-indigo-500" />
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-slate-400 mt-1">{notification.message}</p>
                                                    <div className="flex items-center gap-3 mt-2">
                                                        <Badge variant={
                                                            notification.category === 'Warranty' ? 'warning' :
                                                                notification.category === 'Maintenance' ? 'info' :
                                                                    notification.category === 'Audit' ? 'purple' :
                                                                        'default'
                                                        } size="sm">
                                                            {notification.category}
                                                        </Badge>
                                                        <span className="text-xs text-slate-500">{formatDate(notification.createdAt)}</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {!notification.isRead && (
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                markNotificationRead(notification.id);
                                                            }}
                                                            className="p-2 rounded-lg text-slate-400 hover:bg-white/5 hover:text-white"
                                                            title="Mark as read"
                                                        >
                                                            <CheckIcon className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </Sidebar>
    );
}
