export const dynamic = 'force-dynamic';

'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Sidebar from '@/components/layout/Sidebar'
import Card, { CardHeader, CardContent } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { UserCircleIcon, EnvelopeIcon, PhoneIcon, BuildingOfficeIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

export default function ProfilePage() {
    const { data: session, update } = useSession()
    const [loading, setLoading] = useState(false)
    const [editing, setEditing] = useState(false)
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
    })

    useEffect(() => {
        if (session?.user?.name) {
            const nameParts = session.user.name.split(' ')
            setFormData({
                firstName: nameParts[0] || '',
                lastName: nameParts.slice(1).join(' ') || '',
                phone: '',
            })
        }
    }, [session])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!session?.user?.id) return

        setLoading(true)
        try {
            const response = await fetch(`/api/users/${session.user.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    phone: formData.phone || undefined,
                }),
            })

            if (!response.ok) {
                throw new Error('Failed to update profile')
            }

            // Update session with new name
            await update({
                ...session,
                user: {
                    ...session.user,
                    name: `${formData.firstName} ${formData.lastName}`,
                },
            })

            toast.success('Profile updated successfully!')
            setEditing(false)
        } catch (error) {
            console.error('Error updating profile:', error)
            toast.error('Failed to update profile')
        } finally {
            setLoading(false)
        }
    }

    const getInitials = () => {
        if (session?.user?.name) {
            const parts = session.user.name.split(' ')
            return parts.map(p => p[0]).join('').toUpperCase()
        }
        return 'U'
    }

    return (
        <Sidebar>
            <div className="p-6 max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-white">My Profile</h1>
                    <p className="text-slate-400 mt-1">View and manage your account information</p>
                </div>

                {/* Profile Card */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-white">Personal Information</h2>
                            {!editing && (
                                <Button variant="secondary" size="sm" onClick={() => setEditing(true)}>
                                    Edit Profile
                                </Button>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col md:flex-row gap-8">
                            {/* Avatar */}
                            <div className="flex flex-col items-center">
                                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg shadow-indigo-500/25">
                                    {getInitials()}
                                </div>
                                <p className="mt-4 text-lg font-semibold text-white">{session?.user?.name}</p>
                                <p className="text-sm text-slate-400">{session?.user?.role}</p>
                            </div>

                            {/* Info / Form */}
                            <div className="flex-1">
                                {editing ? (
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <Input
                                                label="First Name"
                                                value={formData.firstName}
                                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                                required
                                            />
                                            <Input
                                                label="Last Name"
                                                value={formData.lastName}
                                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <Input
                                            label="Phone Number"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            placeholder="Optional"
                                        />
                                        <div className="flex gap-3 pt-4">
                                            <Button type="submit" loading={loading}>
                                                Save Changes
                                            </Button>
                                            <Button type="button" variant="secondary" onClick={() => setEditing(false)}>
                                                Cancel
                                            </Button>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-800/50">
                                            <UserCircleIcon className="w-5 h-5 text-indigo-400" />
                                            <div>
                                                <p className="text-xs text-slate-400">Full Name</p>
                                                <p className="text-white font-medium">{session?.user?.name}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-800/50">
                                            <EnvelopeIcon className="w-5 h-5 text-indigo-400" />
                                            <div>
                                                <p className="text-xs text-slate-400">Email Address</p>
                                                <p className="text-white font-medium">{session?.user?.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-800/50">
                                            <BuildingOfficeIcon className="w-5 h-5 text-indigo-400" />
                                            <div>
                                                <p className="text-xs text-slate-400">Role</p>
                                                <p className="text-white font-medium">{session?.user?.role}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-800/50">
                                            <CheckCircleIcon className="w-5 h-5 text-emerald-400" />
                                            <div>
                                                <p className="text-xs text-slate-400">Account Status</p>
                                                <p className="text-emerald-400 font-medium">Active</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Security Card */}
                <Card>
                    <CardHeader>
                        <h2 className="text-lg font-semibold text-white">Security</h2>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-800/50">
                            <div>
                                <p className="text-white font-medium">Password</p>
                                <p className="text-sm text-slate-400">Last changed: Never</p>
                            </div>
                            <Button variant="secondary" size="sm" disabled>
                                Change Password
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </Sidebar>
    )
}
