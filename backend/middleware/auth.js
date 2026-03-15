

function isLoggedIn(req, res, next) {
    if(req.session.user_id){
        next();
    }
    else{
        res.status(401).json({message: 'Bu əməliyyatı yerinə yetirmək üçün giriş etməlisiniz!'})
    }
}
function isAdmin(req, res, next) {
    if(req.session.user_id){
        const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.session.user_id);
        if(user.is_admin){
            next();
        }
        else{
            res.status(403).json({message: 'Bu əməliyyatı yerinə yetirmək üçün administrator olmalısınız!'})
        }
    }
    else{
        res.status(401).json({message: 'Bu əməliyyatı yerinə yetirmək üçün giriş etməlisiniz!'})
    }

}
module.exports = {isLoggedIn, isAdmin};
