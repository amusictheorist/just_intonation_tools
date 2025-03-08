from rest_framework.response import Response
from rest_framework.views import APIView, status
from ..partial_sets import PartialSet, PartialClassSet, PartialSetClass, PartialClassSetClass
from ..utils import par_to_parc, low_inverse

class PartialSetView(APIView):
    def get(self, req):
        return Response({"message": "Send a POST request with data to calculate."}, status=status.HTTP_200_OK)
    
    def post(self, req):
        input_data = str(req.data.get('input', ''))

        if not input_data:
            return Response({'error': 'No input provided'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            parsed_input = set(map(int, input_data.split(',')))
            print(f"Parsed input: {parsed_input}")
            partial_set = PartialSet(parsed_input)
        except ValueError as e:
            print(f"Error passing input: {e}")
            return Response({'error': 'Invalid input format'}, status=status.HTTP_400_BAD_REQUEST)
            
        partial_class_set = PartialClassSet(par_to_parc(partial_set))
        partial_set_class = PartialSetClass(partial_set)
        partial_class_set_class = PartialClassSetClass(partial_set)
        HCp = partial_set.HCp()
        cardHCp = partial_set.cardHCp()
        HCpc = partial_class_set.HCpc()
        cardHCpc = partial_class_set.cardHCpc()
        low_parset = PartialSet(low_inverse(partial_set))
        low_parcset = PartialClassSet(low_inverse(partial_class_set))

        response_data = {
            'partial_set': str(partial_set),
            'partial_class_set': str(partial_class_set),
            'partial_set_class': str(partial_set_class),
            'partial_class_set_class': str(partial_class_set_class),
            'HCp': str(HCp),
            'HCpc': str(HCpc),
            'cardHCp': str(cardHCp),
            'cardHCpc': str(cardHCpc),
            'low_parset': str(low_parset),
            'low_parcset': str(low_parcset)
        }

        return Response(response_data, status=status.HTTP_200_OK)