#!/usr/bin/env python3.7
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

import argparse, experiment, sys, traceback
#from logbook import Logger

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("-p", "--podfile", type=str, help="Pod CSV file", default="pods.csv")
    parser.add_argument("-o", "--out", type=str, help="Write results to output file")
    parser.add_argument("-r", "--recover", type=str, help="Recover from checkpoint files in given directory")
    parser.add_argument('--filter', dest='filter', action='store_true', help='Filter out signals with Tx location not known')
    parser.add_argument('--no-filter', dest='filter', action='store_false', help="Don't filter signals even if Tx location unknown")
    parser.set_defaults(filter=True)
    parser.add_argument("datafiles", nargs='*', help="One or more data files")
    args = parser.parse_args()

    exp = experiment.Experiment(args.podfile)

    loaded = False
    if args.recover:
        for p in exp.pd_pods['pod'].values:
            p.LoadFromCheckpoint(args.recover)
        loaded = True

    try:
        if not loaded:
            if len(args.datafiles) < 1:
                sys.exit("ERROR: must provide one or more data files or directories")
            for f in args.datafiles:
                exp.AddDataFile(f)

        exp.TimeSort()
        exp.UpdateLocationInfo()
        if args.filter:
            exp.FilterUnknownTx()

        if args.out:
            exp.WriteOutput(args.out)

    except Exception:
        traceback.print_exc()
        if not args.recover:
            print("writing checkpoint files")
            for p in exp.pd_pods['pod'].values:
                dat = f"checkpoint_{p.label}_dat"
                pos = f"checkpoint_{p.label}_pos"
                p.signalData.to_pickle(dat)
                p.positionData.to_pickle(pos)

