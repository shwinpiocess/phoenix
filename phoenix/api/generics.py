#!/usr/bin/env python
#-*- coding: utf-8 -*-
######################################################################
## Filename: generics.py
##
## Copyright (C) 2015-2016,  Giant Interactive Group, Inc.@ztgame.com
## Version:
## Author:        lichunfeng <lichunfeng@ztgame.com>
## Created at:    2015-03-07 17:58
##
## Description: 对rest_framework进行再封装
##
######################################################################

from django.conf import settings
from django.db import connection

import time
import logging

from rest_framework import views
from rest_framework import generics

logger = logging.getLogger('phoenix.api.generics')

class APIView(views.APIView):
    """
    对rest framework的views.APIView进行再封装，如果在settings开启SQL_DEBUG，则能够查看到API查询数据库的耗时时间
    """

    def initialize_request(self, request, *args, **kwargs):
        """
        记住请求的开始时间
        """
        self.time_started = time.time()

        if getattr(settings, 'SQL_DEBUG', False):
            self.queries_before = len(connection.queries)

        drf_request = super(APIView, self).initialize_request(request, *args, **kwargs)
        request.drf_request = drf_request
        return drf_request

    def finalize_response(self, request, response, *args, **kwargs):
        """
        将Reponse Code大于等于400的记录到日志中，并在返回头信息中添加请求耗时时间
        """
        if response.status_code >= 400:
            logger.warn(u'用户%s尝试访问%s时返回状态为%s' % (request.user, request.path, response.status_code))
        response = super(APIView, self).finalize_response(request, response, *args, **kwargs)
        time_started = getattr(self, 'time_started', '')
        if time_started:
            time_elapsed = time.time() - self.time_started
            response['X-API-ELAPSED-TIME'] = '%0.3fs' % time_elapsed

        if getattr(settings, 'SQL_DEBUG', False):
            queries_before = getattr(self, 'queries_before', 0)
            query_times = [float(q['time']) for q in connection.queries[queries_before:]]
            response['X-API-Query-Count'] = len(query_times)
            response['X-API-Query-Time'] = '%0.3fs' % sum(query_times)

        return response

