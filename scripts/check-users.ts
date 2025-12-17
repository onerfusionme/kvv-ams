import prisma from '../src/lib/prisma'

async function checkUsers() {
    const users = await prisma.user.findMany({
        select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
            password: true,
            isActive: true,
        }
    })
    console.log('Users in database:')
    users.forEach(user => {
        console.log(`- ${user.email} | ${user.role} | Active: ${user.isActive} | Has Password: ${!!user.password}`)
    })
    process.exit(0)
}

checkUsers().catch(console.error)
