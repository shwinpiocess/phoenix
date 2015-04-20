/**
 * 临时脚本界面
 * 
 * @description
 * @author v_jfdong
 * @requires ext/ux/ux-all.js
 */
Ext.define('Ext.ijobs.task.TempScriptUI', {
    requires : ['js.common.ux.Wizard'],
    extend: 'Ext.FormPanel',
    plugins : [{
        ptype : 'wizard',
        pluginId  : 'pluWizard'
    }],    
    constructor : function(config) {
        config = Ext.apply({
            toolkit :  Ext.ijobs.common.Kit,
            autoHeight : true,
            border : false,
            //itemCls : 'col_bor',
            fileUpload: true,
            errorReader : Ext.create('Ext.data.reader.Json',{
                getResponseData : function(response) {
			        return {success : true};                                 
                }
            }),
            style : 'padding:20px 20px 0px 25px;',
            bodyStyle : 'background-color:inherit;',
            }, config);
        this.callParent([config]);
    },
    initComponent : function() {
    	var me = this;
        this.items = [
            this._createJobNameField(),          
            this._createApplicationCombox(),
            this._createScriptFromRadio(),
            this._createSelectScriptPanel(),
            this._createLocalScriptPanel(),
            this._createScriptTypeRadio(),
            this._createScriptTextArea(),            
            this._createIPListPanel(), this._createAccountCombox(),
            {
            	xtype : 'checkbox',
            	boxLabel  : '高级选项',
            	hideEmptyLabel : false,
            	itemId : 'moreParams',
            	listeners : {
            		change : function(checkbox, newValue){
            			var timeoutField = me.findById('timeout');
            			var argusText = Ext.getCmp('txtScriptArgus');
            			if(newValue){
            				timeoutField.show();
            				argusText.show();
            			}else{
            				timeoutField.hide();
            				argusText.hide();
            			}
            		}
            	}
            		
            },
            this._createScriptTimeoutField(),
            this._createScriptArgusText()];
        this.buttonAlign = 'right';
        this.width="770";
        this.buttons = this._createButtons();
        this.callParent();
    },
    _createJobNameField : function(){
    	var panel = new Ext.Panel({
    		layout : 'column',    		
    		//style : 'margin-bottom: 5px;border-bottom: 1px solid #E8E8E8;',
    		border :false,
    		bodyStyle : 'background-color:inherit;',
    		items : [{
    			allowBlank : false,
    			fieldLabel:"作业名称",
    			width : 725,
    			style : "margin-bottom: 10px;",
    			//xtype : 'textfield',
    			xtype : 'texttrigger',
        		itemId : 'name',
        		maxLength : 20,
            	emptyText : '请输入作业名称。非必填项，填写后方便在执行历史里搜索',
            	value:"执行脚本-"+Ext.util.Format.date(new Date(),"Ymdhis"),
            	validator : function(value){
	                value = value.trim();
	                if(value.length===0){
	                    return "作业名称不允许为空";
	                }
	                return true;
	            }     
    		}]
    	});
    	return panel;
    },
    _createScriptTimeoutField : function(){
    	var field = new Ext.form.NumberField({
    			width:725,
        		itemId : 'timeout',
        		hidden : true,
            	fieldLabel : '超时时间(秒)',
            	emptyText : '最长等待执行秒数，超时则系统返回失败',            	
            	minValue : 0,
            	maxValue : 259200,
            	msgTarget :'under',
            	maxText : '该输入项的最大值是{0} (3天)'            	
        });
    	return field;
    },
    _createScriptTypeRadio : function() {
        var rg = new Ext.form.RadioGroup({
            id : 'rdoScriptType',
            fieldLabel : '脚本类型',  
            style : "margin-bottom: 10px;",
            width : 300,
            items : [{
                boxLabel : 'shell',
                width : 100,
                name : 'scriptType',
                inputValue : 1,
                checked : true
            }, {
                boxLabel : 'bat',
                width : 150,
                name : 'scriptType',
                inputValue : 2
            }, {
                boxLabel : 'perl',
                width : 150,
                name : 'scriptType',
                inputValue : 3
            }, {
                boxLabel : 'python',
                width : 150,
                name : 'scriptType',
                inputValue : 4
            }]
        });
        return rg;
    },
    _createApplicationCombox : function() {
        var _this = this;
        var store = Ext.create('Ext.data.JsonStore', {
            fields : ['id', 'applicationName', 'applicationId', 'appType'],
            proxy: {
            	type: 'ajax',
            	url : './common/getAllApplicationList.action'
            }
        });
        var cmb = new Ijobs.common.ux.AppComboBox({
            id : 'cmbApplication',
            hidden : true,//暂时隐藏
            fieldLabel : '开发商',
            style : "margin-bottom: 10px;",
            emptyText : '请选择开发商',
            width:725,
            allowBlank : false,
            defaultApp : parseInt(appid,10),
            store : store,
            queryMode : 'local',
            valueField : 'id',
            displayField : 'applicationName',
            listeners : {
            	change : function(combox){
            		var ipListPanel = Ext.getCmp('ipListPanel');
            		if(ipListPanel){
            			ipListPanel.applicationId = combox.getValue();
            		}
            	}
            }
        });
        return cmb;
    },
    _createSelectScriptPanel : function() {
        var cmbScriptName = new Ijobs.ux.ComboBox({
            id : 'cmbScript',
            columnWidth : .39,
            fieldLabel : '脚本名称',
            queryMode : 'local',
            triggerAction : 'all',
            valueField : 'nameMD5',
            displayField : 'name',
            emptyText : '请选择脚本',            
            store : Ext.create('Ext.data.JsonStore', {
            	proxy: {
            		type: 'ajax',
            		url : "./components/scriptsAction!getJobScriptListByApp.action",
        			reader: {
                		root : "data"
                	}
            	},
                method : "POST",
                autoDestroy : true,
                fields : ["nameMD5","name"]
            })
        });
        var cmbScriptVersion = new Ijobs.ux.ComboBox({
            id : 'cmbScriptVersion',
            columnWidth : .39,
            style : 'padding:0 0 0 5;',
            fieldLabel : '脚本版本',
            queryMode : 'local',
            triggerAction : 'all',
            valueField : 'scriptId',
            displayField : 'vertag',
            emptyText : '请选择版本',
            style : "margin-bottom: 10px;",
            store : Ext.create('Ext.data.JsonStore', {
            	proxy: {
            		type: 'ajax',
            		url : "./components/scriptsAction!getVersionsByApp.action",
            		extraParams : {
                        state : 5    
                    },
            		reader: {
            			root : "data"
            		}
            	},
                method : "POST",
                autoDestroy : true,
                fields : ["nameMD5","name","scriptId","tag","version",{
                    name : 'vertag',
                    convert : function(v,rec){
                        return Ext.String.format('{0}　{1}',rec.data.version,Ext.value(rec.tag,'')); 
                    }
                }]
            })
        });        
        var panel = new Ext.Panel({
            id : 'selectScriptPanel',
            border : false,
            width:845,
            //anchor : '63%',
            layout : 'column',
            fieldLabel : ' ',
            bodyStyle : 'background-color:inherit;',
            labelSeparator : '',
            items : [
                cmbScriptName,{
                    columnWidth:0.02,
                    xtype:'container',
                    html:'&nbsp;'
                },cmbScriptVersion, {
                columnWidth : .2,
                border : false,
                layout : 'hbox',
                layoutConfig : {
                    padding : '0 0 0 5',
                    align : 'middle'
                },
                defaults : {
                    margins : '0 5 0 0'
                },
                items : [{
                    text : '拷贝',
                    cls : 'opera btn_sec',
                    height : 25,
                    xtype : 'button',
                    ref : '../btnCopyScript'
                }]
            }]
        });
        return panel;
    },
    
    _createLocalScriptPanel : function() {
        var file = new Ext.form.FileUploadField({
            //columnWidth : .8,
        	width:553,
            id : 'scriptFile',
            name : 'upload',
            buttonText : '浏览…'
        });
        var hboxPanel = new Ext.Panel({
            id : 'importScriptPanel',
            //columnWidth : .2,
            width:100,
            border : false,
            autoShow : true,
            xtype : 'panel',
            layout : 'hbox',
            layoutConfig : {
                padding : '0 0 0 5',
                align : 'middle'
            },
            defaults : {
                margins : '0 5 0 0'
            },
            items : [{
                text : '导入',
                cls : 'opera btn_sec',
                id : 'btnImportScrpt',
                xtype : 'button',
                ref : 'btnImportScript',
                style:"margin-left:5px;"
            }]
        });
        var panel = new Ext.form.FieldContainer({
            border : false,
            //anchor : '63%',
            id : 'localScriptPanel',
            layout : 'hbox',
            padding : '5 0 5 0',        
            allowBlank : true,
            autoShow : true,
            fieldLabel : ' ',
            labelSeparator : '',
            items : [file, hboxPanel]
        });
        return panel;
    },
    _createScriptFromRadio : function() {
        var rg = new Ext.form.RadioGroup({
            id : 'rdoScriptFrom',
            fieldLabel : '请输入脚本',
            width : 400,
            style : "margin-bottom: 10px;",
            items : [{
                boxLabel : '手工录入',
                width : 100,
                name : 'scriptFrom',
                inputValue : 1,
                checked : true
            }, {
                boxLabel : '从已有脚本拷贝',
                width : 150,
                name : 'scriptFrom',
                inputValue : 0
            }, {
                boxLabel : '本地脚本',
                width : 150,                
                name : 'scriptFrom',
                inputValue : 2
            }]
        });
        return rg;
    },
    _createScriptTextArea : function() {

        var ta = new /*Ext.form.field.TextArea({*/Ext.ux.form.field.CodeMirror({
            id : 'txtScriptCode',
		    mode: 'text/x-sh',
		    width : 620,		    
            theme : 'erlang-dark',
            style : "margin-bottom: 10px;",
            allowBlank : false,
            height : 400,
//            grow : true,
//            growMin : 200,
//            growMax : 400,
//            autoScroll : true,
            emptyText : '请输入脚本代码',
            addons : [{
                jsFiles : ['selection/active-line.js'],
                styleActiveLine : true
            }]
        });
        
        return {
        	xtype : 'fieldcontainer',
        	hideEmptyLabel : false,
            anchor : '80%',
        	items : [ta]
        };
    },
    _createScriptArgusText : function() {
        /*var txt = new Ext.form.TextField({
            id : 'txtScriptArgus',
            anchor : '50%',
            fieldLabel : '脚本入口参数'
        });*/
        var txt = Ext.create('widget.texttrigger',{        	
        	id : 'txtScriptArgus',
        	width:725,
        	hidden : true,
        	inputXtype : 'param-input',
        	inputConfig : {
        		dataName : '__scriptParams',
        		border : false
        	},
        	//anchor : '50%',
        	fieldLabel : '脚本入口参数',
            emptyText : '该参数用于脚本的输入参数，无则不填'
        });
        
        return txt;
    },
    _createIPListPanel : function() {
        var ipList = new Ijobs.common.ux.IPListPanel({
            id : 'ipListPanel',
            width:725,
            //anchor : '80%',
            style : "margin-bottom: 10px;",
            fixed : true,
            appComponentId : 'cmbApplication',//开发商选择框id
            hideScriptAddition : true,
            allowBlank : false,
            applicationId : this.applicationId,// 所属业务
            pageSize : 10,// 分页数
            hosts : [],// 主机IP
            fieldLabel : '目标机器',
            border : false
            
        });
        return ipList;        
    },
    _createAccountCombox : function() {
    	var me = this;
        var cmb = Ext.create('Ijobs.common.ux.AccountChooser',{
        	fieldLabel : '执行账户',
        	comboWidth : 500,
        	comboId :  'cmbAccount',//下拉框id
        	style : "margin-bottom: 5px;",
        });
        return cmb;
    },
    
    _createButtons : function() {
        return [{
            text : '<i class="icon-ok icon-white"></i>&nbsp;执行脚本',
            cls : 'opera btn_main long',
            style : 'margin :0 0 10 -500px;',
            ref : '../btnExecute',
            width:150,
            height:30
        }];
    }
});

//end file