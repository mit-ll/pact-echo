const winston = require('winston');
const {combine, timestamp, prettyPrint, json} = winston.format; 
const logger = winston.createLogger({
    level: 'info',
    format: combine(
        timestamp(),
        json()
    ),
    transports: [
        new winston.transports.Console({

        })
    ]
})

for (var i=0;i<5;i++) {
    logger.info({a: i+1, b: (i+1)*5});

}