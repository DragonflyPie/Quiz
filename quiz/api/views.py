from django.http import JsonResponse
from django.db import IntegrityError
from rest_framework import serializers, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

from quiz import api
from .serializers import QuestionSerializer, UserSerializer
from quiz.models import Question, User

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username

        return token

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

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
    ]
    return Response(routes)

@api_view(["POST"])
def registerUser(request):
    data = request.data
    username = data["username"]
    password = data['password']
    email = data["email"]      
    try:
        user = User.objects.create_user(username, email, password)
        user.save()
        
    except IntegrityError:
        content = {'message': 'Username is already taken'}
        return Response(content, status=status.HTTP_409_CONFLICT)
    content = {'message': 'New user created'}
    return Response(content, status=status.HTTP_200_OK)

        

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getGameQuestions(request):
    # user = request.user
    questions = Question.objects.exclude(answeredUsers = request.user)
    if len(questions) > 4:
        gameQuestions = questions[0:5]
        serializer = QuestionSerializer(gameQuestions, many=True)
        return Response(serializer.data)
    else:
        return Response({"error":"You have answered all existing questions. Maybe you want to make yours?"}, status = status.HTTP_206_PARTIAL_CONTENT)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getMyQuestions(request):
    user = request.user
    questions = Question.objects.filter(author = user).order_by('-created')  
    serializer = QuestionSerializer(questions, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def getGameResults(request):
    
    data = request.data
    correctAnswersCounter = 0
    for question in request.data:
        for key, value in question.items():
            dbQuestion = Question.objects.get(id = key)
            dbQuestion.answeredUsers.add(request.user)
            dbQuestion.save()
            if value:
                correctAnswersCounter += 1
            else:
                pass# print(dbQuestion, ' dolboeb')
    # print(correctAnswersCounter, request.user.rights)
    request.user.rights = request.user.rights + correctAnswersCounter
    request.user.guesses = request.user.guesses + 5
    request.user.save()
    return Response(data)

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


@api_view(['GET'])
def getRankings(request):
    users = User.objects.exclude(guesses = 0)
    users = sorted(users, key=lambda u: u.winrate, reverse=True)
    new_users = User.objects.filter(guesses = 0)
    users.extend(new_users)
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getProfile(request, id):
    user = User.objects.get(id = id)
    serializer = UserSerializer(user)
    return Response(serializer.data)