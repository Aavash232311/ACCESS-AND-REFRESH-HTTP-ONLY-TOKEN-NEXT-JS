export default function RedirectDecorator(req) {
    const cookie = req.cookies['token'];
    if (cookie === undefined) {
        return true;
    }
    return false;
}