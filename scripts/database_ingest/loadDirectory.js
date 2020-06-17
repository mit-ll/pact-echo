/* 
 *  DISTRIBUTION STATEMENT A. Approved for public release. Distribution is unlimited.
 *  
 *  This material is based upon work supported by the United States Air Force under
 *   Air Force Contract No. FA8702-15-D-0001. Any opinions, findings, conclusions 
 *   or recommendations expressed in this material are those of the author(s) and 
 *   do not necessarily reflect the views of the United States Air Force.
 *  
 *  (c) 2020 Massachusetts Institute of Technology.
 *  
 *  The software/firmware is provided to you on an As-Is basis
 *  
 *  Delivered to the U.S. Government with Unlimited Rights, as defined in 
 *  DFARS Part 252.227-7013 or 7014 (Feb 2014). Notwithstanding any copyright
 *  notice, U.S. Government rights in this work are defined by DFARS 252.227-7013 
 *  or DFARS 252.227-7014 as detailed above. Use of this work other than as 
 *  specifically authorized by the U.S. Government may violate any copyrights 
 *  that exist in this work.
 */

var fs = require('fs');
const readline = require('readline');
const { program } = require('commander');
const sqlite3 = require('sqlite3');
const winston = require('winston');
const { deepParseJson } = require('deep-parse-json');
const path = require('path');

program.requiredOption('-d --db <file>', 'SQLite database file');
program.requiredOption('-p --pathToData <path>', 'Path to data directory');
program.option('-l --logLevel <logLevel>', 'Log level');
program.parse(process.argv);


const logger = winston.createLogger({
    level: program.logLevel ? program.logLevel : 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.Console({
            format: winston.format.simple()
        })
    ]
})

const directory = program.pathToData;

logger.info(`Loading files from: ${directory}`);
logger.info(`Running with log level ${logger.level}`)

const openDatabase = async (databaseFile) => {
    return new sqlite3.Database(databaseFile);
}

/**
 * Return id of the file or 0 if it does not exist
 * @param {*} dataFile 
 * @param {*} db 
 */
const getFileInfoFromDB = async (dataFile, db) => {
    logger.silly(`getFileInfoFromDB(${dataFile})`);
    return new Promise((resolve, reject) => {
        db.all("SELECT * FROM ImportedFiles WHERE importedFile LIKE ?",
            dataFile,
            (err, rows) => {
                logger.silly(`Query found ${rows.length} rows`);
                if (err) {
                    console.err(err);
                    reject(-1);
                }

                if (rows.length == 0) {
                    resolve(0);
                }

                if (rows.length == 1) {
                    logger.silly(`Row: ${JSON.stringify(rows[0])}`);
                    resolve(rows[0].id);
                }

            })
    });
}

const createDatafileEntryWithType = async (dataFile, db, fileType) => {
    return new Promise((resolve, reject) => {
        db.run("INSERT INTO ImportedFiles(importedFile, status, fileType) VALUES(?,?,?)",
            dataFile, "in progress", fileType, function (error) {
                if (error) {
                    reject(error);
                }
                logger.debug(`Created new entry ${JSON.stringify(this)}`);
                resolve(this.lastID);
            })
    })
}

const getNodes = async (db) => {
    logger.silly('getNodes(..)');
    return new Promise((resolve, reject) => {
        db.all("SELECT * FROM PiPactNodes", (err, rows) => {
            if (err) {
                logger.error(err);
                reject(-1);
            }
            if (rows.length == 0) {
                logger.warn('No PiPactNodes found, position data will not be loaded.  If you want to load position data, you must populate the PiPactNodes table');
            }
            let macToId = {};
            for (var i = 0; i < rows.length; i++) {
                macToId[rows[i].bluetooth_mac.toUpperCase()] = rows[i].id;
            }
            resolve(macToId);
        })
    })
}


/**
 * Based on code here: https://stackoverflow.com/questions/5827612/node-js-fs-readdir-recursive-directory-search
 * @param {*} directory 
 */
const findFilesToProcess = async (directory) => {
    logger.debug(`findFilesToProcess(${directory})`);
    const re = /.*json/
    const results = [];
    const list = await fs.readdirSync(directory);
    for (var i = 0; i < list.length; i++) {
        const file = path.resolve(directory, list[i]);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            //Add directories
            f = await findFilesToProcess(file);
            f.map((item) => {
                results.push(item);
            })
        } else {
            //Add .json files
            if (file.match(re)) {
                results.push(file);
            }
        }
    }
    return results;
}

const processFile = async (dataFile, db, macToId) => {
    logger.silly(`processFile(${dataFile})`);
    let fileId = await getFileInfoFromDB(dataFile, db);
    let fileType = -1;
    switch (fileId) {
        case -1:
            console.err("Error finding %s in importedFiles", dataFile)
            return;
        case 0:
            logger.debug(`Creating dataFileEntry...`);
            fileId = await createDatafileEntryWithType(dataFile, db, 'unknown');
            break;
        default:
            logger.info(`${dataFile} already processed, skipping`);
            return;
    }

    logger.silly(`Using fileId=${fileId}`);

    return new Promise((resolve, reject) => {
        db.run('begin transaction');
        let nodeId = null;
        const readInterface = readline.createInterface({
            input: fs.createReadStream(dataFile),
            output: null,
            console: false
        });

        readInterface.on('line', (line) => {
            try {
                const jsonLine = deepParseJson(line);
                if (jsonLine && jsonLine.message && jsonLine.message.rssi) {
                    fileType = 0;
                    db.run("INSERT INTO RssiData(recordTime, recordMac, rssi, senderMac, importedFileId) VALUES(?,?,?,?,?)",
                        Date.parse(jsonLine.timestamp),
                        jsonLine.rxMac.toUpperCase(),
                        jsonLine.message.rssi,
                        jsonLine.message.address.toUpperCase(),
                        fileId)
                } else if (macToId.length > 0 && jsonLine && jsonLine.message && jsonLine.message.msg.position) {
                    fileType = 1;
                    logger.silly(`Position Line: ${JSON.stringify(jsonLine)}`);
                    if (nodeId == null) {
                        nodeId = macToId[jsonLine.rxMac];
                        logger.silly(`Record mac: ${jsonLine.rxMac}\t Node: ${nodeId}`);
                    }
                    db.run("INSERT INTO PositionData(recordTime, piPactNodeId, pos_x, pos_y, pos_y, orientation_x, orientation_y, orientation_z, orientation_w) VALUES(?, ?, ?,?,?, ?,?,?,?)",
                        Date.parse(jsonLine.timestamp),
                        macToId[jsonLine.rxMac],
                        jsonLine.message.msg.position.x,
                        jsonLine.message.msg.position.y,
                        jsonLine.message.msg.position.z,
                        jsonLine.message.msg.orientation.x,
                        jsonLine.message.msg.orientation.y,
                        jsonLine.message.msg.orientation.z,
                        jsonLine.message.msg.orientation.w);

                }

            } catch (error) {
                logger.error(`Line read error in ${dataFile}: ${error}`);
            }
        });

        readInterface.on('error', (error) => {
            logger.error(`Error processing ${fileId}: ${error}`);
            reject(error);
        });

        readInterface.on('close', () => {
            logger.debug(`Closing ${dataFile}`);
            //("Closing %s", dataFile);
            if (fileType == 0) {
                db.run("UPDATE ImportedFiles SET fileType=? WHERE id=?", "data", fileId);
            } else if (fileType == 1) {
                db.run("UPDATE ImportedFiles SET fileType=? WHERE id=?", "position", fileId);
            }
            db.run("UPDATE ImportedFiles SET status=? WHERE id=?",
                "done", fileId);
            db.run('commit', (error) => {
                if (error) {
                    console.error("E2 %s", error);
                    reject(error);
                }
                resolve();
            })
        });
    })

}


const doWork2 = async (directory, database) => {
    const db = await openDatabase(database);

    const filesToProcess = await findFilesToProcess(directory);
    const ftpl = filesToProcess.length;
    const step = Math.floor(ftpl / 100);
    const macToId = await getNodes(db);
    logger.info(`Found ${ftpl} .json files to process`);
    for (var i = 0; i < ftpl; i++) {
        const curFile = filesToProcess[i];
        await processFile(curFile, db, macToId);
        if (ftpl > 50 && i % step == 0) {
            logger.info(`Completed ${i} of ${ftpl} files`);
        }
    }
}

doWork2(directory, program.db);