from django.http import HttpRequest, JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_protect


@csrf_protect
def upload_files(request: HttpRequest):
    if request.method == 'POST' and request.FILES['pcapFile']:
        pcap_file = request.FILES['pcapFile']
        print(pcap_file)
        return JsonResponse({'success': True})
    else:
        return JsonResponse({'success': False})
