from django.db import models
from django.db.models.deletion import CASCADE
from django.db.models.enums import Choices
from django.db.models.fields import TextField
from django.contrib.auth.models import AbstractUser
from decimal import *

# from django.core.validators import MaxValueValidator, MinValueValidator

class User(AbstractUser):
    rights = models.IntegerField(default=0)
    guesses = models.IntegerField(default=0)

    @property
    def winrate(self):
        if self.guesses != 0:
            
            return round(self.rights / self.guesses * 100, 2) 


# Create your models here.
class Question(models.Model):
    answerChoices = [(i, i) for i in range(1,5)]
    ratingChoices = [(i, i) for i in range(1,11)]

    author = models.ForeignKey(User, on_delete=models.CASCADE, null=True, related_name="userQuestions")
    body = models.TextField(null=True)
    option_1 = models.TextField(null=True)
    option_2 = models.TextField(null=True)
    option_3 = models.TextField(null=True)
    option_4 = models.TextField(null=True)    
    rightAnswer = models.IntegerField(choices=answerChoices, null=True)
    answeredUsers = models.ManyToManyField(User, related_name="answeredQuestions", blank=True)
    created = models.DateTimeField(auto_now_add=True, null=True)
    # rating = models.IntegerField(validators=[MaxValueValidator(0), MaxValueValidator(5)], null=True)

class Rating(models.Model):
    ratingChoices = [(i, i) for i in range(1,11)]

    value = models.IntegerField(choices=ratingChoices, null=True) 
    rater = models.ForeignKey(User, on_delete=CASCADE, unique=True)
    ratedQuestion = models.ForeignKey(Question, on_delete=CASCADE, unique=True)