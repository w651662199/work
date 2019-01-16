#!/usr/bin/python
# -*- coding: utf-8 -*- 

# deploy.py
# @author baishen

import os
import sys
import subprocess
import pprint
#pip install requests if you don't have it already
import requests
import tempfile
import shutil
import getopt
import json

HOST = "http://10.112.178.90:5000/"
STATIC_HOST = "http://10.112.178.90:8000/"

def usage():
    pprint.pprint("usage: python deploy.py [option] ... [-h help | -v version | -a all]")
    pprint.pprint("run in project base directory")
    pprint.pprint("-h this help")
    pprint.pprint("-v version")
    pprint.pprint("-a upload all files(default only upload js and css)")

def version():
    pprint.pprint("deploy 1.0.0")

def getProjectName(basePath):
    packageFile = os.path.join(basePath, 'package.json')

    packageFileHandler = open(packageFile)
    packageJson = packageFileHandler.readlines()
    packageJson = ''.join(packageJson)
    packageJson = packageJson.replace('\n', '');
    packageJson = packageJson.replace(' ', '');

    packageInfo = json.loads(packageJson)
    if packageInfo.has_key('name'):
        return packageInfo['name'].upper()
    else:
        return None

def getFiles(distPath):
    deployFiles = {}

    for root, dirs, files in os.walk(distPath):
        for file in files:
            fileNames = file.split('.')
            srcFileName = '.'.join([fileNames[0], fileNames[-1]])
            ext = fileNames[-1]

            filePath = os.path.join(root, file)
            ctime = os.path.getctime(filePath)

            deployFile = dict([('file', file), ('filePath', filePath), ('ext', ext), ('ctime', ctime)])

            # only upload latest files
            if srcFileName in deployFiles:
                oldctime = deployFiles[srcFileName]['ctime']
                diff = ctime - oldctime
                if diff > 0:
                    deployFiles[srcFileName] = deployFile

            else:
                deployFiles[srcFileName] = deployFile

    return deployFiles

# upload file to server
def deploy(project, isAll, basePath, deployFile):

    file = deployFile['file']
    filePath = deployFile['filePath']
    ext = deployFile['ext']
    if not isAll and ext != 'js' and ext != 'css' and ext != 'html':
        return

    pprint.pprint("uploading file " + file)

    relativePath = os.path.relpath(filePath, basePath)
    subPath = os.path.dirname(relativePath)

    newPath = subPath.replace(os.sep, '_');

    url = HOST + 'api/deploy'

    session = requests.Session()
    session.trust_env = False


    if os.path.isfile(filePath) is True:
        files = {'file':open(filePath)}
        data = {'project': project, 'path': newPath}

        r = session.post(url, files=files, data=data)
        if r.status_code == 200 and (ext == 'js' or ext == 'css'):
            files['file'].close()
            os.remove(filePath)


def main():
    try:
        opts, args = getopt.getopt(sys.argv[1:], 'h:v:a', ['help', 'version' 'all'])
    except getopt.GetoptError:
        version()
        usage()
        sys.exit(2)

    isAll = False

    for opt, arg in opts:
        if opt in ('-h', '--help'):
            usage()
            sys.exit(2)
        elif opt in ('-v', '--version'):
            version()
            sys.exit(2)
        elif opt in ('-a', '--all'):
            isAll = True
        else:
            usage()
            sys.exit(2)

    basePath = sys.path[0]
    distPath = os.path.join(basePath, 'dist', 'static')

    project = getProjectName(basePath)

    if project is None or len(project) == 0:
        pprint.pprint("get project failed")
        usage()
        sys.exit(2)

    pprint.pprint("deploying " + project + "...")

    deployFiles = getFiles(distPath)

    for key, deployFile in deployFiles.items():
        deploy(project, isAll, basePath, deployFile)

    pprint.pprint("deploy success ")
    pprint.pprint(STATIC_HOST + "m/" + project + "/dist")

if __name__ == '__main__':
    main()
