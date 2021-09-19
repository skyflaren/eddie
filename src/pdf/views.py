from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse
from .emotion_analysis import EmotionAnalysis
import ast

processed = EmotionAnalysis([""])

# Create your views here.
def index_view(request):
    context = {}
    return render(request, 'pdf/index.html', context)

def music_view(request):
    context = {}
    return render(request, 'pdf/music.html', context)

def upload_view(request):
    if request.method == 'POST':
        # response = { "status": "wad" }
        
        print("WHY")
        print("----", request.POST)
        res = request.POST.get('text')
        res = ast.literal_eval(res)
        processed.set_all_pages(res)
        #Temporary
        processed.process_all_pages()
        processed.plot()
        # processed.process_pages([rest])
        # processed = processed.jsonify(res, res)
        response = {"result": "200"} 

        return JsonResponse(response);

def page_view(request):
    if request.method == 'POST':
        pn = int(request.POST.get('page'))
        res = request.POST.get('text')
        res = ast.literal_eval(res)
        # processed = EmotionAnalysis(res)
        processed.process_pages([pn, pn+1])
        mood = processed.jsonify(pn, pn)
        response = {"result": mood} 
        print(response);

        return JsonResponse(response)
    
    

    # if request.method == 'POST':
    #     response = {
    #         'worked': 'true'
    #     }
        # return JsonResponse(response)

# # class FileView(APIView):
# def process_init(request, format=None):
#     if request.METHOD == "POST":
        # prs = request.data.get()
        # processed = EmotionAnalysis(prs);
#     return HttpResponse('Pog')
