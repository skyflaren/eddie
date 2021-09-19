from django.contrib import admin
from django.urls import path, include

import pdf
from .views import *

urlpatterns = [
    path('', index_view, name="index_view"),
    path('music', music_view, name="music_view"),
    path('process', upload_view, name="upload_view"),
    path('loadnew', page_view, name="page_view"),
]
