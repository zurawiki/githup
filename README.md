Roger Zurawicki

rzurawicki@gmail.com

Lowell B-23

GitHup
------

http://rozu.co/githup/design.html
https://github.com/rzurawicki/githup

## Purpose

GitHup is a interactive way to view everyone's favorite commit messages from around the world.

GitHup scrapes commits from http://commitlogsfromlastnight.com (CLFLN),
which curates expletives found in GitHub's commit messages. CLFLN does not
property display user images so GitHup also comes with a node.js backend to scrape
CLFLN and query GitHub's user API.

GitHup's timeline dynamically scrolls using the mouse/trackpad and the button icons.
The background color of the site dynamically changes as the user scroll through the timeline.
Over time, GitHup will dyanimcally update the timeline with new commits as well.

Time formatting was made possible by moment.js
jQuery and various plugins are also used


## What's included
  * design.html - the main webpage
  |-- js  - javascript (and libraries)
  |   |---- clfln.js - the node.js backend
  --- css - stylesheets

## Functionality
  * Backend in node.js to scrape web data
  * Pulling data from custom API
  * Scrolling with mousewheel and trackpad
  * Scrolling with button icons
  * Startup animation
  * Background color animation
  * Timeline animations
  * Click on commit to magnify
  * Dynamically update the timeline with new data


## How to Setup Backend
  * Install node.js <http://nodejs.org/> (or use homebrew on mac)
        Run command: node js/clfln.js
        This script setups up an HTTP server on port 9080.
        The current website calls this API at cloud.rozu.co


## Known Bugs
  * CLFLN only updates every few days, so the time display has been offset by one day so the time can displays in hours instead of days.
 (21 hours ago vs. a day ago).
  * The backend needs to be restarted to update from CLFLN. On startup, the server caches the screen scrape.
