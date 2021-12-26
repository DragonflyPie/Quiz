from rest_framework import serializers
from quiz.models import Question, User


class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = "__all__"

class UserSerializer(serializers.ModelSerializer):
    winrate = serializers.ReadOnlyField()
    class Meta:
        model = User
        fields = ['username', 'winrate', 'id', 'date_joined', 'guesses', 'userQuestions']