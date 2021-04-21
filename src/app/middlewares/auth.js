const jwt = require('jsonwebtoken');
const authConfig = require('../../config/auth.json')

module.exports = (req, res, next)=>{
    const authHeader = req.headers.authorization;

    if(!authHeader)
        return res.status(401).send({ error: "Nenhum token encontrado!" });
    
    const parts = authHeader.split(' ');

    if(!parts.length == 2) 
        return res.status(401).send({ error : "Token error /2parts" });
    
    const [ scheme, token ] = parts;

    /* if(!/^Bearer$^/i.test(scheme))
        return res.status(400).send({ error: "Formato não suportado de Token!" }); */

    if(!scheme == 'Bearer'){
        return res.status(400).send({ error: "Formato não suportado de Token!" }); 
    }

    jwt.verify(token, authConfig.secret, (err, decoded)=>{
        if(err) return res.status(401).send({ error: "Token inválido - acesso negado" });

        req.userId = decoded.id;
        return next();
    })
}