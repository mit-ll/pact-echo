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

import json, os, re, sys
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

    def LoadFromCheckpoint(self, d):
        ckdat = f"checkpoint_{self.label}_dat"
        ckpos = f"checkpoint_{self.label}_pos"
        self.signalData = pd.read_pickle(os.path.join(d,ckdat))
        self.positionData = pd.read_pickle(os.path.join(d,ckpos))
        print(f"loaded checkpoint for {self}")

    def AddDataFile(self, f, path):
        try:
            if "/data/" in path:
                print(f"    adding data file {path}")
                self.AddSignalFile(f)
            elif "/position/" in path:
                print(f"adding position file {path}")
                self.AddPositionFile(f)
            else:
                print(f"skipping {path} since it doesn't have data or position")
        except Exception:
            print(f"WARNING: error adding file {path}")

    def AddSignalFile(self, f):
        x = pd.read_json(f,lines=True)
        if len(x) > 0:
            x['ts'] = x.timestamp.apply(lambda x: x.timestamp())
            x['address'] = x.message.apply(lambda x: x['address'])
            x['rssi'] = x.message.apply(lambda x: x['rssi'])
            x['data'] = x.message.apply(self._picker)
            #x = x.drop(columns = ['level', 'message', 'timestamp'])
            self.signalData = self.signalData.append(x)

    def AddPositionFile(self, f):
        if self.pos != 'ros':
            print(f"skipping ROS position file since pod was declared static: {self}")
            return
        x = pd.read_json(f,lines=True)
        if len(x) > 0:
            x['ts'] = x.timestamp.apply(lambda x: x.timestamp())
            x['x'] = x.message.apply(self._getx)
            x['y'] = x.message.apply(self._gety)
            x['z'] = x.message.apply(self._getz)
            #x = x.drop(columns=['level', 'message', 'timestamp'])
            self.positionData = self.positionData.append(x)

    def TimeSort(self):
        if len(self.signalData):
            self.signalData.sort_values(by=['ts'], inplace=True, ignore_index=True)
        if len(self.positionData):
            self.positionData.sort_values(by=['ts'], inplace=True, ignore_index=True)

    def UpdateLocalSendLocations(self):
        if self.pos.startswith('static:'):
            sfile = self.pos[7:]
            self.positionData = pd.read_json(sfile,lines=True)
            try:
                self.positionData['x'] = self.positionData['values'][0]['pose']['position']['x']
                self.positionData['y'] = self.positionData['values'][0]['pose']['position']['y']
                self.positionData['z'] = self.positionData['values'][0]['pose']['position']['z']
                self.positionData['ts'] = None
            except Exception:
                print(f"WARNING: unable to load static position for {self.label}")
        elif self.pos == 'ros':
            if len(self.positionData) == 0:
                print(f"ERROR: send Tx locations needs ROS file not provided for {self.label}")
        else:
            sys.exit(f"{self} FIXME: update send locations")

    def UpdateLocalReceiveLocations(self):
        if len(self.signalData) == 0: return
        if self.pos.startswith('static:'):
            if len(self.positionData) == 0:
                print(f"ERROR: trying to update static receive locations without first updating static send locations for {self.label}")
            else:
                self.signalData['rx_x'] = self.positionData['x']
                self.signalData['rx_y'] = self.positionData['y']
                self.signalData['rx_z'] = self.positionData['z']
        elif self.pos == 'ros':
            self._InterpolateReceiveLocations()
        else:
            sys.exit(f"{self} FIXME: update receive locations")

    def UpdateSenderInfo(self, psender):
        print(f"receiver = {self.label}, sender = {psender.label}")
        if len(self.signalData.index) == 0:
            print(f"No signal data given for {self}")
            return
        if not 'tx_x' in self.signalData.columns:
            n = len(self.signalData)
            self.signalData['tx_x'] = pd.Series([None]*n,dtype='float64')
            self.signalData['tx_y'] = pd.Series([None]*n,dtype='float64')
            self.signalData['tx_z'] = pd.Series([None]*n,dtype='float64')
        idx = self.signalData['address'].str.findall(psender.mac, flags=re.IGNORECASE).apply(lambda x: len(x) != 0)
        send_loc = psender.GetPositionAtTimes(self.signalData['ts'][idx])
        print("==> tx_x dtype is", self.signalData['tx_x'].dtype)
        self.signalData['tx_x'][idx] = send_loc['x'].astype('float64').tolist()
        self.signalData['tx_y'][idx] = send_loc['y'].astype('float64').tolist()
        self.signalData['tx_z'][idx] = send_loc['z'].astype('float64').tolist()
        print("<== tx_x dtype is", self.signalData['tx_x'].dtype)

    def UpdateTransmitDistances(self):
        if len(self.signalData) == 0: return
        nisnan = lambda x: not math.isnan(x)
        idx = (self.signalData.rx_x.apply(nisnan)) & (self.signalData.tx_x.apply(nisnan))
        if len(idx):
            rx = self.signalData['rx_x'][idx]
            ry = self.signalData['rx_y'][idx]
            rz = self.signalData['rx_z'][idx]
            tx = self.signalData['tx_x'][idx]
            ty = self.signalData['tx_y'][idx]
            tz = self.signalData['tx_z'][idx]
            if not 'd' in self.signalData.columns:
                self.signalData['d'] = pd.Series([None]*len(self.signalData), dtype='float64')
            self.signalData['d'][idx] = ( (rx-tx)*(rx-tx) + (ry-ty)*(ry-ty) + (rz-tz)*(rz-tz) ).apply(lambda x: math.sqrt(x)).tolist()

    def GetPositionAtTimes(self, ts):
        n = len(ts.index)
        if self.pos.startswith('static:'):
            ret = pd.DataFrame({
                'x': [self.positionData['x']] * n,
                'y': [self.positionData['y']] * n,
                'z': [self.positionData['z']] * n
            })
            return ret
        else:
            print(f"FIXME: get positions at times for {self.label}")
            return pd.DataFrame({ 'x': None, 'y': None, 'z': None }, index=[0])

    def FilterUnknownTx(self):
        if len(self.signalData) == 0: return
        idx = self.signalData.tx_x.apply(lambda x: not math.isnan(x))
        self.signalData = self.signalData[idx]