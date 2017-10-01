#!/usr/bin/python
import requests
import time

from AppKit import NSWorkspace
activeAppName = NSWorkspace.sharedWorkspace().activeApplication()['NSApplicationName']

requests.post('http://localhost:8080/api/logs/', data={'action': 'had open', 'what': activeAppName, 'when': time.strftime('%c')})
