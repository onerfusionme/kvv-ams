'use client';

import { useState } from 'react';
import { useAssetStore } from '@/store/useAssetStore';
import Sidebar from '@/components/layout/Sidebar';
import Card, { CardHeader, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';
import DataTable, { Column } from '@/components/ui/DataTable';
import Modal from '@/components/ui/Modal';
import Select from '@/components/ui/Select';
import { User, UserRole } from '@/types';
import {
    PlusIcon,
    MagnifyingGlassIcon,
    UserIcon,
    PencilIcon,
    TrashIcon,
    EnvelopeIcon,
    PhoneIcon,
} from '@heroicons/react/24/outline';

export default function UsersPage() {
    const { users, departments, addUser, updateUser, deleteUser } = useAssetStore();
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [showNewModal, setShowNewModal] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    // Form State
    const initialFormState = {
        firstName: '',
        lastName: '',
        employeeId: '',
        email: '',
        phone: '',
        designation: '',
        role: '',
        departmentId: '',
    };
    const [formData, setFormData] = useState(initialFormState);

    const pageSize = 10;

    const filteredUsers = users.filter((user) => {
        const matchesSearch = !search ||
            user.firstName.toLowerCase().includes(search.toLowerCase()) ||
            user.lastName.toLowerCase().includes(search.toLowerCase()) ||
            user.email.toLowerCase().includes(search.toLowerCase());
        const matchesRole = !roleFilter || user.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    const totalPages = Math.ceil(filteredUsers.length / pageSize);
    const paginatedUsers = filteredUsers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    const getDepartmentName = (id: string) => departments.find((d) => d.id === id)?.name || '-';

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'Super Admin': return 'from-red-500 to-rose-600';
            case 'Asset Manager': return 'from-indigo-500 to-purple-600';
            case 'Department Admin': return 'from-blue-500 to-cyan-600';
            case 'Auditor': return 'from-amber-500 to-orange-600';
            case 'Technician': return 'from-emerald-500 to-green-600';
            default: return 'from-slate-500 to-slate-600';
        }
    };

    const handleEdit = (user: User) => {
        setEditingUser(user);
        setFormData({
            firstName: user.firstName,
            lastName: user.lastName,
            employeeId: user.employeeId,
            email: user.email,
            phone: user.phone || '',
            designation: user.designation || '',
            role: user.role,
            departmentId: user.departmentId || '',
        });
        setShowNewModal(true);
    };

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this user?')) {
            deleteUser(id);
        }
    };

    const handleSave = () => {
        if (editingUser) {
            updateUser(editingUser.id, {
                ...formData,
                role: formData.role as UserRole,
            });
        } else {
            const newUser: User = {
                id: `user-${Date.now()}`,
                ...formData,
                role: formData.role as UserRole,
                isActive: true,
                joinDate: new Date().toISOString().split('T')[0],
                avatar: undefined,
                locationId: 'loc-1', // Default location
                permissions: [],
            } as User;
            addUser(newUser);
        }
        setShowNewModal(false);
        setEditingUser(null);
        setFormData(initialFormState);
    };

    const handleCloseModal = () => {
        setShowNewModal(false);
        setEditingUser(null);
        setFormData(initialFormState);
    };

    const columns: Column<User>[] = [
        {
            key: 'name',
            header: 'User',
            render: (user) => (
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getRoleColor(user.role)} flex items-center justify-center text-white font-semibold`}>
                        {user.firstName[0]}{user.lastName[0]}
                    </div>
                    <div>
                        <p className="font-medium text-white">{user.firstName} {user.lastName}</p>
                        <p className="text-xs text-slate-400">{user.employeeId}</p>
                    </div>
                </div>
            ),
        },
        {
            key: 'email',
            header: 'Contact',
            render: (user) => (
                <div>
                    <p className="text-white text-sm flex items-center gap-1">
                        <EnvelopeIcon className="w-3 h-3 text-slate-400" />
                        {user.email}
                    </p>
                    <p className="text-xs text-slate-400 flex items-center gap-1">
                        <PhoneIcon className="w-3 h-3" />
                        {user.phone}
                    </p>
                </div>
            ),
        },
        {
            key: 'role',
            header: 'Role',
            sortable: true,
            render: (user) => (
                <Badge variant={
                    user.role === 'Super Admin' ? 'danger' :
                        user.role === 'Asset Manager' ? 'purple' :
                            user.role === 'Department Admin' ? 'info' :
                                'default'
                }>
                    {user.role}
                </Badge>
            ),
        },
        {
            key: 'departmentId',
            header: 'Department',
            render: (user) => <span className="text-slate-300">{getDepartmentName(user.departmentId)}</span>,
        },
        {
            key: 'isActive',
            header: 'Status',
            render: (user) => (
                <Badge variant={user.isActive ? 'success' : 'danger'} dot>
                    {user.isActive ? 'Active' : 'Inactive'}
                </Badge>
            ),
        },
        {
            key: 'actions',
            header: 'Actions',
            render: (user) => (
                <div className="flex items-center gap-1">
                    <button
                        onClick={(e) => { e.stopPropagation(); handleEdit(user); }}
                        className="p-2 rounded-lg text-slate-400 hover:bg-white/5 hover:text-white"
                    >
                        <PencilIcon className="w-4 h-4" />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(user.id); }}
                        className="p-2 rounded-lg text-slate-400 hover:bg-red-500/10 hover:text-red-400"
                    >
                        <TrashIcon className="w-4 h-4" />
                    </button>
                </div>
            ),
        },
    ];

    // Role Stats
    const roleStats = [
        { role: 'Super Admin', count: users.filter((u) => u.role === 'Super Admin').length, color: 'from-red-500 to-rose-600' },
        { role: 'Asset Manager', count: users.filter((u) => u.role === 'Asset Manager').length, color: 'from-indigo-500 to-purple-600' },
        { role: 'Department Admin', count: users.filter((u) => u.role === 'Department Admin').length, color: 'from-blue-500 to-cyan-600' },
        { role: 'Auditor', count: users.filter((u) => u.role === 'Auditor').length, color: 'from-amber-500 to-orange-600' },
        { role: 'Technician', count: users.filter((u) => u.role === 'Technician').length, color: 'from-emerald-500 to-green-600' },
    ];

    return (
        <Sidebar>
            <div className="p-6 space-y-6">
                {/* Page Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-white">User Management</h1>
                        <p className="text-slate-400 mt-1">Manage users, roles, and permissions</p>
                    </div>
                    <Button variant="primary" icon={<PlusIcon className="w-4 h-4" />} onClick={() => setShowNewModal(true)}>
                        Add User
                    </Button>
                </div>

                {/* Role Stats */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {roleStats.map((stat) => (
                        <div
                            key={stat.role}
                            className={`p-4 rounded-xl bg-gradient-to-br ${stat.color} bg-opacity-10 border border-white/10`}
                        >
                            <p className="text-sm text-slate-300">{stat.role}</p>
                            <p className="text-2xl font-bold text-white mt-1">{stat.count}</p>
                        </div>
                    ))}
                </div>

                {/* Filters */}
                <Card>
                    <CardContent>
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <Input
                                    placeholder="Search by name or email..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    leftIcon={<MagnifyingGlassIcon className="w-4 h-4" />}
                                />
                            </div>
                            <Select
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                                options={[
                                    { value: '', label: 'All Roles' },
                                    { value: 'Super Admin', label: 'Super Admin' },
                                    { value: 'Asset Manager', label: 'Asset Manager' },
                                    { value: 'Department Admin', label: 'Department Admin' },
                                    { value: 'Auditor', label: 'Auditor' },
                                    { value: 'Technician', label: 'Technician' },
                                    { value: 'User', label: 'User' },
                                ]}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Data Table */}
                <Card>
                    <CardContent padding={false}>
                        <DataTable
                            data={paginatedUsers}
                            columns={columns}
                            keyExtractor={(item) => item.id}
                            emptyMessage="No users found."
                            pagination={{
                                currentPage,
                                totalPages,
                                pageSize,
                                totalItems: filteredUsers.length,
                                onPageChange: setCurrentPage,
                            }}
                        />
                    </CardContent>
                </Card>

                {/* User Modal */}
                <Modal
                    isOpen={showNewModal}
                    onClose={handleCloseModal}
                    title={editingUser ? "Edit User" : "Add New User"}
                    size="lg"
                    footer={
                        <>
                            <Button variant="secondary" onClick={handleCloseModal}>Cancel</Button>
                            <Button variant="primary" onClick={handleSave}>
                                {editingUser ? "Save Changes" : "Create User"}
                            </Button>
                        </>
                    }
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="First Name"
                            placeholder="John"
                            value={formData.firstName}
                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                            required
                        />
                        <Input
                            label="Last Name"
                            placeholder="Doe"
                            value={formData.lastName}
                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                            required
                        />
                        <Input
                            label="Employee ID"
                            placeholder="EMP001"
                            value={formData.employeeId}
                            onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                            required
                        />
                        <Input
                            label="Email"
                            type="email"
                            placeholder="john.doe@university.edu"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                        <Input
                            label="Phone"
                            placeholder="+91-9876543210"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                        <Input
                            label="Designation"
                            placeholder="Senior Engineer"
                            value={formData.designation}
                            onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                        />
                        <Select
                            label="Role"
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            options={[
                                { value: '', label: 'Select Role' },
                                { value: 'Super Admin', label: 'Super Admin' },
                                { value: 'Asset Manager', label: 'Asset Manager' },
                                { value: 'Department Admin', label: 'Department Admin' },
                                { value: 'Auditor', label: 'Auditor' },
                                { value: 'Technician', label: 'Technician' },
                                { value: 'User', label: 'User' },
                            ]}
                            required
                        />
                        <Select
                            label="Department"
                            value={formData.departmentId}
                            onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                            options={[
                                { value: '', label: 'Select Department' },
                                ...departments.map((d) => ({ value: d.id, label: d.name })),
                            ]}
                            required
                        />
                    </div>
                </Modal>
            </div>
        </Sidebar>
    );
}
