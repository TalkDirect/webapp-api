import http
import requests

'''
    Purpose:
        A Quick and Easy unit Test designed to test the core funtionality of code in PlayDirect's main features.

    Actions Preformed:
        - Attempts to sign into an always active "dummy" session <- SHOULD PASS
        - Attempts to host a "dummy" session <- SHOULD FAIL
        - Attempts to type in a URL to access an non real session <- SHOULD FAIL
        - Attempts to spoof a valid and attempt to access a non real session <- THIS SHOULD FAIL

    Maker:
        @Chieffz
'''


