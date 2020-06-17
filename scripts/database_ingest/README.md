# DATABASE_INGEST #
Script to read data recorded with pipact into sqlite database.  The script looks for files with the .json extension and attempts to parse them.  If the script successfully detects a RSSI data file or a position file, the contents are loaded into the sqlite database.

## Usage ##
`node loadDirectory.js --db <database_file> --pathToData <data_file_directory> --logLevel <level>`
* `--db, -d <database_file>`
    : path to existing sqlite database file
* `--pathToData, -p <data_file_directory>`
    : path to directory containing data files
* `--logLevel, -l <level>`
    : optional log level (debug, silly)

## Setup ##
1. Install sqlite3
    1. CentOS/RedHat 7
        : `$ sudo yum install sqlite3`
    1. CentOS/RedHat 8
        : `$ sudo dnf install sqlite3`
    1. Ubuntu
        : `$ sudo apt-get install sqlite3`
1. Install nodejs 12 or higher
1. Install node dependencies
    : `npm install`
1. (Optional) Edit `basedata.sql` to contain your PiPACT node identifiers
1. Create a sqlite database
    : `$ sqlite3 path/to/database/data.db`
1. Load database schema
    : `sqlite> .read schema.sql`
1. (Optional) Load PiPACT node identifiers
    : `sqlite> .read basedata.sql`
1. Press `<CTRL-D>` to exit sqlite
1. Load data
    : `node loadDirectory.js -d data.db -p /home/user/data`