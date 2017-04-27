1) To get this to work, you must have nodejs, npm, and mongodb installed.
2) Clone this repo anywhere and then use the command npm install --save
3) Run your mongoDB daemon
4) use nodemon (recommended) or npm start to start the localhost
5) open different tabs to try out the chat
6) By default everyone is sending to a public chat, to specify a user, click his name from the right panel and you will be redirected to his private chat. To go back, press on the button "To Everyone"
7) There is a text field showing which user you are selecting currently, by default it is set to "Everyone"
8) To send a chat message, please use the enter key on your keyboard instead of the send button

Notes:
- Every time you enter a new name in the prompt it is saved as a new user in the database. To sign in again with the same user, simply enter his name again
- This project uses angular 1.6 and socket.io to handle data manipulation and real time talking between client and server respectively
