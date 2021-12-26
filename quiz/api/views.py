from django.db import IntegrityError
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import QuestionSerializer, UserSerializer
from quiz.models import Question, User

# JWT token serializer, includes username in the token
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username

        return token
# JWT view
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

# show all possible routes, default /api page. for developer convenience.
@api_view(['GET'])
def getRoutes(request):
    routes = [
        '/api/token', 
        '/api/token/refresh',
        '/api/game_questions/',
        '/api/my_questions/',
        '/api/rankings/',
        '/api/register/',
        '/api/profile/<int:id>/',
        '/api/create/',
        '/api/results/',        
    ]
    return Response(routes)

# register view. 
@api_view(["POST"])
def registerUser(request):
    data = request.data
    username = data["username"]
    password = data['password']
    email = data["email"]    
    # if email in use return message "2" and status 409
    try:
        emailCheck = User.objects.get(email=email)
        content = {'message': 2}
        return Response(content, status=status.HTTP_409_CONFLICT)
    except:
        # create new user if username is not taken, otherwise return error message and status 409
        try:
            user = User.objects.create_user(username, email, password)
            user.save()        
        except IntegrityError:
            content = {'message': 1}
            return Response(content, status=status.HTTP_409_CONFLICT)
        content = {'message': 'New user created'}
        return Response(content, status=status.HTTP_200_OK)
        
# game view
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getGameQuestions(request):
    # exclude answered (and created by this user) questions
    questions = Question.objects.exclude(answeredUsers = request.user).order_by('created')
    # if there is at least 5 questions - return them in response
    if len(questions) > 4:
        gameQuestions = questions[0:5]
        serializer = QuestionSerializer(gameQuestions, many=True)
        return Response(serializer.data)
    # otherwise return error
    else:
        return Response({"error":"You have answered all existing questions. Maybe you want to make yours?"}, status = status.HTTP_206_PARTIAL_CONTENT)

# user's questions view 
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getMyQuestions(request):
    user = request.user
    questions = Question.objects.filter(author = user).order_by('-created')  
    serializer = QuestionSerializer(questions, many=True)
    return Response(serializer.data)

# save game results view
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def getGameResults(request):    
    data = request.data
    # count correct answers
    correctAnswersCounter = 0
    for question in request.data:
        for key, value in question.items():
            dbQuestion = Question.objects.get(id = key)
            # save question as answered for this user
            dbQuestion.answeredUsers.add(request.user)
            dbQuestion.save()
            if value:
                correctAnswersCounter += 1
    # update user's correct answers and total question answered
    request.user.rights = request.user.rights + correctAnswersCounter
    request.user.guesses = request.user.guesses + 5
    request.user.save()
    return Response(data)

# create question
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createQuestion(request):
    data = request.data
    question = Question.objects.create(
        author = request.user,
    body = data['body'].capitalize(),
    option_1 = data['option1'],
    option_2 = data['option2'],
    option_3 = data['option3'],
    option_4 = data['option4'],
    rightAnswer = data['rightAnswer'])
    question.answeredUsers.add(request.user)      
    serializer  = QuestionSerializer(question, many=False)
    return Response(serializer.data)

# top 10 users view
@api_view(['GET'])
def getRankings(request):
    users = User.objects.exclude(guesses = 0)
    users = sorted(users, key=lambda u: u.winrate, reverse=True)
    new_users = User.objects.filter(guesses = 0)
    users.extend(new_users)
    users = users[0:10]
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)

# profile information view
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getProfile(request, id):
    user = User.objects.get(id = id)
    serializer = UserSerializer(user)
    return Response(serializer.data)