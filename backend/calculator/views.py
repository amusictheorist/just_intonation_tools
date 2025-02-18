import json
from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework.views import APIView, status
from .partial_sets import PartialSet, PartialClassSet, PartialSetClass, PartialClassSetClass
from .utils import par_to_parc

class PartialSetView(APIView):
    def post(self, req):
        input_data = req.data.get('input', '')

        if not input_data:
            return Response({'error': 'No input provided'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            partial_set = PartialSet(set(map(int, input_data.split(','))))
            response_data = {
                'partial_set': str(partial_set),
                'partial_class_set': str(PartialClassSet(par_to_parc(partial_set))),
                'partial_set_class': str(PartialSetClass(partial_set)),
                'partial_class_set_class': str(PartialClassSetClass(partial_set))
            }
            return Response(response_data, status=status.HTTP_200_OK)

        except ValueError:
            return Response({'error': 'Invalid input format'}, status=status.HTTP_400_BAD_REQUEST)