import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import prisma from '@/lib/prisma'

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email as string },
                    include: {
                        department: true,
                        college: true,
                        hospital: true,
                    }
                })

                if (!user || !user.password || !user.isActive) {
                    return null
                }

                const isPasswordValid = await bcrypt.compare(
                    credentials.password as string,
                    user.password
                )

                if (!isPasswordValid) {
                    return null
                }

                // Update last login
                await prisma.user.update({
                    where: { id: user.id },
                    data: { lastLogin: new Date() }
                })

                return {
                    id: user.id,
                    email: user.email,
                    name: `${user.firstName} ${user.lastName}`,
                    role: user.role,
                    employeeId: user.employeeId,
                    departmentId: user.departmentId,
                    collegeId: user.collegeId,
                    hospitalId: user.hospitalId,
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
                token.role = user.role
                token.employeeId = user.employeeId
                token.departmentId = user.departmentId
                token.collegeId = user.collegeId
                token.hospitalId = user.hospitalId
            }
            return token
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string
                session.user.role = token.role as string
                session.user.employeeId = token.employeeId as string
                session.user.departmentId = token.departmentId as string | null
                session.user.collegeId = token.collegeId as string | null
                session.user.hospitalId = token.hospitalId as string | null
            }
            return session
        }
    },
    pages: {
        signIn: '/login',
    },
    session: {
        strategy: 'jwt',
    },
    secret: process.env.AUTH_SECRET || 'krishna-asset-management-secret-key-2024',
})
