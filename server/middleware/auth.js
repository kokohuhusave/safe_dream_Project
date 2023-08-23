import jwt from 'jsonwebtoken'
import * as userRepository from '../data/admin.js'
import { config } from '../config.js';

const AUTH_ERROR = { message: '인증 에러!'};

export const isAuth = async (req, res, next) => {
    const authHeader = req.get('Authorization');
    console.log('----------------')
    console.log(authHeader)

    if(!(authHeader && authHeader.startsWith('Bearer '))) {
        return res.status(401).json(AUTH_ERROR);
    }


    const token = authHeader.split(' ')[1];
    jwt.verify(
        token,
        config.jwt.secretKey,
        async (error, decoded) => {
            if (error) {
                return res.status(401).json(AUTH_ERROR);
            }
            
            const user = await userRepository.UserfindById(decoded.userid);
            const admin = await userRepository.findById(decoded.userid);
            console.log("---------------------");
            console.log(admin);
            console.log(user);
        
            if (admin) {
                req.userid = admin.userid;
            } else if (user) {
                req.userid = user.userid;
            } else {
                return res.status(401).json(AUTH_ERROR);
            }
            next();
            }
        );
}

