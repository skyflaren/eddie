from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse

# Create your views here.
def index_view(request):
    context = {}
    return render(request, 'pdf/index.html', context)

def music_view(request):
    context = {}
    return render(request, 'pdf/music.html', context)

def upload_view(request):
    if request.method == 'POST':
        prs = request.data.get()
        processed = EmotionAnalysis(prs);
        processed.process_pages([1])
        # response = {
        #     'is_taken': User.objects.filter(username__iexact=username).exists()
        # }
        # return JsonResponse(response)
        # return HttpResponse('Pog')
        print("JKSDFKSDFSDJFSDF HI")
    response = {
        'worked': 'true'
    }
    return JsonResponse(response)

# # class FileView(APIView):
# def process_init(request, format=None):
#     if request.METHOD == "POST":
        # prs = request.data.get()
        # processed = EmotionAnalysis(prs);
#     return HttpResponse('Pog')
