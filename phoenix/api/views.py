#-*- coding: utf-8 -*-

from django.core.urlresolvers import reverse
from django.utils.datastructures import SortedDict
from django.utils.timezone import now

import sys

from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status

from phoenix.api.generics import *
from phoenix.api.serializers import *
from phoenix.main.models import *
from phoenix.main.utils import camelcase_to_underscore

class ApiRootView(APIView):
    #authentication_classes = []
    permission_classes = (AllowAny,)

    def get(self, request, format=None):
        """列出所有可用的API版本"""
        current = reverse('api:api_v1_root_view', args=[])
        data = dict(description='Phoenix REST API', current_version=current, available_versions=dict(v1=current))
        return Response(data)

class ApiV1RootView(APIView):
    permission_classes = (AllowAny,)

    def get(self, request, format=None):
        data = SortedDict()
        data['authtoken'] = reverse('api:auth_token_view')
        return Response(data)

class AuthTokenView(APIView):
    permission_classes = (AllowAny,)
    serializer_class = AuthTokenSerializer
    model = AuthToken

    def post(self, request):
        """
        获取认证token
        ---
        type:
          username:
            required: true
            type: string
          password:
            required: true
            type: string

          parameters:
            - name: username
              type: string
            - name: password
              type: string
        """
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            request_hash = AuthToken.get_request_hash(self.request)
            try:
                token = AuthToken.objects.filter(user=serializer.validated_data['user'], request_hash=request_hash, expires__gt=now())[0]
                token.refresh()
            except IndexError:
                token = AuthToken.objects.create(user=serializer.validated_data['user'], request_hash=request_hash)
            return Response({'token': token.key, 'expires': token.expires})

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response({})

this_module = sys.modules[__name__]
for attr, value in locals().items():
    if isinstance(value, type) and issubclass(value, APIView):
        name = camelcase_to_underscore(attr)
        view = value.as_view()
        setattr(this_module, name, view)
