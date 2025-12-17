'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAssetStore } from '@/store/useAssetStore';
import { useTheme } from '@/components/providers/ThemeProvider';
import Footer from './Footer';
import {
    HomeIcon,
    CubeIcon,
    WrenchScrewdriverIcon,
    ArrowsRightLeftIcon,
    ClipboardDocumentCheckIcon,
    BuildingOfficeIcon,
    UserGroupIcon,
    TruckIcon,
    DocumentTextIcon,
    ChartBarIcon,
    BellIcon,
    Cog6ToothIcon,
    ShieldCheckIcon,
    ComputerDesktopIcon,
    BeakerIcon,
    CurrencyDollarIcon,
    ArchiveBoxXMarkIcon,
    DocumentCheckIcon,
    Bars3Icon,
    XMarkIcon,
    SunIcon,
    MoonIcon,
    ChevronDownIcon,
} from '@heroicons/react/24/outline';
import { useState } from 'react';

interface NavItem {
    name: string;
    href: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    children?: { name: string; href: string }[];
}

const navigation: NavItem[] = [
    { name: 'Dashboard', href: '/', icon: HomeIcon },
    {
        name: 'Asset Master',
        href: '/assets',
        icon: CubeIcon,
        children: [
            { name: 'All Assets', href: '/assets' },
            { name: 'Add Asset', href: '/assets/new' },
            { name: 'Categories', href: '/assets/categories' },
        ]
    },
    {
        name: 'Procurement',
        href: '/procurement',
        icon: TruckIcon,
        children: [
            { name: 'Purchase Orders', href: '/procurement/orders' },
            { name: 'Vendors', href: '/procurement/vendors' },
        ]
    },
    { name: 'Allocation', href: '/allocation', icon: ArrowsRightLeftIcon },
    { name: 'Locations', href: '/locations', icon: BuildingOfficeIcon },
    { name: 'Departments', href: '/departments', icon: BuildingOfficeIcon },
    { name: 'Maintenance', href: '/maintenance', icon: WrenchScrewdriverIcon },
    { name: 'Contracts', href: '/contracts', icon: DocumentTextIcon },
    { name: 'Audit', href: '/audit', icon: ClipboardDocumentCheckIcon },
    { name: 'Depreciation', href: '/depreciation', icon: CurrencyDollarIcon },
    { name: 'Disposal', href: '/disposal', icon: ArchiveBoxXMarkIcon },
    { name: 'Compliance', href: '/compliance', icon: ShieldCheckIcon },
    { name: 'IT Assets', href: '/it-assets', icon: ComputerDesktopIcon },
    { name: 'Biomedical', href: '/biomedical', icon: BeakerIcon },
    { name: 'Users', href: '/users', icon: UserGroupIcon },
    { name: 'Reports', href: '/reports', icon: ChartBarIcon },
    { name: 'Notifications', href: '/notifications', icon: BellIcon },
    { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
];

interface SidebarProps {
    children: ReactNode;
}

export default function Sidebar({ children }: SidebarProps) {
    const pathname = usePathname();
    const { sidebarOpen, toggleSidebar, notifications, currentUser } = useAssetStore();
    const { theme, toggleTheme } = useTheme();
    const [expandedItems, setExpandedItems] = useState<string[]>([]);
    const [mobileOpen, setMobileOpen] = useState(false);

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    const toggleExpanded = (name: string) => {
        setExpandedItems((prev) =>
            prev.includes(name) ? prev.filter((i) => i !== name) : [...prev, name]
        );
    };

    const isActive = (href: string) => pathname === href;
    const isParentActive = (item: NavItem) => {
        if (isActive(item.href)) return true;
        return item.children?.some((child) => isActive(child.href)) || false;
    };

    const NavContent = () => (
        <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
                    <CubeIcon className="w-6 h-6 text-white" />
                </div>
                {sidebarOpen && (
                    <div>
                        <h1 className="text-lg font-bold text-white tracking-tight">KVV AMS</h1>
                        <p className="text-xs text-slate-400">Asset Management</p>
                    </div>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-4 px-2 scrollbar-thin scrollbar-thumb-slate-700">
                <ul className="space-y-1">
                    {navigation.map((item) => (
                        <li key={item.name}>
                            {item.children ? (
                                <div>
                                    <button
                                        onClick={() => toggleExpanded(item.name)}
                                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${isParentActive(item)
                                            ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-white'
                                            : 'text-slate-400 hover:bg-white/5 hover:text-white'
                                            }`}
                                    >
                                        <item.icon className={`w-5 h-5 flex-shrink-0 ${isParentActive(item) ? 'text-indigo-400' : ''}`} />
                                        {sidebarOpen && (
                                            <>
                                                <span className="flex-1 text-left text-sm font-medium">{item.name}</span>
                                                <ChevronDownIcon
                                                    className={`w-4 h-4 transition-transform duration-200 ${expandedItems.includes(item.name) ? 'rotate-180' : ''
                                                        }`}
                                                />
                                            </>
                                        )}
                                    </button>
                                    {sidebarOpen && expandedItems.includes(item.name) && (
                                        <ul className="mt-1 ml-8 space-y-1">
                                            {item.children.map((child) => (
                                                <li key={child.href}>
                                                    <Link
                                                        href={child.href}
                                                        className={`block px-3 py-2 rounded-lg text-sm transition-colors ${isActive(child.href)
                                                            ? 'bg-indigo-500/20 text-indigo-300'
                                                            : 'text-slate-400 hover:bg-white/5 hover:text-white'
                                                            }`}
                                                    >
                                                        {child.name}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            ) : (
                                <Link
                                    href={item.href}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${isActive(item.href)
                                        ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-white'
                                        : 'text-slate-400 hover:bg-white/5 hover:text-white'
                                        }`}
                                >
                                    <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive(item.href) ? 'text-indigo-400' : ''}`} />
                                    {sidebarOpen && <span className="text-sm font-medium">{item.name}</span>}
                                </Link>
                            )}
                        </li>
                    ))}
                </ul>
            </nav>

            {/* User Section */}
            {sidebarOpen && currentUser && (
                <div className="p-4 border-t border-white/10">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-slate-800/50 to-slate-700/50">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                            {currentUser.firstName[0]}{currentUser.lastName[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">
                                {currentUser.firstName} {currentUser.lastName}
                            </p>
                            <p className="text-xs text-slate-400 truncate">{currentUser.role}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <div className="min-h-screen">
            {/* Mobile sidebar backdrop */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Mobile sidebar */}
            <aside
                className={`fixed top-0 left-0 z-50 h-full w-64 bg-slate-900 transform transition-transform duration-300 lg:hidden ${mobileOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <NavContent />
            </aside>

            {/* Desktop sidebar */}
            <aside
                className={`hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:flex-col bg-slate-900 transition-all duration-300 ${sidebarOpen ? 'lg:w-64' : 'lg:w-20'
                    }`}
            >
                <NavContent />
            </aside>

            {/* Main content */}
            <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:pl-64' : 'lg:pl-20'}`}>
                {/* Top header */}
                <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-xl border-b border-white/10">
                    <div className="flex items-center justify-between px-4 py-3">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setMobileOpen(true)}
                                className="lg:hidden p-2 rounded-lg text-slate-400 hover:bg-white/5 hover:text-white transition-colors"
                            >
                                <Bars3Icon className="w-6 h-6" />
                            </button>
                            <button
                                onClick={toggleSidebar}
                                className="hidden lg:block p-2 rounded-lg text-slate-400 hover:bg-white/5 hover:text-white transition-colors"
                            >
                                {sidebarOpen ? <XMarkIcon className="w-5 h-5" /> : <Bars3Icon className="w-5 h-5" />}
                            </button>
                            <div className="hidden sm:block">
                                <h2 className="text-lg font-semibold text-white">
                                    {navigation.find((n) => n.href === pathname || n.children?.some((c) => c.href === pathname))?.name || 'Dashboard'}
                                </h2>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            {/* Search */}
                            <div className="hidden md:block">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search assets..."
                                        className="w-64 px-4 py-2 pl-10 bg-slate-800/50 border border-white/10 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent"
                                    />
                                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                            </div>

                            {/* Dark mode toggle */}
                            <button
                                onClick={toggleTheme}
                                className="p-2 rounded-lg text-slate-400 hover:bg-white/5 hover:text-white transition-colors"
                                title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                            >
                                {theme === 'dark' ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
                            </button>

                            {/* Notifications */}
                            <Link
                                href="/notifications"
                                className="relative p-2 rounded-lg text-slate-400 hover:bg-white/5 hover:text-white transition-colors"
                            >
                                <BellIcon className="w-5 h-5" />
                                {unreadCount > 0 && (
                                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center">
                                        {unreadCount > 9 ? '9+' : unreadCount}
                                    </span>
                                )}
                            </Link>

                            {/* User menu */}
                            {currentUser && (
                                <div className="flex items-center gap-2 pl-3 border-l border-white/10">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold">
                                        {currentUser.firstName[0]}{currentUser.lastName[0]}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="min-h-[calc(100vh-130px)] bg-slate-950">
                    {children}
                </main>
                <Footer />
            </div>
        </div>
    );
}
