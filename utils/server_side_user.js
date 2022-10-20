import tokenRequired from "../eligible_client";

const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

export default async function User(req, res) {
    const user = tokenRequired(req, res, "");
    if (user) {
        const tokenAttributes = user['user']['tokenArgs'];
        const id = tokenAttributes['id'];

        async function getUser() {
            return await prisma.user.findUnique({
                where: {
                    id: id
                },
                select: {
                    email: true, full_name: true, class_name: true, student: true, ClassRoom: true
                }
            });
        }

        const requiredUserDetail = await getUser();
        if (!requiredUserDetail) return null;

        return requiredUserDetail;
    }
    return null;
}