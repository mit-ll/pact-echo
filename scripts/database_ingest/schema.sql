CREATE TABLE IF NOT EXISTS PiPactNodes (
  id INTEGER PRIMARY KEY ASC,
  label TEXT UNIQUE,
  bluetooth_mac TEXT
);

CREATE TABLE IF NOT EXISTS ImportedFiles (
    id INTEGER PRIMARY KEY ASC,
    importedFile TEXT,
    status TEXT,
    fileType TEXT
);

CREATE TABLE IF NOT EXISTS RssiData (
    id INTEGER PRIMARY KEY ASC,
    recordTime INT, 
    recordMac TEXT,
    rssi INTEGER,
    senderMac TEXT,
    importedFileId INT NOT NULL,
    FOREIGN KEY("importedFileId") REFERENCES "ImportedFiles"(id),
    UNIQUE(recordTime, recordMac, senderMac)
);

CREATE TABLE IF NOT EXISTS PositionData (
  id INTEGER PRIMARY KEY ASC,
  recordTime INT, 
  piPactNodeId INT NOT NULL,
  pos_x REAL,
  pos_y REAL,
  pos_z REAL,
  orientation_x REAL,
  orientation_y REAL,
  orientation_z REAL,
  orientation_w REAL,
  FOREIGN KEY("piPactNodeId") REFERENCES "PiPactNodes"(id)
);

CREATE INDEX IF NOT EXISTS nodeId ON PositionData(piPactNodeId);
CREATE INDEX IF NOT EXISTS recvPair ON RssiData(recordMac, senderMac);

CREATE TABLE IF NOT EXISTS schema_version (
  id INTEGER PRIMARY KEY,
  extra TEXT
);
INSERT INTO schema_version(id, extra) VALUES(1, "Verion 1.0");