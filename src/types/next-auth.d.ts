import 'next-auth'
import { DefaultSession, DefaultUser } from 'next-auth'

declare module 'next-auth' {
    interface User extends DefaultUser {
        role?: string
        employeeId?: string
        departmentId?: string | null
        collegeId?: string | null
        hospitalId?: string | null
    }

    interface Session {
        user: {
            id: string
            role: string
            employeeId: string
            departmentId: string | null
            collegeId: string | null
            hospitalId: string | null
        } & DefaultSession['user']
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        id?: string
        role?: string
        employeeId?: string
        departmentId?: string | null
        collegeId?: string | null
        hospitalId?: string | null
    }
}
