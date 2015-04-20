/**
 * 账户选择组件,带新建功能
 * @class Ijobs.common.ux.ComboBox
 * @extends Ext.form.FieldContainer
 */
Ext.define('Ijobs.common.ux.AccountChooser',{
    extend : 'Ext.form.FieldContainer',
    alias: ['widget.accountchooser'],
    alternateClassName: 'Ijobs.ux.AccountChooser',
    constructor : function(config){
    	var me = this;
    	me.comboxConfig = Ext.clone(config);
    	Ext.apply(config,{
    		layout : 'column',
    	});
    	this.callParent(arguments);
    },
    COMPONENTS : {},
    initComponent: function() {
    	var me = this;
    	me.items = [
    	    me._createCombo(),{
        	xtype : 'button',
        	width : 110,
			text : '<i class="icon-white icon-plus"></i>&nbsp;登记账户',
            cls : 'opera btn_sec',
            handler: me._showAccountWin.bind(me)
        }];
    	
        this.callParent(arguments);
    },
    _createCombo : function(){
    	var me = this;
    	var store = Ext.create('Ext.data.JsonStore', {
        	proxy: {
        		type: 'ajax',
                url : './jobs/getUserAccountsByApp.action'
        	},
            fields : ['id','accountName','application','accountAlias','accountPassWord','isLDAPUser',
                {
                    name:"accountAliasSelect",
                    convert:function(v,record){
                    	var d = record.data;
                        return d.accountName !=='undefined' 
                            ? d.accountAlias+ " 账号:"+d.accountName
                            : d.accountAlias;
                        }
                }
            ]
        });
    	var combo = Ext.create("Ijobs.common.ux.ComboBox",{
            	width : Ext.valueFrom(me.comboWidth, 380),
            	hideLabel : true,            	
            	store : store,
            	id : Ext.valueFrom(me.comboId,me.id+'account_combo'),
                queryMode : 'local',
                editable : true,
                triggerAction: 'all',
                valueField: 'id',
                displayField: 'accountAliasSelect',
                padding : '0px 10px 0px 0px'
    	});
    	me.COMPONENTS.combo = combo;
    	return combo;
    },
    _showAccountWin : function(){
    	var me = this;
    	var form = Ext.create('Ext.form.Panel', {
    	        itemId : 'userAccountForm',
    	        border: false,    
    	        defaultType: 'textfield',
    	        bodyPadding: 5,
    	        layout: 'anchor',
    	        defaults: {
    	            anchor: '100%'
    	        },
    	        items : [{
    	        	xtype : 'displayfield',
    	        	border: false,  
    	        	value:'<div class="ch_message_attention x-text-nowrap" style="background-color: #FCFFD7; border-color: #C7DDBC;">账户必须在服务器上已存在，iJobs不在服务器上创建账户</div>'
    	        },{
    	        	fieldLabel : '开发商',
    	        	xtype : 'app-combo',
    	            name : 'userAccount.application.id',
    	            allowBlank : false,
    	            store :  Ext.create('Ext.data.JsonStore',{
    	            	autoLoad : true,
    	            	proxy: {
    	            		type: 'ajax',
    	            		url : './common/getAllApplicationList.action'
    	            	},
    	                fields: ['id','applicationName','applicationId','appType']
    	            }),
	                valueField: 'id',
	                displayField: 'applicationName'
    	        		
    	        },{
    	        	fieldLabel : '账户别名',
    	        	allowBlank : false,
    	        	name : 'userAccount.accountAlias'
    	        },{
    	        	fieldLabel : '账户名称',
    	        	allowBlank : false,
    	        	name : 'userAccount.accountName'
    	        },{
    	        	inputType: 'password',
    	        	fieldLabel : '账户密码',
    	        	allowBlank : false,
    	        	name : 'userAccount.accountPassWord'
    	        }]
    	});
    	me.COMPONENTS.userAccountForm = form;
    	var win = Ext.create('Ext.window.Window', {
    	    title : '登记账户',
    	    height : 235,
    	    width : 400,
    	    modal : true,
    	    layout : 'fit',
    	    buttons : [{
    	    	text : '保存',
    	    	handler : me._saveAccount.bind(me)
    	    }], 
    	    items: [form]
    	});
    	me.COMPONENTS.userAccountWin = win;
    	win.show();
    },
    /**
     * 保存执行账户
     */
    _saveAccount : function(btn){
    	var me = this,
    	form = me.COMPONENTS.userAccountForm;
    	if(!form.isValid()){
    		return;
    	}
    	btn.disable();
    	var params = form.getValues();
    	Ext.iterate(params,function(k, v){
    		if(k === 'userAccount.application.id'){
    			params[k] = parseInt(v);
    		}else{
    			params[k] = v.trim();
    		}
    		
    	});
    	params['appID'] = params['userAccount.application.id'];
    	Ext.Ajax.request({
    	    url: './common/checkName.action',//用户名重复检测
    	    params:{
    	    	model : 'userAccount',
    	    	name : params['userAccount.accountAlias'] 
    	    },
    	    failure : function(){
    	    	printMsg("服务器错误！！！",2);
    	    	btn.enable();
    	    },
    	    success: function(response, opts) {
    	        var result = Ext.decode(response.responseText);
    	        if( result.showInConsole) {
    	            printMsg(result.message,result.msgType);
    	            return false;
    	        }else{
    	        	//通过用户名检测，保存账户
    	        	ADD.initD(sk,true);//字符加密
    	        	params['userAccount.accountPassWord'] = ADD.entt(params['userAccount.accountPassWord'],true);
    	        	Ext.Ajax.request({
    					url: './jobs/updateUserAccountInfo.action',
    			 		params: params,
    			 		failure: function(request) {		// 设置表单提交出错
    			 			btn.enable();
    			 			printMsg("表单提交出错，请稍候再试",2);
    			 		},
    			 		success: function(data) {
    			 			var result = Ext.decode(data.responseText),
    			                hasError = result.hasOwnProperty('msgType') & result.msgType === 2;
    			                
    			            if (result.showInConsole) {
    			                printMsg(result.message, result.msgType);
    			            }
    			            btn.enable();
    			            if (!hasError) {
    			            	//从新加载账户列表
    			            	var store = me.COMPONENTS.combo.getStore();
    			            	store.load({
    			            		params : {
    			                    'userAccount.application.id' : params['userAccount.application.id']
    			            		}
    			            	});
    			            	me.COMPONENTS.userAccountWin.close();//关闭弹窗
    			            }
    			            
    			 		}
    			 	});
    	        }
    	    }
    	});
    }
});
