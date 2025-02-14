from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import PartialSetSerializer
from .partial_sets import PartialSet

class PartialSetView(APIView):
  def get(self, req):
    partial_set = PartialSet({3, 6, 9})
    serializer = PartialSetSerializer({'elements': list(partial_set)})
    return Response(serializer.data)