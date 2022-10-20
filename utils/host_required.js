import User from '../utils/server_side_user';

export default async function HostRequired(req, res) {
    const user = await User(req, res);
    const student = user['student'];
    if (student === false){
        return false;
    }
    return true;
}