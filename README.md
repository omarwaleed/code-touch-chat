1) To get this to work, you must have nodejs, npm, and mongodb installed.
2) Clone this repo anywhere and then use the command npm install --save
3) Run your mongoDB daemon
4) use nodemon (recommended) or npm start to start the localhost
5) open different tabs to try out the chat

Notes:
- Every time you enter a new name in the prompt it is saved as a new user in the database. To sign in again with the same user, simply enter his name again
- This project uses angular 1.6 and socket.io to handle data manipulation and real time talking between client and server respectively
