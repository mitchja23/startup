# Elevator Pitch

 Many people struggle to stay orginized and get certain tasks done. This piece of software is used to combat that by allowing an interactive to do list. Add your friends to see if they are keeping up with their daily goals, while also being held accountable to yours. By completing tasks, your friends are able to judge if you actually completed your goals. Once completed you are gifted coins that can be spent on mini games and other in game cosmetics that can be used to decorate your profile and show off to others.


# Design 
![Alt text](pictures/HomePage.png)
![Alt text](pictures/MiniGames.png)
![Alt text](pictures/Prizes.png)











# Key Features.
* Login page with HTTPS
* Make and Check off Todo list
* Share list with others
* Get rewarded for Completing Tasks
* Be able to get cosmitics and other in game decorations





# Technologies 

HTML: 3 Main HTML pages for the check list, mini games, and prizes. everything is hyperlinked using HTML

CSS: Used to make the front end presentable on all devices and format so users are able to effectivly use it. 

Javascript: Mainly will be used for the Mini game section of the Site. Will also be used for logining in and displaying others actions

Database: Store all of users trophies and goals, will not store indivual task since it would use to much space. It will simply run a tally on how many tasks completelted, not what each task was.  All login details will also be stored

Websocket: Used to broadcast when you complete a task to your friends that the task was completed 

React: Application will be ported to the React Framework

# HTML Deliverable 
For this deliverable I built out the structure of my application using HTML.

* HTML pages - 4 pages of HTML. Index is the login and the rest are all info screens 
* Links - login page automatically brings to the home page. From there you can navigate from prize, games, and home page
* Text - Most of the text on the final product will just be the tasks people make.
* Images - The images are used as place holders for what the little prizes and trophies will look like
* DB/Login - The login info will be saved aswell as the coins. Place holders have been made to show.
* WebSocket - The websocket will be the friend actvity that is displayed when tasks are complete

* Note - The games page itself has not been layouted since many of the games are going to be in java scipt so as of now they are just labeled game 1 2 and 3



# CSS Deliverable 

* Header footer and main content has be colored and formated to fit and look nice

* Navigation elements have been moved under profile picture and became buttons

* The Window itself is responsive and looks goot on all devices 

* All the requirement html elements have been formated such has database and websocket areas

* All the text itself has been colored to fit the color scheme

* Boarders were made for all the prize images and profile  picture was centered and rounded



# JS Deliverable

* The login saves the persons user name and displays  it on the profile on login

* saves coins, tasks, trophies, profile pictures, and user names to the local storage 

* The friend activity tab has a 5 second inteval to make new text bubbles to be able to simulate Web socket

* Allows people to make tasks, get coins and be able to buy the prizes and be able to show those prizes on the profile page. The seach bar works for now only for the mitchja profile is able to seen

# Service Deliverable

* The backend automatically serves up the front end using express middleware

* I called a third party quote website to give motivational quotes to the user

* I created the backend endpoints for all the data that will get pushed to the database

* Local storage has been linked up with the node.js so any local storage items will get pushed to the node.js and later saved to database

* The HTTP service calls the backennd to send over the data that changed the total counts.

* Note - task now save to local storage but lose functionality when returning to the tasks.html, This will be completely overhauled when mongoDB is added, to test the coin count changing, simply stay on the task page and submit the tasks over and over to simulate coins.  