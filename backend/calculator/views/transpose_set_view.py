from rest_framework.response import Response
from rest_framework.views import APIView, status
from ..partial_sets import PartialSet, PartialClassSet
from ..utils import par_to_parc, low_inverse

class TransposeSetView(APIView):
    def post(self, req):
        input_data = req.data.get('input', '')
        transpose_value = req.data.get('transpose_value', None)

        if not input_data or transpose_value is None:
            return Response({ 'error': 'No input or transpose value provided' }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            input_set = set(map(int, input_data.split(',')))
            transposed_set = [x * int(transpose_value) for x in input_set]
            partial_set = PartialSet(transposed_set)
            partial_class_set = PartialClassSet(par_to_parc(partial_set))
            low_parset = PartialSet(low_inverse(partial_set))
            low_parcset = PartialClassSet(low_inverse(partial_class_set))

            response_data = {
                'partial_set': str(partial_set),
                'partial_class_set': str(partial_class_set),
                'low_parset': str(low_parset),
                'low_parcset': str(low_parcset)
            }

            return Response(response_data, status=status.HTTP_200_OK)
        
        except ValueError:
            return Response({ 'error': 'Invalid input format or transpose value'}, status=status.HTTP_400_BAD_REQUEST)