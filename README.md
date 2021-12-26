# CS50 web 2021 Final Project - theQuiz

Web application allowing users to create and answer quiz questions.

## Technologies used

- Django
- Django REST Framework
- Django CORS Headers (removed after integration)
- JSON Web Token Authentication
- React
- React Router

## Files created

### Backend

- #### quiz\api\serializers.py
  Serialize models to send to react frontend.
- #### backend\urls.py
  List of url patterns for application. Sends all /api/ urls to api/urls.py file
- #### quiz\api\urls.py
  List of API urls and connected views.
- #### quiz\api\views.py
  All the backend logic.
- #### quiz\models.py
  Project models. User and Question.
- #### quiz\admin.py
  Model registration

### Frontend

- #### frontend\src\components\Button.js
  Button component
- #### frontend\src\components\CreateForm.js
  Create form for question. Rendered in MyQuestions page.
- #### frontend\src\components\Footer.js
  Footer component
- #### frontend\src\components\Header.js
- Header component
- #### frontend\src\context\AuthContext.js
  Provider for global data: JWT tokens for authorization, user data, logout and login functions.
- #### frontend\src\pages\GamePage.js
  Main game page. Fetch questions, accept choices and return game results.
- #### frontend\src\pages\HomePage.js
  Project home page.
- #### frontend\src\pages\Leaderboard.js
  Leaderboards page.
- #### frontend\src\pages\LoginPage.js
  Login page
- #### frontend\src\pages\MyQuestions.js
  Questions, created by current user. Includes create question form.
- #### frontend\src\pages\ProfilePage.js
  Profile page.
- #### frontend\src\pages\RegisterPage.js
- Registration page.
- #### frontend\src\utils\PrivateRoute.js
  Renders homepage if user is logged in. Otherwise - to the login page.
- #### frontend\src\App.js
  React app structure. Routing system.
- #### frontend\public\static\favicon.ico
  Favicon
- #### frontend\public\static\logo192.png
  Favicon for apple.

## How to run

1. Install requirements. (probably in a virtual environment).
   "python pip install -r requirements.txt"
2. Make migrations and migrate
   "python manage.py makemigrations"
   "python manage.py makemigrate"
3. Install react dependencies
   /frontend/ : "npm install"
4. Make react production build
   /frontend/ : "npm run build"
5. Run app
   python manage.py runserver

## Distinctiveness and Complexity

1.  Application subject is different from other projects of the course.
2.  Application uses completely different main technologies - Django REST Framework, React, React Router.
3.  Application uses different authorization system - Simple JWT tokens.
4.  Application contains more then 20 files of code, created by myself.

## Additionl information

1. Main goal and problem of the project was to learn new technologies. It took long time.
2. JWT Token authorization and Conext Provider remain partly unclear for me. After I made (and remade) several tutorials on the subject, I am not very confident with my code there. And, despite the code is 100% written by myself, I have probably repeated some tutorials.
3. Thank you for your time. Happy holidays! :)
