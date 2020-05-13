"""
 DISTRIBUTION STATEMENT A. Approved for public release. Distribution is unlimited.
 
 This material is based upon work supported by the United States Air Force under
  Air Force Contract No. FA8702-15-D-0001. Any opinions, findings, conclusions 
  or recommendations expressed in this material are those of the author(s) and 
  do not necessarily reflect the views of the United States Air Force.
 
 (c) 2020 Massachusetts Institute of Technology.
 
 The software/firmware is provided to you on an As-Is basis
 
 Delivered to the U.S. Government with Unlimited Rights, as defined in 
 DFARS Part 252.227-7013 or 7014 (Feb 2014). Notwithstanding any copyright
 notice, U.S. Government rights in this work are defined by DFARS 252.227-7013 
 or DFARS 252.227-7014 as detailed above. Use of this work other than as 
 specifically authorized by the U.S. Government may violate any copyrights 
 that exist in this work.
"""

import json, re, sys, tarfile
import pandas as pd
from scipy.interpolate import interp1d
import math

class Pod:
    def __init__(self, label, mac, pos):
        self.label = label
        self.mac = mac
        self.pos = pos
        self.signalData = pd.DataFrame()
        self.positionData = pd.DataFrame()

    def __str__(self):
        return f"{self.label} {self.mac} {self.pos}"

    def _picker(self, a):
        x = a['advertisement']
        if 'manufacturerData' in x.keys():
            y = x['manufacturerData']
            if 'data' in y.keys():
                return y['data']
        return None
    
    def _getx(self, a):
        j=json.loads(a)
        return j['msg']['position']['x']
    
    def _gety(self, a):
        j=json.loads(a)
        return j['msg']['position']['y']
    
    def _getz(self, a):
        j=json.loads(a)
        return j['msg']['position']['z']

    def _InterpolateReceiveLocations(self):
        n = len(self.signalData)
        self.signalData['rx_x'] = pd.Series([None]*n,dtype='float64')
        self.signalData['rx_y'] = pd.Series([None]*n,dtype='float64')
        self.signalData['rx_z'] = pd.Series([None]*n,dtype='float64')
        tp = self.positionData['ts'].values
        xp = self.positionData['x'].values
        yp = self.positionData['y'].values
        zp = self.positionData['z'].values
        fx = interp1d(tp,xp)
        fy = interp1d(tp,yp)
        fz = interp1d(tp,zp)
        ts = self.signalData['ts']
        idx = (ts >= tp[0]) & (ts <= tp[-1])
        self.signalData['rx_x'][idx] = self.signalData[idx].ts.apply(fx)
        self.signalData['rx_y'][idx] = self.signalData[idx].ts.apply(fy)
        self.signalData['rx_z'][idx] = self.signalData[idx].ts.apply(fz)

    def AddDataFile(self, filename):
        if "-ble" in filename:
            self.AddSignalFile(filename)
        elif "-position" in filename:
            self.AddPositionFile(filename)
        else:
            print(f"skipping {filename} since it doesn't have ble or position")

    def AddSignalFile(self, filename):
        print(f"adding signal {filename} => {self.label}")
        if filename.endswith('.tgz') or filename.endswith('.tar.gz'):
            tar = tarfile.open(filename)
            for m in tar.getmembers():
                f = tar.extractfile(m)
                x = pd.read_json(f,lines=True)
                if len(x) > 0:
                    x['ts'] = x.timestamp.apply(lambda x: x.timestamp())
                    x['address'] = x.message.apply(lambda x: x['address'])
                    x['rssi'] = x.message.apply(lambda x: x['rssi'])
                    x['data'] = x.message.apply(self._picker)
                    #x = x.drop(columns = ['level', 'message', 'timestamp'])
                    self.signalData = self.signalData.append(x)
        else:
            print("Skipping signal file with unknown extension:", filename)

    def AddPositionFile(self, filename):
        print(f"adding position {filename} => {self.label}")
        if self.pos != 'ros':
            print("skipping ROS position file since pod was declared static")
            return
        if filename.endswith('.tgz') or filename.endswith('.tar.gz'):
            tar = tarfile.open(filename)
            for m in tar.getmembers():
                f = tar.extractfile(m)
                x = pd.read_json(f,lines=True)
                if len(x) > 0:
                    x['ts'] = x.timestamp.apply(lambda x: x.timestamp())
                    x['x'] = x.message.apply(self._getx)
                    x['y'] = x.message.apply(self._gety)
                    x['z'] = x.message.apply(self._getz)
                    #x = x.drop(columns=['level', 'message', 'timestamp'])
                    self.positionData = self.positionData.append(x)
        else:
            print("Skipping signal file with unknown extension:", filename)

    def UpdateLocalSendLocations(self):
        if self.pos.startswith('static:'):
            sfile = self.pos[7:]
            self.positionData = pd.read_json(sfile, typ='series')
        elif self.pos == 'ros':
            print(f"INFO: {self} does not log Tx instances")
        else:
            sys.exit(f"{self} FIXME: update send locations")

    def UpdateLocalReceiveLocations(self):
        if self.pos.startswith('static:'):
            sfile = self.pos[7:]
            with open(sfile) as f:
                j = json.load(f)
                self.positionData['x'] = j['x']
                self.positionData['y'] = j['y']
                self.positionData['z'] = j['z']
                self.positionData['ts'] = None
        elif self.pos == 'ros':
            self._InterpolateReceiveLocations()
        else:
            sys.exit(f"{self} FIXME: update send locations")

    def UpdateSenderInfo(self, psender):
        print(f"receiver = {self.label}, sender = {psender.label}")
        if not 'tx_x' in self.signalData.columns:
            n = len(self.signalData)
            self.signalData['tx_x'] = pd.Series([None]*n,dtype='float64')
            self.signalData['tx_y'] = pd.Series([None]*n,dtype='float64')
            self.signalData['tx_z'] = pd.Series([None]*n,dtype='float64')
        if len(self.signalData.index) == 0:
            print(f"No signal data given for {self}")
            return
        idx = self.signalData['address'].str.findall(psender.mac, flags=re.IGNORECASE).apply(lambda x: len(x) != 0)
        send_loc = psender.GetPositionAtTimes(self.signalData['ts'][idx])
        self.signalData['tx_x'][idx] = send_loc['x']
        self.signalData['tx_y'][idx] = send_loc['y']
        self.signalData['tx_z'][idx] = send_loc['z']

    def GetPositionAtTimes(self, ts):
        if self.pos.startswith('static:'):
            n = len(ts.index)
            ret = pd.DataFrame({
                'x': [self.positionData['x']] * n,
                'y': [self.positionData['y']] * n,
                'z': [self.positionData['z']] * n
            })
            return ret
        else:
            sys.exit(f"FIXME: get position at times for {self}")

    def FilterUnknownTx(self):
        idx = self.signalData.tx_x.apply(lambda x: not math.isnan(x))
        self.signalData = self.signalData[idx]