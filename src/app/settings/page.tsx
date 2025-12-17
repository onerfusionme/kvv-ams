'use client';

import { useState } from 'react';
import { useAssetStore } from '@/store/useAssetStore';
import Sidebar from '@/components/layout/Sidebar';
import Card, { CardHeader, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Badge from '@/components/ui/Badge';
import {
    UserIcon,
    Cog6ToothIcon,
    BellIcon,
    ShieldCheckIcon,
    PaintBrushIcon,
    GlobeAltIcon,
    KeyIcon,
    BuildingOfficeIcon,
} from '@heroicons/react/24/outline';

export default function SettingsPage() {
    const { currentUser, darkMode, toggleDarkMode } = useAssetStore();
    const [activeTab, setActiveTab] = useState('profile');

    const tabs = [
        { id: 'profile', name: 'Profile', icon: UserIcon },
        { id: 'organization', name: 'Organization', icon: BuildingOfficeIcon },
        { id: 'notifications', name: 'Notifications', icon: BellIcon },
        { id: 'security', name: 'Security', icon: ShieldCheckIcon },
        { id: 'appearance', name: 'Appearance', icon: PaintBrushIcon },
        { id: 'integrations', name: 'Integrations', icon: GlobeAltIcon },
    ];

    return (
        <Sidebar>
            <div className="p-6 space-y-6">
                {/* Page Header */}
                <div>
                    <h1 className="text-2xl font-bold text-white">Settings</h1>
                    <p className="text-slate-400 mt-1">Manage your account and system preferences</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Sidebar Navigation */}
                    <div className="lg:col-span-1">
                        <Card>
                            <CardContent padding={false}>
                                <nav className="p-2">
                                    {tabs.map((tab) => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${activeTab === tab.id
                                                    ? 'bg-indigo-500/20 text-white'
                                                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                                                }`}
                                        >
                                            <tab.icon className="w-5 h-5" />
                                            <span className="font-medium">{tab.name}</span>
                                        </button>
                                    ))}
                                </nav>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Content Area */}
                    <div className="lg:col-span-3 space-y-6">
                        {/* Profile Settings */}
                        {activeTab === 'profile' && currentUser && (
                            <>
                                <Card>
                                    <CardHeader>
                                        <h3 className="text-lg font-semibold text-white">Profile Information</h3>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-center gap-6 mb-6">
                                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold">
                                                {currentUser.firstName[0]}{currentUser.lastName[0]}
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-semibold text-white">{currentUser.firstName} {currentUser.lastName}</h3>
                                                <p className="text-slate-400">{currentUser.role}</p>
                                                <Badge variant="success" className="mt-2">Active</Badge>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <Input label="First Name" value={currentUser.firstName} />
                                            <Input label="Last Name" value={currentUser.lastName} />
                                            <Input label="Email" type="email" value={currentUser.email} />
                                            <Input label="Phone" value={currentUser.phone} />
                                            <Input label="Employee ID" value={currentUser.employeeId} disabled />
                                            <Input label="Designation" value={currentUser.designation} />
                                        </div>
                                        <div className="flex justify-end mt-6">
                                            <Button variant="primary">Save Changes</Button>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <h3 className="text-lg font-semibold text-white">Role & Permissions</h3>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="p-4 rounded-xl bg-slate-800/50">
                                                <p className="text-sm text-slate-400">Current Role</p>
                                                <p className="text-white font-medium mt-1">{currentUser.role}</p>
                                            </div>
                                            <div className="p-4 rounded-xl bg-slate-800/50">
                                                <p className="text-sm text-slate-400">Department</p>
                                                <p className="text-white font-medium mt-1">IT Services</p>
                                            </div>
                                        </div>
                                        <div className="mt-4">
                                            <p className="text-sm font-medium text-slate-300 mb-2">Permissions</p>
                                            <div className="flex flex-wrap gap-2">
                                                {currentUser.permissions.map((perm, index) => (
                                                    <Badge key={index} variant="info">{perm}</Badge>
                                                ))}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </>
                        )}

                        {/* Organization Settings */}
                        {activeTab === 'organization' && (
                            <Card>
                                <CardHeader>
                                    <h3 className="text-lg font-semibold text-white">Organization Settings</h3>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <Input label="Organization Name" value="University of Excellence" />
                                        <Input label="Short Name" value="UOE" />
                                        <Input label="Primary Email" type="email" value="admin@university.edu" />
                                        <Input label="Phone" value="+91-1234567890" />
                                        <div className="md:col-span-2">
                                            <Input label="Address" value="123 University Avenue, City, State - 123456" />
                                        </div>
                                        <Select
                                            label="Fiscal Year Start"
                                            options={[
                                                { value: '01', label: 'January' },
                                                { value: '04', label: 'April' },
                                                { value: '07', label: 'July' },
                                                { value: '10', label: 'October' },
                                            ]}
                                            value="04"
                                        />
                                        <Select
                                            label="Default Currency"
                                            options={[
                                                { value: 'INR', label: 'Indian Rupee (₹)' },
                                                { value: 'USD', label: 'US Dollar ($)' },
                                                { value: 'EUR', label: 'Euro (€)' },
                                            ]}
                                            value="INR"
                                        />
                                    </div>
                                    <div className="flex justify-end mt-6">
                                        <Button variant="primary">Save Changes</Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Notification Settings */}
                        {activeTab === 'notifications' && (
                            <Card>
                                <CardHeader>
                                    <h3 className="text-lg font-semibold text-white">Notification Preferences</h3>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {[
                                            { id: 'warranty', label: 'Warranty Expiry Alerts', desc: 'Get notified when warranties are expiring' },
                                            { id: 'amc', label: 'AMC Renewal Reminders', desc: 'Reminders for upcoming AMC renewals' },
                                            { id: 'maintenance', label: 'Maintenance Notifications', desc: 'Updates on maintenance schedules' },
                                            { id: 'transfer', label: 'Transfer Approvals', desc: 'Notifications for pending transfer requests' },
                                            { id: 'audit', label: 'Audit Schedules', desc: 'Reminders for upcoming audits' },
                                            { id: 'compliance', label: 'Compliance Alerts', desc: 'Alerts for compliance issues' },
                                        ].map((item) => (
                                            <div key={item.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-800/50">
                                                <div>
                                                    <p className="font-medium text-white">{item.label}</p>
                                                    <p className="text-sm text-slate-400">{item.desc}</p>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input type="checkbox" defaultChecked className="sr-only peer" />
                                                    <div className="w-11 h-6 bg-slate-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-6 p-4 rounded-xl bg-slate-800/50">
                                        <p className="font-medium text-white mb-3">Notification Channels</p>
                                        <div className="flex flex-wrap gap-4">
                                            {['Email', 'SMS', 'WhatsApp', 'In-App'].map((channel) => (
                                                <label key={channel} className="flex items-center gap-2">
                                                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-white/20 bg-slate-800 text-indigo-500 focus:ring-indigo-500" />
                                                    <span className="text-sm text-slate-300">{channel}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Security Settings */}
                        {activeTab === 'security' && (
                            <>
                                <Card>
                                    <CardHeader>
                                        <h3 className="text-lg font-semibold text-white">Change Password</h3>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 gap-4 max-w-md">
                                            <Input label="Current Password" type="password" />
                                            <Input label="New Password" type="password" />
                                            <Input label="Confirm New Password" type="password" />
                                        </div>
                                        <div className="flex justify-start mt-6">
                                            <Button variant="primary">Update Password</Button>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <h3 className="text-lg font-semibold text-white">Two-Factor Authentication</h3>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-800/50">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                                                    <KeyIcon className="w-6 h-6 text-indigo-400" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-white">Two-Factor Authentication</p>
                                                    <p className="text-sm text-slate-400">Add an extra layer of security to your account</p>
                                                </div>
                                            </div>
                                            <Button variant="outline">Enable</Button>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <h3 className="text-lg font-semibold text-white">Active Sessions</h3>
                                    </CardHeader>
                                    <CardContent padding={false}>
                                        <div className="divide-y divide-white/5">
                                            {[
                                                { device: 'Windows PC - Chrome', location: 'Mumbai, India', time: 'Current session' },
                                                { device: 'iPhone 14 Pro - Safari', location: 'Mumbai, India', time: '2 hours ago' },
                                            ].map((session, index) => (
                                                <div key={index} className="flex items-center justify-between p-4">
                                                    <div>
                                                        <p className="font-medium text-white">{session.device}</p>
                                                        <p className="text-sm text-slate-400">{session.location} • {session.time}</p>
                                                    </div>
                                                    {index !== 0 && (
                                                        <Button variant="ghost" size="sm" className="text-red-400">
                                                            Revoke
                                                        </Button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </>
                        )}

                        {/* Appearance Settings */}
                        {activeTab === 'appearance' && (
                            <Card>
                                <CardHeader>
                                    <h3 className="text-lg font-semibold text-white">Appearance</h3>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-800/50">
                                            <div>
                                                <p className="font-medium text-white">Dark Mode</p>
                                                <p className="text-sm text-slate-400">Use dark theme across the application</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={darkMode}
                                                    onChange={toggleDarkMode}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-slate-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
                                            </label>
                                        </div>

                                        <div>
                                            <p className="font-medium text-white mb-3">Accent Color</p>
                                            <div className="flex gap-3">
                                                {[
                                                    { color: 'bg-indigo-500', name: 'Indigo' },
                                                    { color: 'bg-purple-500', name: 'Purple' },
                                                    { color: 'bg-blue-500', name: 'Blue' },
                                                    { color: 'bg-emerald-500', name: 'Green' },
                                                    { color: 'bg-amber-500', name: 'Amber' },
                                                    { color: 'bg-rose-500', name: 'Rose' },
                                                ].map((c) => (
                                                    <button
                                                        key={c.name}
                                                        className={`w-10 h-10 rounded-xl ${c.color} ring-2 ring-offset-2 ring-offset-slate-900 ${c.name === 'Indigo' ? 'ring-white' : 'ring-transparent'
                                                            }`}
                                                        title={c.name}
                                                    />
                                                ))}
                                            </div>
                                        </div>

                                        <Select
                                            label="Sidebar Style"
                                            options={[
                                                { value: 'expanded', label: 'Always Expanded' },
                                                { value: 'collapsed', label: 'Always Collapsed' },
                                                { value: 'auto', label: 'Auto (Responsive)' },
                                            ]}
                                            value="auto"
                                        />

                                        <Select
                                            label="Date Format"
                                            options={[
                                                { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
                                                { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
                                                { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
                                            ]}
                                            value="DD/MM/YYYY"
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Integration Settings */}
                        {activeTab === 'integrations' && (
                            <Card>
                                <CardHeader>
                                    <h3 className="text-lg font-semibold text-white">Integrations</h3>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {[
                                            { name: 'ERP System', desc: 'SAP/Oracle integration for financial data', status: 'Connected' },
                                            { name: 'HRMS', desc: 'Employee and department sync', status: 'Connected' },
                                            { name: 'HIMS/LIMS', desc: 'Hospital/Lab information system', status: 'Not Connected' },
                                            { name: 'Active Directory', desc: 'User authentication', status: 'Connected' },
                                            { name: 'Microsoft Intune', desc: 'Device management', status: 'Not Connected' },
                                            { name: 'WhatsApp API', desc: 'Notification delivery', status: 'Connected' },
                                        ].map((integration) => (
                                            <div key={integration.name} className="flex items-center justify-between p-4 rounded-xl bg-slate-800/50">
                                                <div>
                                                    <p className="font-medium text-white">{integration.name}</p>
                                                    <p className="text-sm text-slate-400">{integration.desc}</p>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <Badge variant={integration.status === 'Connected' ? 'success' : 'default'}>
                                                        {integration.status}
                                                    </Badge>
                                                    <Button variant="ghost" size="sm">
                                                        {integration.status === 'Connected' ? 'Configure' : 'Connect'}
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </Sidebar>
    );
}
