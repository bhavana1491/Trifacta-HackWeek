import requests
import getpass
import json
from requests.auth import HTTPBasicAuth
def reset(user, passwd):
  s = requests.session()
  s.auth = (user, passwd)
  resp = s.get('http://localhost:3005/v2/flows')
  obj = resp.json()
  print obj
  ids = [n['id'] for n in obj]
  print ids
  for i in ids:
    s.delete('http://localhost:3005/v2/flows/'+str(i))

  resDataset = s.get('http://localhost:3005/v3/importedDatasets')
  jsonOut = resDataset.json()['data']
  print jsonOut
  dataIds = [d['id'] for d in jsonOut]
  print dataIds
  for data in dataIds:
    s.delete('http://localhost:3005/v3/importedDatasets/'+str(data))

if __name__ == "__main__":
  user = raw_input("Username:")
  passwd = getpass.getpass("Password for " + user + ":")
  reset(user, passwd)
