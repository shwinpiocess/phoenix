#!/usr/bin/env python
#-*- coding: utf-8 -*-
######################################################################
## Filename: utils.py
##
## Copyright (C) 2015-2016,  Giant Interactive Group, Inc.@ztgame.com
## Version:
## Author:        lichunfeng <lichunfeng@ztgame.com>
## Created at:    2015-03-08 08:56
##
## Description: phoenix运维系统的常用函数封装
##
######################################################################

import re

def camelcase_to_underscore(s):
    """
    将驼峰式的命令转换成小写字母和下划线
    eg:
        SimpleTest    ->   simple_test
    """
    s = re.sub('(((?<=[a-z])[A-Z])|([A-Z](?![A-Z]|$)))', '_\\1', s)
    return s.lower().strip('_')
