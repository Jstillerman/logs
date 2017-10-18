#!/usr/bin/python
import requests
import time

f = open('/Users/jts/Daily/logs/Hooks/lastvalue', 'r+')
lastVal = f.readline()

from AppKit import NSWorkspace
activeAppName = NSWorkspace.sharedWorkspace().activeApplication()['NSApplicationName']

if(activeAppName != lastVal):
	requests.post('http://localhost:8080/api/logs/', data={'action': 'had open', 'what': activeAppName, 'when': time.strftime('%c')})
	f.seek(0)
	f.write(activeAppName)
	f.truncate()
f.close()
