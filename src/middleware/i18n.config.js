const i18n = require("i18n")
const { join } = require("path")
const { Admin } = require("../models")
const jwt = require("jsonwebtoken");

i18n.configure({
    locales: ["EN", "AR"],
    directory: join(__dirname, "/i18n"),
    register: global,
    defaultLocale: "EN",
})

module.exports = async (req, res, next) => {
    i18n.init(res); 
    
    if(req.cookies){
        if (Object.keys(req.cookies).includes("dd-token")) {
            let admin = await Admin.findOne({where: {token: req.cookies["dd-token"]}})
            if (admin) {
                res.setLocale(admin.lang_key? admin.lang_key: "EN")
            }
            return next()
        }
    }
    
    if(req.session.lang_key) { 
        res.setLocale(req.session.lang_key);
    }

    next()
}