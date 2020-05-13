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
import pandas as pd
import pod
import scipy.io as sio
import sys

class Experiment:
    def __init__(self, podfile):
        csv = pd.read_csv(podfile)
        csv['pod'] = csv.apply(lambda x: pod.Pod(x['label'],x['mac'],x['position']), axis='columns')
        self.pd_pods = csv

    def AddDataFile(self, filename):
        idx = self.pd_pods.label.apply(lambda x: f"{x}-" in filename)
        for p in self.pd_pods['pod'][idx]:
            p.AddDataFile(filename)

    def UpdateLocationInfo(self):
            for p in self.pd_pods['pod']:
                p.UpdateLocalSendLocations()
                p.UpdateLocalReceiveLocations()

            for p in self.pd_pods['pod']:
                for psender in self.pd_pods['pod']:
                    if p != psender:
                        p.UpdateSenderInfo(psender)

    def FilterUnknownTx(self):
        for p in self.pd_pods['pod']:
            p.FilterUnknownTx()
    
    def WriteOutput(self, filename):
        sigvars = ['rssi', 'address', 'rx_x', 'rx_y', 'rx_z', 'tx_x', 'tx_y', 'tx_z']
        #sigvars = ['rssi', 'rx_x', 'rx_y', 'rx_z', 'tx_x', 'tx_y', 'tx_z']
        if filename.endswith('.mat'):
            m = {}
            for p in self.pd_pods['pod']:
                print("len signalData is ", len(p.signalData))
                if len(p.signalData):
                    m[p.label] = {name: col.values for name, col in p.signalData[sigvars].items()}
                    m[p.label]['mac'] = p.mac
                else:
                    m[p.label] = {'mac': p.mac}
                    #m[p.label] = pd.DataFrame(columns=sigvars)
            sio.savemat(filename, m)
        else:
            sys.exit(f"ERROR: unable to write file type for {filename}")


