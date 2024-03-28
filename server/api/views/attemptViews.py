from django.http import Http404
from rest_framework import status
from rest_framework.response import Response
from ..models.attempt import Attempt
from ..serializers.attemptSerializer import AttemptSerializer
from rest_framework.views import APIView

class GetAllAddAttemptsView(APIView):

    def get(self, request):
        attempts = Attempt.objects.all()
        serializer = AttemptSerializer(attempts, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        serializer = AttemptSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class GetByIdUpdateDeleteAttemptsView(APIView):

    def get_attempt(self, id):
        try:
            return Attempt.objects.get(pk=id)
        except Attempt.DoesNotExist:
            raise Http404

    def get(self, request, id):
        attempt = self.get_attempt(id)
        serializer = AttemptSerializer(attempt)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def put(self, request, id):
        attempt = self.get_attempt(id)
        serializer = AttemptSerializer(attempt, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id):
        attempt = self.get_attempt(id)
        attempt.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


### Prediction code
# img = Image.open(io.BytesIO(base64.b64decode(image)))
# result = yolo.predict(img)[0]

# labels = result.names
# clss = result.boxes.cls.type(torch.uint8).tolist()
# confs = result.boxes.conf.tolist()

# tmp = {}
# for cls, conf in zip(clss, confs):
#     label = labels[cls]
#     if tmp.get(label):
#         tmp[label]['count'] += 1
#         tmp[label]['conf'] += conf
#     else:
#         tmp[label] = {
#             'count': 1,
#             'conf': conf
#         }

# for key in tmp.keys():
#     tmp[key]['conf'] = tmp[key]['conf'] / tmp[key]['count']

# prediction = Prediction(
#     image = image,
#     results = json.dumps(tmp),
#     score = 0   # TODO: get prediction and compute a score (for that we need the theme!!!)
# )

# prediction.save()
# return AddPrediction(prediction=prediction)