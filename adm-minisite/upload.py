#!/usr/bin/python
# -*- coding: utf-8 -*- 

# crt client
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

class GitClient(object):
    def __init__(self, path_, *args, **kwargs):
        if os.path.exists(path_) is False:
            raise EnvironmentError("Path does not exist: %s" % (path_))

    def run_command(self, subcommand, args, success_code=0, 
                    return_stderr=False, combine=False, return_binary=False):
        cmd = ['git']

        cmd += [subcommand] + args

        p = subprocess.Popen(cmd, 
                             stdout=subprocess.PIPE, 
                             stderr=subprocess.STDOUT)

        stdout = p.stdout.read()
        r = p.wait()

        if r != success_code:
            raise ValueError("Command failed with (%d): %s\n%s" % 
                             (p.returncode, cmd, stdout))

        if return_binary is True:
            return stdout

        if combine is True:
            return stdout.strip('\n')
        else:
            return stdout.decode().strip('\n').split('\n')

    def config(self, subcommand):
        return self.run_command('config', subcommand, combine=True)

    def getName(self):
        result = self.config(['--get', 'user.email'])
        name = result.split("@")[0]
        return name

    def status(self):
        result = self.run_command('status', ['-s'], 
                    combine=True)
        statuses = result.split("\n")

        items = []
        for status in statuses:
            if status[0:1] == ' ':
                continue
            action = status.split()[0]
            path = status.split()[1]
            # @todo add replace file
            if action not in ['D', 'M', 'A']:
                continue

            item = {'action': action, 'path': path}
            items.append(item)

        return items

    def show(self, path):
        result = self.run_command('show', ['HEAD:'+path], 
                    combine=True)
        return result

    def __repr__(self):
        return ('<GIT(LOCAL) %s>' % (self.path))

# upload file to server
def upload(path, issueId, version):

    pprint.pprint("uploading file " + path)
    url = HOST + 'api/upload'
    if os.path.isfile(path) is True:
        files = {'file':open(path)} #'file' => name of html input field
        data = {'issueId':issueId, 'version':version}

        r = requests.post(url, files=files, data=data)

# copy file to tmp issue dir
def copy(items, issueId, issueDir):

    for item in items:
        path = item['path']
        action = item['action']

        basename = os.path.basename(path)
        if basename[0:1] == '.':
            continue

        relativePath = path.replace('/', '_')
        pprint.pprint(relativePath)
        if action == 'M' or action == 'D':
            oldFileContent = gitClient.show(path)
            oldPath = os.path.join(issueDir, relativePath)

            file = open(oldPath, "w")
            file.write(oldFileContent)
            file.close()

            upload(oldPath, issueId, 0)

        if action == 'D':
            continue

        newPath = os.path.join(issueDir, relativePath)
        shutil.copyfile(path, newPath)
        upload(newPath, issueId, 1)

def getIssueId(name, message):
    issueUrl = HOST + 'api/getIssueId'
    issueData = {'username':name, 'message':message}
    r = requests.post(issueUrl, data=issueData)
    if r.status_code != 200:
        pprint.pprint("server error")
        sys.exit(2)

    response = json.loads(r.text)
    if response['code'] != 1:
        pprint.pprint(response['message'])
        sys.exit(2)

    if not response['data'].has_key("issue_id"):
        pprint.pprint('get issue id failed')
        sys.exit(2)

    return str(response['data']["issue_id"])

def usage():
    pprint.pprint("usage: python upload.py [option] ... [-h help | -v version | -m message | -v version]")
    pprint.pprint("-h this help")
    pprint.pprint("-v version")
    pprint.pprint("-m comment")
    pprint.pprint("-i issue")

def version():
    pprint.pprint("Crt 1.0.0")

path = sys.path[0]
gitClient = GitClient(path)

def main():
    try:
        opts, args = getopt.getopt(sys.argv[1:], 'm:i:h:v', ['message=', 'issue=', 'help', 'version'])
    except getopt.GetoptError:
        version()
        usage()
        sys.exit(2)

    message = None

    for opt, arg in opts:
        if opt in ('-h', '--help'):
            usage()
            sys.exit(2)
        elif opt in ('-v', '--version'):
            version()
            sys.exit(2)
        elif opt in ('-m', '--message'):
            message = arg
            message = message.decode('gb2312')
        elif opt in ('-i', '--issue'):
            issue = arg
            pprint.pprint(issue)
        else:
            usage()
            sys.exit(2)

    if message is None or len(message) == 0:
        pprint.pprint("message is empty")
        usage()
        sys.exit(2)

    name = gitClient.getName()
    if name == '':
        name = 'nobody'
    pprint.pprint(name)

    items = gitClient.status()

    issueId = getIssueId(name, message)
    pprint.pprint(issueId)

    tmpDir = tempfile.gettempdir()
    issueDir = os.path.join(tmpDir, 'crttmp' + issueId)
    if os.path.exists(issueDir) is False:
        os.mkdir(issueDir)

    copy(items, issueId, issueDir)

    shutil.rmtree(issueDir)

    pprint.pprint("issue: " + HOST + "issue/" + issueId)

if __name__ == '__main__':
    main()
