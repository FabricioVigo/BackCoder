const fs = require('fs');

const middleware = {
    midd1: (req,res,next)=>{

        let archivoLog=('./src/logs/info.log')

        if(fs.existsSync()){
            fs.writeFileSync(archivoLog, `LOG: ${req.method} - ${req.url} - ${new Date().toUTCString}`)
        }else{
            fs.writeFileSync(archivoLog, `LOG: ${req.method} - ${req.url} - ${new Date().toUTCString}`)
        }
        next();
    },

    midd2: (req,res,next)=>{

        let archivoLog=('./src/logs/info.log')

        if(fs.existsSync()){
            fs.writeFileSync(archivoLog, `LOG: ${req.method} - ${req.url} - ${new Date().toDateString}`)
        }else{
            fs.writeFileSync(archivoLog, `LOG: ${req.method} - ${req.url} - ${new Date().toDateString}`)
        }
        next();
    }
}