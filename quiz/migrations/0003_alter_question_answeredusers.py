# Generated by Django 3.2.9 on 2021-12-03 08:09

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('quiz', '0002_auto_20211203_1050'),
    ]

    operations = [
        migrations.AlterField(
            model_name='question',
            name='answeredUsers',
            field=models.ManyToManyField(blank=True, related_name='answeredQuestions', to=settings.AUTH_USER_MODEL),
        ),
    ]
