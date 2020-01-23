import jwt from 'jsonwebtoken';
import UserService from '../services/UserService';
import Util from './Utils';

const util = new Util();

const auth = async(req, res, next) => {
    const errorMsg = 'Not authorized to access this resource.';
    const token = req.header('Authorization').replace('Bearer ', '');
    const email = req.method === 'POST' ? req.body.email : req.params.email;
    try {
        const data = jwt.verify(token, process.env.JWT_KEY);
        //current logged in user
        const user = await UserService.getUser(data.email);
        if (!user) {
            throw errorMsg;
        }
        
         //authorize
        if (email != user.email && !user.roles.includes('admin')) {
            throw errorMsg;
        }
        
        req.user = user;
        req.token = token;
        next()
    } catch (error) {
        util.setError(403, error);
        return util.send(res);
    }
}

export default auth;