from django.contrib import admin
from django.urls import path, include

import pdf
from .views import *

urlpatterns = [
    path('', index_view),
    path('music', music_view),
    path('music', music_view),
]
