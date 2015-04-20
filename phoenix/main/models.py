#!/usr/bin/env python
#-*- coding: utf-8 -*-
######################################################################
## Filename: models.py
##
## Copyright (C) 2015-2016,  Giant Interactive Group, Inc.@ztgame.com
## Version:
## Author:        lichunfeng <lichunfeng@ztgame.com>
## Created at:    2015-04-07 17:53
##
## Description: phoenix运维系统的数据模型定义
##
######################################################################

from django.db import models
from django.conf import settings
from django.utils.timezone import now

import hmac
import uuid
import hashlib
import datetime

class CreatedModifiedModel(models.Model):
    """
    具有created和modified时间字段数据模型抽象类，如果没有指定的话值为当前时间
    """

    class Meta:
        abstract = True

    created = models.DateTimeField('创建时间', default=None, editable=False)
    modified = models.DateTimeField('修改时间', default=None, editable=False)

class PrimordialModel(CreatedModifiedModel):
    """
    原始数据模型抽象类
    """

    class Meta:
        abstract = True

    description = models.TextField('描述信息', blank=True, default='')
    created_by = models.ForeignKey('auth.User', related_name='%s(class)s_created+', default=None, null=True, editable=False, on_delete=models.SET_NULL)
    modified_by = models.ForeignKey('auth.User', related_name='%s(class)s_modified+', default=None, null=True, editable=False, on_delete=models.SET_NULL)

class CommonModel(PrimordialModel):
    """
    name字段唯一的基类
    """

    class Meta:
        abstract = True

    name = models.CharField(max_length=255, unique=True)

class CommonModelNameNotUnique(PrimordialModel):
    """
    name字段不唯一的基类
    """

    class Meta:
        abstract = True

    name = models.CharField(max_length=255, unique=False)

class AuthToken(models.Model):
    """
    自定义认证令牌数据模型
    """

    key = models.CharField(max_length=40, primary_key=True)
    user = models.ForeignKey('auth.User', related_name='auth_tokens', on_delete=models.CASCADE)
    created = models.DateTimeField('创建时间', auto_now_add=True)
    modified = models.DateTimeField('修改时间', auto_now=True)
    expires = models.DateTimeField('过期时间', default=now)
    request_hash = models.CharField(max_length=40, blank=True, default='')

    @classmethod
    def get_request_hash(cls, request):
        h = hashlib.sha1()
        h.update(settings.SECRET_KEY)
        for header in settings.REMOTE_HOST_HEADERS:
            value = request.META.get(header, '').strip()
            if value:
                h.update(value)

        h.update(request.META.get('HTTP_USER_AGENT', ''))
        return h.hexdigest()

    def save(self, *args, **kwargs):
        if not self.pk:
            self.refresh(save=False)
        if not self.key:
            self.key = self.generate_key()
        return super(AuthToken, self).save(*args, **kwargs)

    def refresh(self, save = True):
        if not self.pk or not self.expired:
            self.expires = now() + datetime.timedelta(seconds=settings.AUTH_TOKEN_EXPIRATION)
            if save:
                self.save()

    def invalidate(self, save = True):
        if not self.expired:
            self.expires = now() - datetime.timedelta(seconds=1)
            if save:
                self.save()

    def generate_key(self):
        unique = uuid.uuid4()
        return hmac.new(unique.bytes, digestmod=hashlib.sha1).hexdigest()

    @property
    def expired(self):
        return bool(self.expires < now())

    def __unicode__(self):
        return self.key

