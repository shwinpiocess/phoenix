/**
 * 临时脚本事件
 * @author v_jfdong
 * @description
 * @requires TempScriptUI.js,common/utils.js,common/elastic-textarea.js,
 */

Ext.define('Ext.ijobs.task.TempScriptAction', {extend: 'Ext.ijobs.task.TempScriptUI', 
    constructor: function(config) {
        Ext.ijobs.task.TempScriptAction.superclass.constructor.call(this, config);
    },
    /**
     * 初始化控件
     */
    initComponent: function() {
        Ext.ijobs.task.TempScriptAction.superclass.initComponent.call(this);
        var ipList = this.findById('ipListPanel');//down('fieldcontainer[name="ctIPGrid"]');
        
        Ext.apply(this.COMPONENTS, {
            'panelIPList': ipList,
            'rdoScriptFrom': this.getComponent('rdoScriptFrom'),
            'rdoScriptType' : this.getComponent('rdoScriptType'),
            'cmbSelectScript': this.findById('cmbScript'),
            'cmbScriptVersion' : this.findById('cmbScriptVersion'),
            'cmbApplication': this.getComponent('cmbApplication'),
            'cmbScript': ipList.findById('ipListPanel_cmbScript'),
            'cmbAccount': this.findById('cmbAccount'),
            'panelImportScript': Ext.getCmp('importScriptPanel'),
            'panelCopyScript': Ext.getCmp('selectScriptPanel'),
            'txtScriptCode': Ext.getCmp('txtScriptCode')
        });
    },

    /**
     * 绑定事件
     */
    initEvents: function() {
        Ext.ijobs.task.TempScriptAction.superclass.initEvents.call(this);
        var c = this.COMPONENTS;
        c.rdoScriptFrom.on('change', this._doChange, this);
        c.rdoScriptType.on('change',this._doScriptTypeChange,this);
        c.cmbApplication.on('change', this._onApplicationChange, this);
        c.cmbSelectScript.getStore().on('load', this._onSelectScriptLoad, this);
        c.cmbSelectScript.on('select',this._doScriptNameChange,this);
        c.cmbAccount.getStore().on('load', this._onAccountLoad, this);
        c.panelImportScript.down('button[ref="btnImportScript"]').on('click', this._importScript, this);        
        c.panelCopyScript.down('button[ref="../btnCopyScript"]').on('click', this._copyScript, this);
        this.down('button[ref="../btnExecute"]').on('click', this._executeScript, this);
        this.on('boxready', this._onAfterRender, this);
        c.cmbApplication.getStore().load();
        
        c.txtScriptCode.setValue(this.SCRIPT_TEMPLATE.SHELL);
    },
    COMPONENTS: {},
    /**
     * 脚本模板
     * @type 
     */
    SCRIPT_TEMPLATE:{
        SHELL : function(){
            var shell = [];
            shell.push('#!/bin/sh',
                '',
                'anynowtime="date +\'%Y-%m-%d %H:%M:%S\'"',
                'NOW="echo [\\`$anynowtime\\`][PID:$$]"',
                '',
                'function tms_start',
                '{',
                '    echo "`eval $NOW` tms_start"',
                '}',
                '',
                'function tms_success',
                '{',
                '    MSG="$*"',
                '    echo "`eval $NOW` tms_success:[$MSG]"',
                '    exit 0',
                '}',
                '',
                'function tms_fail',
                '{',
                '    MSG="$*"',
                '    echo "`eval $NOW` tms_fail:[$MSG]"',
                '    exit 1',
                '}',
                '',
                'tms_start',
                '',
                '######iJobs中执行脚本成功和失败的标准只取决于',
                '######脚本最后一条执行语句的返回值，如果返回值为0，',
                '######则认为此脚本执行成功，如果非0，则认为脚本执行失败',
                '',
                //'tms_success',
                'script1_xx_xx_xxx.sh  ##你的第一个脚本',
                'if [ $? -eq 0 ]; then',
                '    script2_xx_xx_xxx.sh  ##你的第二个脚本',
                '    if [ $? -eq 0 ]; then',
                '        tms_success "Success_all"',
                '    else',
                '        tms_fail "Failed_script2"',
                '    fi',
                'else',
                '    tms_fail "Failed_script1"',
                'fi',
                ''
            );           
            return  shell.join('\n');
        }(),
        BAT : function(){        
            return '';
        }(),
        PERL : function(){
            var perl = [];
            perl.push(
                '#!/usr/bin/perl',
                '',
                'use strict;',
                '',
                'sub tms_localtime {',
                '    my @n = localtime();',
                '    return sprintf("%04d-%02d-%02d %02d:%02d:%02d",$n[5]+1900,$n[4]+1,$n[3], $n[2], $n[1], $n[0] );',
                '}',
                '',
                'sub tms_start {',
                '    print "[",&tms_localtime,"][PID:$$] tms_start\\n";',
                '}',
                '',
                'sub tms_success {',
                '    print "[",&tms_localtime,"][PID:$$] tms_success:[@_]\\n";',
                '    exit 0;',
                '}',
                '',
                'sub tms_fail {',
                '    print "[",&tms_localtime,"][PID:$$] tms_fail:[@_]\\n";',
                '    exit 1;',
                '}',
                '',
                'tms_start;',
                ''
            );
            return perl.join('\n');
        }(),
        PYTHON : function(){
            var python = [];
            python.push(
                '#!/usr/bin/env python',
                '# -*- coding: utf8 -*-',
                '',
                'import datetime',
                'import os',
                'import sys',
                '',
                'def _now(format="%Y-%m-%d %H:%M:%S"):',
                '    return datetime.datetime.now().strftime(format)',
                '',
                'def tms_start():',
                '    print "[%s][PID:%s] tms_start" % (_now(), os.getpid())',
                '',
                'def tms_success(msg):',
                '    print "[%s][PID:%s] tms_success:[%s]" % (_now(), os.getpid(), msg)',
                '    sys.exit(0)',
                '',
                'def tms_fail(msg):',
                '    print "[%s][PID:%s] tms_fail:[%s]" % (_now(), os.getpid(), msg)',
                '    sys.exit(1)',
                '',
                'if __name__ == \'__main__\':',
                '',
                '    tms_start()',
                ''
            );
            return python.join('\n');
        }()
    },
    /**
     * 界面渲染后，执行相关默认设置
     * @param {} self
     */
    _onAfterRender: function(self) {        
        Ext.getCmp('selectScriptPanel').hide();
        Ext.getCmp('localScriptPanel').hide();
    },
    _doScriptNameChange : function(cmb,record,index){
        var cmbScriptVersion =  this.COMPONENTS.cmbScriptVersion,
            cmbApplication = this.COMPONENTS.cmbApplication,
            scriptVersionStore = cmbScriptVersion.getStore();        

        scriptVersionStore.load({
            params : {
                applicationId : cmbApplication.getValue(),
                nameMD5 : record[0].get('nameMD5')
            }
        });
    },
    _doScriptTypeChange : function(radiogroup,newVal,oldVal){
      
        var txtScriptCode = this.COMPONENTS.txtScriptCode;
        
        if (newVal.scriptType === 1) {
            txtScriptCode.setMode('text/x-sh')
            txtScriptCode.setValue(this.SCRIPT_TEMPLATE.SHELL);    
        }else if(newVal.scriptType ===2){
            txtScriptCode.setMode('text/plain');
            txtScriptCode.setValue(this.SCRIPT_TEMPLATE.BAT);
        }else if(newVal.scriptType ===3){
            txtScriptCode.setMode('text/x-perl');
            txtScriptCode.setValue(this.SCRIPT_TEMPLATE.PERL);  
        }else if(newVal.scriptType ===4){
            txtScriptCode.setMode('text/x-python');
            txtScriptCode.setValue(this.SCRIPT_TEMPLATE.PYTHON);
        }
    },
    /**
     * 脚本代码单选change事件，隐藏显示相关控件
     * @param {} radiogroup
     * @param {} rdoChecked
     */
    _doChange: function(radiogroup, rdoChecked) {
        if (rdoChecked.scriptFrom === 0) {
            Ext.getCmp('selectScriptPanel').show();
            Ext.getCmp('localScriptPanel').hide();
        } else if (rdoChecked.scriptFrom === 2) {
            Ext.getCmp('selectScriptPanel').hide();
            Ext.getCmp('localScriptPanel').show();
        } else {
            Ext.getCmp('selectScriptPanel').hide();
            Ext.getCmp('localScriptPanel').hide();
        }

    },
    /**
     * 加载作业脚本数据，并设置初始值，默认选中第一项
     * @param {} store
     * @param {} record
     * @param {} opts
     */
    _onSelectScriptLoad: function(store, record, opts) {
        var cmbSelectScript = this.COMPONENTS.cmbSelectScript;
        if (record.length === 0) {
            cmbSelectScript.clearValue();
            return;
        }
        cmbSelectScript.setValue(record[0].get('nameMD5'));
        var version =  this.COMPONENTS.cmbScriptVersion;        
        version.clearValue();//清除脚本版本选择的值        
        cmbSelectScript.fireEvent('select',this,record,0);
    },
    /**
     * 加载用户账号数据，并设置初始值，默认选中管理员账户
     * @param {} store
     * @param {} record
     * @param {} opts
     */
    _onAccountLoad: function(store, records, opts) {
        var cmbAccount = this.COMPONENTS.cmbAccount;
        var adminUser = [];
        var generalUser = [];
        if (records.length === 0) {
            cmbAccount.clearValue();
            return;
        }        
        Ext.each(records,function(record){
            var user = record.data;
            user.isLDAPUser ? adminUser.push(user.id) : generalUser.push(user.id);
        });
        if (adminUser.length!==0) {
            cmbAccount.setValue(adminUser[0]);
            return;
        }
        if (generalUser.length!==0) {
            cmbAccount.setValue(generalUser[0]);            
        }        
    },
    /**
     * 加载CC脚本数据，并设置初始值，默认选中第一项
     * @param {} store
     * @param {} record
     * @param {} opts
     */
    _onScriptLoad: function(store, records, opts) {    	
        var cmbScript = this.COMPONENTS.cmbScript;
        if (records.length === 0) {
            cmbScript.clearValue();
            return;
        }
        cmbScript.setValue(records[0].get('id'));
    },
    
    
    /**
     * 当所属业务发生变化，cc脚本、作业脚本、用户账户都需要重新加载
     * @param {} cmb
     */
    _onApplicationChange: function(cmb) {
        var cmbAccount = this.COMPONENTS.cmbAccount;
        var cmbScript = this.COMPONENTS.cmbScript;
        var cmbSelectScript = this.COMPONENTS.cmbSelectScript;
        var applicationId = cmb.getValue();
        if (applicationId){
	        cmbAccount.getStore().load({
	            params: {
	                'userAccount.application.id': applicationId
	            }
	        });	        
        }
    },
    /**
     * 过滤特殊字符
     * @param {} str
     * @return {}
     */
    _replace: function(str) {
        return str.replace(/(&gt;)/g, ">").replace(/(&lt;)/g, "<").replace(/(&apos;)/g, "'").replace(/(&quot;)/g, "\"").replace(/(&amp;)/g, "&");
    },
    /**
     * 导入本地脚本
     */
    _importScript: function() {
        var txtScriptCode = this.COMPONENTS.txtScriptCode;
        var txtScriptFile = Ext.getCmp('scriptFile');
        var _this = this;
        if (txtScriptFile.getValue().trim() === '') {
            return;
        }
        
        localFileForm = this.getForm();
        localFileForm.submit({
            url:'./common/doLocalFileLoad.action',
            method: 'POST',
            clientValidation : false ,
            waitMsg: '上传中...',
            success : function(form, result){
                var response = result.response;
                var code = response.responseText;
                
                txtScriptCode.setValue(_this._replace(code).replace(/@##@/g, "\r\n"));
            }
        });
        
    },
    /**
     * 从已有作业脚本拷贝
     */
    _copyScript: function() {
        var cmbSelectScript = this.COMPONENTS.cmbSelectScript,
            cmbScriptVersion =  this.COMPONENTS.cmbScriptVersion,
            txtScriptCode = this.COMPONENTS.txtScriptCode;
        if (Ext.isEmpty(cmbSelectScript.getValue()) || Ext.isEmpty(cmbScriptVersion.getValue())) {
            return;
        }
        Ext.Ajax.request({
            url: './jobs/getScriptContent.action',
            params: {
                scriptId: cmbScriptVersion.getValue()
            },
            success: function(response, opts) {
                var result = Ext.decode(response.responseText);
                var scriptInfo = result.data[0];
                txtScriptCode.setValue(scriptInfo.ScriptContent);
            },
            failure: function(response, opts) {
                Ext.Msg.ERROR('错误代码：' + response.status + '\n错误描述：' + response.statusText)
            }
        });

    },
    /**
     * 执行脚本
     */
    _executeScript: function() {
        var cmbApplication = this.COMPONENTS.cmbApplication;
        var txtScriptCode = this.COMPONENTS.txtScriptCode;
        var txtScriptParams = Ext.getCmp('txtScriptArgus');
        var rdoScriptType = Ext.getCmp('rdoScriptType');
        var panelIPList = this.COMPONENTS.panelIPList;
        var cmbAccount = this.COMPONENTS.cmbAccount;
        var hosts = panelIPList.getHosts();
        var isAllBadAgent = true;
        var kit = Ext.ijobs.common.Kit;
        var btnExecute = this.down('button[ref="../btnExecute"]');
        var timeout = this.findById('timeout').getValue();//执行超时时间
        var pluWizard = this.getPlugin('pluWizard');
        var isGuide = pluWizard ? pluWizard.isGuide : false;
        
        //如果不填默认传0        
        if(Ext.isEmpty(timeout)){
            timeout = 0;
        }
        if(!Ext.isNumber(timeout)){
            parent.Frame.insertMsg('执行超时时间只能为秒数！', 2);
            return;
        }
        if(timeout<0 || timeout>259200){
            parent.Frame.insertMsg('执行超时时间只能为0到259200秒之间！', 2);
            return;
        }                
        if(Ext.isEmpty(cmbApplication.getValue())){
            parent.Frame.insertMsg('请选择开发商！', 2);
            return;
        }
        
        Ext.each(hosts, function(host) {
            if (host.isAgentOk) {
                isAllBadAgent = false;
                return false;
            }
        });
        if (hosts.length===0 || isAllBadAgent) {
            parent.Frame.insertMsg('无有效的Agent状态的IP', 2);
            return;
        }
        var ipList = [];
                Ext.each(panelIPList.getHosts(), function(host) {
            ipList.push(host.ip);
        });
        var name = this.findById('name');
        if(Ext.isEmpty(name)){
            name = '一次性执行脚本';
        }else{
            name = name.getValue();
        }
        var params = {
            'name': name,
            'applicationId': cmbApplication.getValue(),
            'scriptText': kit.enter2wrap(txtScriptCode.getValue()),
            'scriptType': rdoScriptType.getValue().scriptType,
            'scriptParams': txtScriptParams.getValue(),
            'ipList': ipList.join(","),
            'timeout' : timeout,
            'accountId': cmbAccount.getValue(),
            'appID': cmbApplication.getValue()
        };
        btnExecute.disable();
        Ext.Ajax.request({
            url: './jobs/startExecuteScript.action',
            params: params,
            scope : this,
            success: function(response, opts) {
                if (this.toolkit.hasPermission(response)) {
                    var result = Ext.decode(response.responseText);
                    if (result.showInConsole) {
                        parent.Frame.insertMsg(result.message, result.msgType);
                    } else {
                        if (result.taskId > 0) {
                            var thisTabId = getActiveTabId();
                            parent.Frame.createNewTab ("./jobs/jobRun.jsp?jobInstanceId=" + result.taskId, Math.random(),"执行作业【一次性执行脚本】",isGuide);
                            if (pluWizard) {
                                pluWizard.done();
                            }
                            //closeTab(thisTabId); //保留原tab页
                        } else {
                            parent.Frame.insertMsg("系统异常，请联系管理员。\n" + response.responseText, 2);
                        }
                    }
                }
                btnExecute.enable();
            },
            failure: function(response, opts) {
                Ext.Msg.alert('信息','错误代码：' + response.status + '\n错误描述：' + response.statusText);
                btnExecute.enable();
            }
        });
    }
});

//end file