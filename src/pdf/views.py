from django.shortcuts import render

# Create your views here.
def index_view(request):
    context = {}
    return render(request, 'pdf/index.html', context)

def music_view(request):
    context = {}
    return render(request, 'pdf/music.html', context)