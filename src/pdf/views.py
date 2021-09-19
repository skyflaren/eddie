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
    # if request.method == 'POST':
        # response = { "status": "wad" }
        
        # try:
        #     prs = request.data.get()
        # except:
        #     response = { "status": "sad" }

        # try:
        #     processed = EmotionAnalysis(prs);
        # except:
        #     response = { "status": "mad" }

        # try:
        #     processed.process_pages([1])
        # except:
        #     response = { "status": "bad" }

        # response = { "status": processed.jsonify(1, 1) }
        
        # return JsonResponse(response)

    if request.method == 'POST':
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
