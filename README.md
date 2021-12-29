# CS50 web 2021 Final Project - theQuiz

Web application allowing users to create and answer quiz questions.
User can:

1. Register
2. Log In / Log Out
3. Play the quiz game
4. See the results of the game
5. Look at top-10 players statistics, including winrate and total games played
6. Check top-10 user's profiles or his/her own profile
7. Create his own questions and see the list of questions, created.

Every game consists of 5 question, each of them has 4 options to pick. After user picks an option for all 5 questions, the game can be submitted.  
After the submit user can see the results of the game and check which questions were guessed right, which were wrong and what are the correct answers for the wrong ones. Now next game is avaliable for the user.

## Technologies used

- Django
- Django REST Framework
- Django CORS Headers (removed after integration)
- JSON Web Token Authentication
- React
- React Router

## Distinctiveness and Complexity

1. This application **is not** a social network and **is not** a e-commerce site. It is a quiz game!
2. This application is 100% single page - there is literally 1 URL adress besides API routes and /admin route.
3. Authorization system utilizes simple JWT tokens and fundamentally differs from default django authorization, used in previous projects.
4. This application uses completely different core technologies - Django REST Framework, React, React Router. The most important difference - using React as a base front-end technology and components as building blocks.
5. Application is mobile-responsive.
6. There is much more frontend interactions in this application, particulary in the game page ("Play" tab). Depending on the react states this page can show new game questions, game results or no questions if there is not enough in the DB right now. UI shows picked options and correct options displaying the results.

## Files created

### Backend

- #### **_quiz\api\serializers.py_**
  Serialization of django models to send to react frontend.
- #### **_backend\urls.py_**
  List of url patterns for application. Sends all /api/ urls to api/urls.py file
- #### **_quiz\api\urls.py_**
  List of API urls and connected views.
- #### **_quiz\api\views.py_**
  All the backend API logic.  
  Views:
  - getRoutes - display lists of api routes
  - registerUser - register new user
  - getGameQuestions - get 5 questions for the user to play, excludes questions he has already seen and question created by this user.
  - getMyQuestions - get all questions created by this user
  - getGameResults - accept game results and save them in the DB
  - createQuestion - create new question
  - getRankings - get 10 users with the best winrate
  - getProfile - get profile data for user with a specific id
  - MyTokenObtainPairView - JWT view to access and refresh tokens.
- #### **_quiz\models.py_**
  Project models. User and Question.
- #### **_quiz\admin.py_**
  Model registration

### Frontend

- #### **_frontend\src\components\Button.js_**
  Button component
- #### **_frontend\src\components\CreateForm.js_**
  Create form for question. Rendered in MyQuestions page.
- #### **_frontend\src\components\Footer.js_**
  Footer component
- #### **_frontend\src\components\Header.js_**
- Header component
- #### **_frontend\src\context\AuthContext.js_**
  Provider for global data: JWT tokens for authorization, user data, logout and login functions.
- #### **_frontend\src\pages\GamePage.js_**
  Main game page. Fetch questions, accept choices and return game results.
- #### **_frontend\src\pages\HomePage.js_**
  Project home page.
- #### **_frontend\src\pages\Leaderboard.js_**
  Leaderboards page.
- #### **_frontend\src\pages\LoginPage.js_**
  Login page
- #### **_frontend\src\pages\MyQuestions.js_**
  Questions, created by current user. Includes create question form.
- #### **_frontend\src\pages\ProfilePage.js_**
  Profile page.
- #### **_frontend\src\pages\RegisterPage.js_**
- Registration page.
- #### **_frontend\src\utils\PrivateRoute.js_**
  Renders homepage if user is logged in. Otherwise - to the login page.
- #### **_frontend\src\App.js_**
  React app structure. Routing system. (`<Hashrouter>` is used in the index.js file)
- #### **_frontend\src\Index.js_**
  Main JS file. Contains <App> module wrapped by `<Hashrouter>`
- #### **_frontend\public\static\favicon.ico_**
  Favicon
- #### **_frontend\public\static\logo192.png_**
  Favicon for apple.

## URLs

- "/admin" - django admin panel
- "/api" - api routes:
  - "/" - getRoutes
  - "game_questions/" - getGameQuestions view
  - "my_questions/" - getMyQuestions view
  - "results/" - getGameResults view
  - "create/" - createQuestion view
  - "rankings/" - getRankings view
  - "profile/`<int:id>`" - getProfile view
  - "token/" - simple JWT route, returns tokens for user that just logged in
  - "token/refresh/" - takes refresh token and responses with new access and refresh tokens
  - "register/" - registerUser view
- "/" - main (and only) application route.

  \*Frontend routing of the application is done with `<Hashrouter>`. Structure of routes is inside the **_frontend\src\App.js_**.

## How to run

For Win10:

0. **OPTIONAL** - install and run virtual environment  
   _pip install virtualenv_  
   _virtualenv env_ (where **env** - name of the environment)  
   _env/scripts/activate_
1. Install requirements  
   _python pip install -r requirements.txt_
2. Make migrations and migrate  
   _python manage.py makemigrations_  
   _python manage.py makemigrate_
3. Install react dependencies (in the /frontend folder)  
   _npm install_
4. Make react production build (in the /frontend folder)  
   _npm run build_
5. Run app  
   _python manage.py runserver_

## Additionl information

1. Main goal and problem of the project was to learn new technologies. It took long time.
2. JWT Token authorization and Context Provider remain partly unclear for me. After I made (and remade) several tutorials on these subjects, I am not very confident with my code there.
3. Thank you for your time. Happy holidays! :)
