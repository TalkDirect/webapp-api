import http
#import requests
import time
import unittest
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By

'''
    Purpose:
        A Quick and Easy unit Test designed to test the core funtionality of code in PlayDirect's main features.

    Actions Preformed:
        - Attempts to sign into an always active "dummy" session <- SHOULD PASS
        - Attempts to type in a URL to access an non real session <- SHOULD FAIL
        - Attempts to spoof a valid and attempt to access a non real session <- THIS SHOULD FAIL

    Maker:
        @Chieffz
'''

class TestCoreFunctions(unittest.TestCase):

    error_msg_list = [
        "Session Does not exist, please try again!",
        "RANDOM ERROR CONTACT OWNERS",
        "Error in Attempt to find Session.",
        "Default unaccounted Error, please notify owners.",
    ]
    def test_landing(self):
        # Testing that the landing page loads and that it functions

        # Init the website page & preform a get to retrieve the site
        tester = webdriver.Firefox()
        tester.get("http://localhost:5173")

        # Ensuring that we properly set up our tester and it safely navigated to site
        assert "PlayDirect" in tester.title

        # Ensure that our logo loaded
        playdir_logo = tester.find_element(By.ID, value="logo")
        assert playdir_logo is not None

        # Ensure that our form loaded
        form = tester.find_element(By.ID, "session-form")
        assert form is not None

        # Ensure that our text loaded
        assert "Enter your Session ID Here!" in tester.page_source

        tester.close()


    def test_joining_session(self):
        # Testing the process of joining a session, this is a dummy session that's always there

        # Init the website page & preform a get to retrieve the site
        tester = webdriver.Firefox()
        tester.get("http://localhost:5173")

        # Attempt to type into the form sessionid text box
        form_sessionid_entry = tester.find_element(By.ID, "sessionid")
        form_sessionid_entry.send_keys("500")

        # Attempt to join a session 
        form_submit_button = tester.find_element(By.ID, value="submit-button")
        form_submit_button.send_keys(Keys.RETURN)

        # Loop thru error_list to ensure no errors occured
        for str in self.error_msg_list:
            assert str not in tester.page_source
        
        tester.close()
        



    #def test_joining_error_handling(self):

    #def test_sploofing(self):



if __name__ == '__main__':
    unittest.main()