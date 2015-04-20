Ext.define('Ijobs.common.ux.IPListPanel',{
    extend : 'Ext.form.FieldContainer',
    alias: ['widget.ip-list'],
    allowBlank:true,//避免出现必填的标志
    alternateClassName: 'Ijobs.ux.IPGridPanel',
    requires : ['Ijobs.ux.LinkColumn','Ijobs.ux.ComboBox','Ijobs.ux.ParamInput','Ijobs.ux.ZeroClipboard.ZeroClipboard'],
    constructor: function(config) {
        config = Ext.apply({
            plain:true,
            ccScriptURL : "./jobs/getCcResultStatus.action",
            hosts : [],//主机数据
            readOnly : false,//是否只读,true/false:是/否
            loadMaks :{msg:'加载中…'},
            dataMaxLength:1000,//最多能添加xx条数据
            panelWidth : "100%",//组件右边宽度
            toolkit :Ext.ijobs.common.Kit,
            layout:'anchor'
        }, config);        
        config.scriptList = config.scriptList || [];
        this.COMPONENTS = {};
        this.ERR_HOST = [];
        this.NORMAL_HOST = [];
        this.callParent(arguments);

    },
    IP_MaxCount:10,//显示IP行数
    _showMask : function(msg){
    	var me = this;
    	me.mask = new Ext.LoadMask({
    		msg:msg,
    		target:me
    	});
    	me.mask.show(); 
    },
    _hideMask : function(){
    	var me = this;
    	if(me.mask){
    		me.mask.hide();
    	}    	
    },

    /**
     * 初始化面板
     */
    initComponent : function(){
    	var me=this;
    	var gridPanel=this._createGridPanel();
    	this.COMPONENTS.panelHostGrid = gridPanel;
        this.items = [
                this._createIPInputPanel(),
                {id:this.id+"title",hidden:true,border:false},
                gridPanel,
                {
                	id:this.id+"_allIP",
                	ref : '../_allIP',
                	height : 25,
                	xtype:'button',
                	text:"全部服务器列表",
                	style : 'margin-left:5px;margin-top:10px;'},
                {
                	style : 'margin-left:5px;margin-top:10px;',
                	text:'<i class="icon-white icon-trash"></i>&nbsp;清空数据',
                	xtype:"button",
                	height : 25,
                	columnWidth: 0.5,
                	cls : 'opera btn_sec long',
                    id : this.id + '_btnclearAll',
                    ref : '../_btnclearAll'
        		},
        		{
            		style : 'margin-top:10px;margin-left:5px;',
                	text:'复制全部IP',
                	xtype:"button",
                	height : 25,
                	columnWidth: 0.5,
                    id : this.id + '_btnCopyAll',
                    ref : '../_btnCopyAll',
                    icon: "./images/copy2.png",
                    plugins: {
                        ptype: 'zeroclipboard',
                        onCopyComplete : function(client,opt){
                            if (!Ext.isEmpty(opt.text)) {
                                parent.Frame.insertMsg('ip列表已复制到你的剪贴板',1);
                            }
                        },
                        targetFunc:function(){
                        	var iplist=[];
                        	Ext.each(me.hosts,function(item){
                        		iplist.push(item.ip);
                        	});
                        	return iplist.join(";");
                        } 
                    }
                }
            ];
        this.callParent(arguments);   
        this.MAPPING_FIELDS = {};         
        Ext.apply(this.COMPONENTS,{
            rdoInputType :  this.findById(this.id+'_rdoInputType')
        });
    },
    buttons:[{text:"test"}],
    initEvents : function(){
    	
    	var me = this;
    	me.callParent(arguments);

    	var $p = this.COMPONENTS;  
        this.findById(this.id + '_btnAddIP').on('click',this._addIP,this);
        this.findById(this.id + '_btnSelectIP').on('click',this._selectIP,this);
        this.findById(this.id + '_btnclearAll').on('click',this._clearAll,this);
        this.findById(this.id + '_allIP').on('click',this._showAllIPList,this);
        //this.findById(this.id + '_btnCopyAll').on('click',this._copyAll,this);
        
        this.findById(this.id + '_hostsIP').on('change',this._isEdit,this);
        
        
    },
    //选择ip的弹窗
    _selectIP : function(){
    	var me=this;
    	var win = Ext.create('Ext.window.Window', {
    		title : '选择目标机器',
    		width : 480,
    		height :400,
    		modal : true,
    		closeAction : 'destroy',
    		layout: 'fit',
    		items:[{
    			xtype : 'tabpanel',    	
    			activeTab : 0,
    			items : [{
    		        title: '模块配置 - APP',    		 
    		        autoScroll : true,
    		        itemID : 'modulePanel',
    		        layout : 'anchor',
    		        items : [{
    		        	xtype : 'box',
    		        	style : 'padding:10px;',
    		        	html : '<img src="./images/loading2.gif" />数据获取中...'
    		        }]
    		        
    		    },{
    		        title: '配置中心 - APP',
    		        autoScroll : true,
    		        itemID : 'CCPanel',
    		        layout : 'anchor',
    		        items : [{
    		        	xtype : 'box', 
    		        	style : 'padding:10px;',
    		        	html : '<img src="./images/loading2.gif" />数据获取中...'
    		        }]
    		    },{
    		        title: ' 通过IP选择服务器',
    		        itemID : 'ijobsPanel',
    		        layout : 'fit',
    		        items : [me._createIjobsIPPanel()]
    		    }]
    		}],
    		buttons : [{
    			text : '添加选中',
    			handler : function(){    				
    				var tab = win.down('tabpanel'),
    					panel = tab.getActiveTab(),
    					itemId = panel.itemID;
    				switch(itemId){
    					case 'CCPanel':
    						me._setIpList(panel);
    					break;
    					case 'modulePanel':
    						me._setIpList(panel);    						
    					break;
    					case 'ijobsPanel':
    						var grid = panel.down('grid'),
    							sel = grid.getSelectionModel(),
		    					records = sel.getSelection(),
		    					textfield = Ext.getCmp(me.id+'_hostsIP'),
		    					addBtn = Ext.getCmp(me.id + '_btnAddIP'),
		    					ips='';
		    				Ext.each(records,function(record){
		    					var ip = record.get('ip');
		    					if(!Ext.isEmpty(ip)){
		    						ips += ip+"\r\n";
		    					}    					
		    				});
		    				textfield.setValue(ips);
		    				addBtn.fireEvent('click');
    					break;
    						
    					
    				}
    				win.close();
    			}
    		}]
    	});
    	me.COMPONENTS.selectIpWindow = win;
    	me._setModulePanelItems();
    	me._setCCPanelItems();
    	win.show();
    },
    //获取树勾选的值，并添加到ip列表
    _setIpList : function(panel){
    	var tree = panel.down('treepanel');
    	if(Ext.isEmpty(tree)){
			printMsg('请等待数据加载完成！', 2);
			return false;
		}
    	var me = this,    	
    		checked = tree.getChecked(),    	        					
			textfield = Ext.getCmp(me.id+'_hostsIP'),
			addBtn = Ext.getCmp(me.id + '_btnAddIP'),
			ips='';
    	
		Ext.each(checked, function(record){
			var ip = record.hostIP;
			if(!Ext.isEmpty(ip)){
				ips += ip+"\r\n";
			}    					
		});
		
		textfield.setValue(ips);
		addBtn.fireEvent('click');
    },
    _setModulePanelItems : function(){
    	var me = this,
    		win = me.COMPONENTS.selectIpWindow,
    		panel = win.down('tabpanel panel[itemID="modulePanel"]'),
    		task;
    	
    	me._createModulePanel();
    	    	
    	task = {
			run : function(){
				if(me.isModuleDataReady){
					panel.removeAll();
					panel.add(me.COMPONENTS.modulePanel);					
					Ext.TaskManager.stop(task);
				}
            },
            interval : 1000
    	};
    	Ext.TaskManager.start(task);

    },
    _setCCPanelItems : function(){
    	var me = this,
    		win = me.COMPONENTS.selectIpWindow,
    		panel = win.down('tabpanel panel[itemID="CCPanel"]'),
    		task;
    	me._createCCPanel();
    	    	
    	task = {
			run : function(){
				if(me.isCCDataReady){		
					panel.removeAll();
					panel.add(me.COMPONENTS.CCTreePanel);					
					Ext.TaskManager.stop(task);
				}
            },
            interval : 1000
    	};
    	Ext.TaskManager.start(task);

    },
    //通过cc的分布拓扑来选择主机
    _createCCPanel : function(){
    	var me = this;
    	me.COMPONENTS.CCTreePanel = {xtype : 'box',html:'数据获取失败',style : 'padding:10px;'};
	    me.isCCDataReady = false;
	    Ext.Ajax.request({    	   
    	    url: './bk/components/getCCModuleTree.action',
    	    method : 'POST',
    	    timeout : 5000,
    	    success: function(results){
    	    	var result = Ext.decode(results.responseText),
    	    		success = result.success;
    	    	if(result.hasOwnProperty('msg')){
    	    		printMsg(result.msg.message,result.msg.msgType);
    	    	}
    	    	if(success){
    	    		var data = result.data;
    	    		if(data.length === 0){
    	    			me.COMPONENTS.CCTreePanel = {xtype : 'box',html:'配置数据为空！',style : 'padding:10px;'};
        	    		me.isCCDataReady = true;
    	    			return;
    	    		}
    	    		var store = Ext.create('Ext.data.TreeStore', {
    	    			fields : ['hostIP','text'],
    	        		root: {    	        			
    	        			expanded : true,
    	    				root : true,
    	    				checked : false,
    	        	        children: data
    	        		}
    	        	});
    	    		var panel = Ext.create('Ext.tree.Panel', { 	    
    	        	    reserveScrollbar: true,  	        
    	    	    	anchor : "100%",    	        	    
    	        	    border :false,
    	        	    useArrows: true,
    	        	    listeners :{
    	        	    	beforeitemexpand : me._CCbeforeitemexpand.bind(me),
    	    	    		checkchange : me._checkchange.bind(me)
    	    	    	},
    	        	    lines : false,
    	        	    rootVisible: false,
    	        	    expanded : true,
    	        	    multiSelect: true,
    	        	    singleExpand: false,
    	        	    store: store
    	        	});
    	    		me.COMPONENTS.CCTreePanel = panel;
    	    		me.isCCDataReady = true;
    	    		
    	    	}else{
    	    		me.isCCDataReady = true;
    	    	}
    	    },
    	    failure : function(){
    	    	me.isCCDataReady = true;
    	    }
	    });
    },
    //cc拓扑树节点展开事件
    _CCbeforeitemexpand : function(node, index, item){
    	var moduleId = node.raw.moduleId;
    	var tree = node.getOwnerTree();
    	if(Ext.isEmpty(moduleId)){
    		return false;
    	}
    	if(node.hasChildNodes()){
    		return false;
    	}
    	node.set("loading", true);
    	Ext.Ajax.request({
    	    url: './bk/components/getCCHosts.action',
    	    method : 'POST',
    	    params : {
    	    	ccModuleIds : moduleId
    	    },
    	    timeout : 5000,
    	    success: function(results){
    	    	var result = Ext.decode(results.responseText),
		    		success = result.success;
    	    	
    	    	node.set("loading", false);
		    	if(result.hasOwnProperty('msg')){
		    		printMsg(result.msg.message,result.msg.msgType);
		    	}
		    	if(success){
		    		var data = result.data,
		    			checked = node.data.checked;//如果父节点是选中，就选中子节点
		    		if (data.length==0)  {
		    			node.set('loaded',true);
		    			return;
		    		}
		    		tree.suspendLayouts();
	    	        tree.suspendEvents();
		    		Ext.iterate(data, function(value, key){		
		    			node.appendChild({    	    				
		    				text : value.hostName+" ("+value.hostIP+")",
		    				leaf : true,    	    				
		    				checked : checked,
		    				hostIP : value.hostIP
		    			});
		    			node.expand();
		    		});
		    		tree.resumeLayouts();
	    	        tree.resumeEvents();
		    	}
		    	
    	    },
    	    failure : function(){}
    	});
    	return true;
    },
    //通过模块配置APP来选择ip
    _createModulePanel: function(){
    	var me = this;
    	
	    me.COMPONENTS.modulePanel = {xtype : 'box',html:'数据获取失败'};
	    me.isModuleDataReady = false;
    	
    	//获取根节点数据
    	//Ext.data.JsonP.request({
    	Ext.Ajax.request({
    	    //url: 'http://app.o.qcloud.com/qcloud_cc/get_modules/',
    	    url : 'bk/components/getModuleConfigTree.action',
    	    method : 'GET',
    	    timeout : 5000,
    	    success: function(results){
    	    	var result = Ext.decode(results.responseText),
	    		success = result.success;
    	    	if(result.hasOwnProperty('msg')){
		    		printMsg(result.msg.message,result.msg.msgType);
		    	}
    	    	if(success){
    	    		var data = result.data,
    	    			normalModules = data.normalModules,
    	    			resourcePoolModule = data.resourcePoolModule;
    	    		    	    		
    	    		var root = {
    	    				expanded : true,
    	    				root : true,
    	    				children : [],
    	    				checked: false
    	    		};
    	    		var tempData = {};
    	    		Ext.iterate(normalModules, function(value, key){
    	    			tempData[value.moduleId] = value;
    	    		});
    	    		var getChildData = function(moduleId){
    	    			var data = [];
    	    			Ext.iterate(tempData, function(key, value){
    	    				if(value.parentId === moduleId){
    	    					var children = getChildData(value.moduleId);
    	    					data.push({
    	    						text : value.name,
        	    					checked : false,
        	    					moduleId : value.moduleId,
        	    					children : children
    	    					});
    	    				}
        	    		});
    	    			return data;
    	    		};
    	    		Ext.iterate(tempData, function(key, value){
    	    			if(value.level === 1){
    	    				var children = getChildData(value.moduleId);
    	    				if(children.length>0){
	    	    				root.children.push({
	    	    					text : value.name,
	    	    					checked : false,
	    	    					moduleId : value.moduleId,
	    	    					children : children
	    	    				});
    	    				}else{
    	    					root.children.push({
	    	    					text : value.name,
	    	    					checked : false,
	    	    					moduleId : value.moduleId
	    	    				});
    	    				}
    	    			}
    	    		});
    	    		root.children.push({
	    				text : resourcePoolModule.name,
	    				checked: false,
	    				moduleId : resourcePoolModule.moduleId
	    			});
    	    		//用root来创建treepanel
    	    		var store = Ext.create('Ext.data.TreeStore', {
    	    			fields : ['hostIP','text'],
    	        		root: root
    	        	});
    	    		var panel = Ext.create('Ext.tree.Panel', { 	    
    	        	    reserveScrollbar: true,
    	        	    listeners :{
    	    	    		//afteritemexpand : me._afteritemexpand.bind(me),
    	    	    		beforeitemexpand : me._afteritemexpand.bind(me),
    	    	    		checkchange : me._checkchange.bind(me)
    	    	    	},    	        
    	    	    	anchor : "100%",    	        	    
    	        	    border :false,
    	        	    useArrows: true,
    	        	    lines : false,
    	        	    rootVisible: false,
    	        	    expanded : true,
    	        	    multiSelect: true,
    	        	    singleExpand: false,
    	        	    store: store
    	        	});
    	    		me.COMPONENTS.modulePanel = panel;
    	    		me.isModuleDataReady = true;
    	    	}else{
    	    		me.isModuleDataReady = true;
    	    	}
    	    },
    	    failure : function(){
    	    	me.isModuleDataReady = true;
    	    }
    	});    	
    },
    //模块配置APPTree节点选择事件
    _checkchange : function(node, checked){
    	var me = this,
    		tree = node.getOwnerTree();
        
    	
    	//如果不是叶子节点
    	if(!node.isLeaf()){
    		//如果子节点没有展开 
    		node.expand();    	
			node.cascadeBy(function(childNode){
				if(childNode.childNodes.length == 0){
					childNode.expand();
				}
				//childNode.expand();
			});
    		//如果有子节点
    		if(node.hasChildNodes()){
    			tree.suspendLayouts();
    	        tree.suspendEvents();    			
    			node.cascadeBy(function(childNode){
    				childNode.set("checked",checked);
    			});
    	    	tree.resumeLayouts();
    	        tree.resumeEvents();    			
    		}
    	}
		tree.suspendLayouts();
        tree.suspendEvents();    	
		node.bubble(function(pNode){
			var parentNode = pNode;
    		//如果是叶子节点选中，就判断子节点是否全部选择，如果全部选中，就选中父节点
    		if(checked){
    			var isChecked = true;
    			parentNode.eachChild(function(childNode){
    				//如果有一个子节点没有选中，就取消父节点的选中
    				if(!childNode.data.checked){
    					isChecked = false;
    					return false;
    				}
    			});
    			parentNode.set('checked', isChecked);
    		}else{
    			parentNode.set('checked', false);
    		}
		});
    	tree.resumeLayouts();
        tree.resumeEvents();
        
        
    },
    //模块配置APPTree节点展开事件
    _afteritemexpand : function(node, index, item){
    	var tree = node.getOwnerTree();
    	if(/*node.hasChildNodes()||*/Ext.isEmpty(node.raw.moduleId)){
			return;
		}
    	node.set("loading", true);
		//Ext.data.JsonP.request({ 
		Ext.Ajax.request({
    	    //url: 'http://app.o.qcloud.com/qcloud_cc/get_module_resources/',
    	    url : './bk/components/getModuleConfigHosts.action',
    	    params : {
    	    	mcModuleIds : node.raw.moduleId
    	    },	    	    	    
    	    method : 'GET',
    	    success: function(results){
    	    	node.set("loading", false);
    	    	var result = Ext.decode(results.responseText),
	    		success = result.success;
    	    	
    	    	if(result.hasOwnProperty('msg')){
		    		printMsg(result.msg.message,result.msg.msgType);
		    	}
    	    	
    	    	if(success){
    	    		var data = result.data,
    	    			existing = [],//已存在的子节点ip
    	    			checked = node.data.checked;//如果父节点是选中，就选中子节点
    	    		if (data.length==0)  {
		    			node.set('loaded',true);
		    			return;
		    		}
    	    		if(node.hasChildNodes()){
    	    			var childNodes = node.childNodes;
    	    			Ext.iterate(childNodes, function(value, key){
    	    				if(value.raw.hostIP){
    	    					existing.push(value.raw.hostIP);
    	    				}
    	    			});
    	    		}
    	    		tree.suspendLayouts();
    	            tree.suspendEvents();
    	    		Ext.iterate(data, function(value, key){
    	    			if(Ext.Array.indexOf(existing, value.hostIp) === -1){//如果子节点已存在，就不添加
	    	    			node.appendChild({    	    				
	    	    				text : value.hostName+" ("+value.hostIp+")",
	    	    				leaf : true,    	    				
	    	    				checked : checked,
	    	    				hostIP :  value.hostIp
	    	    			});
    	    			}
    	    		});
    	    		tree.resumeLayouts();
    	            tree.resumeEvents();
    	            node.expand();
    	    	}	    	    	    	
    	    },
    	    failure : function(){
    	    	node.set("loading", false);
    	    	printMsg('获取数据失败！');
    	    }
    	    
    	});
    },
    _createIjobsIPPanel : function(){
    	var me =this,
    		appComponentId = me.appComponentId,//开发商的选择框id
    		appComponent = Ext.getCmp(appComponentId),
    		appid = '', 
    		win,grid,store;
    	
    	if(appComponent){
    		appid = appComponent.getValue();
    	}else if(me.applicationId){
    		appid = me.applicationId
    	}
    	store = Ext.create('Ext.data.JsonStore',{
    		autoLoad : true,
    		proxy: {
    	        type: 'ajax',
    	        extraParams : {
    	        	appid : appid
    	        },
    	        url: './bk/jobs/getIpList.action',
    	        reader: {
    	            type: 'json',
    	            root: 'data'
    	        }
    			
    	    },
    	    fields: ['ip','ipDesc']
    	});    	
    	grid = Ext.create('Ext.grid.Panel',{
    		store: store,
    		border : false,
    		selModel : Ext.create('Ext.selection.CheckboxModel'),
    		columns: [
		       { text: 'ip',  dataIndex: 'ip', menuDisabled:true  },
		       { text: '机器信息',  dataIndex: 'ipDesc', menuDisabled:true  }
		    ],
		    tbar: [
		       {
		    	   enableKeyEvents : true,
		    	   xtype: 'textfield', 
		    	   emptyText: '搜索...',
		    	   width:'100%',		    	   
		    	   listeners : {
		    		   keyup : function(textfield){
		    			   var text = textfield.getValue()
		    			   					.trim()
		    			   					.replace(/\(/igm,'\\(')
					                        .replace(/\)/igm,'\\)')
					                        .replace(/\[/igm,'\\[')
					                        .replace(/\[/igm,'\\]')
					                        .replace(/\*/igm,'\\*');
		    			   if(Ext.isEmpty(text)){
		    				   store.clearFilter();
		    			   }else{
		    				   store.clearFilter(true);
			    			   var filter =  new Ext.util.Filter({
			    				   anyMatch: true,
			    				   root: 'data',
			    	               property: 'ip',
			    	               value : text
			    				});
			    			   store.filter(filter);
		    			   }
		    		   }
		    	   }
		    		   
		       }
		    ],
		    forceFit : true,
		    autoScroll : true,
		    viewConfig: {
		        stripeRows: true
		    }
    	});
    	return grid;
    },
    onDestroy: function(){
    	this.callParent(arguments);
    },
    _createIPInputPanel : function(){
        var me = this,
        	toolkit = this.toolkit;
        this.hideHand = true;
        this.hideCCScript = true;
        var ipInputPanel = new Ext.Panel({
            border : false,
            header : false ,
            //layout : 'form',
            items : [
                     this._createHandPanel()
            ]
        });
        me.COMPONENTS.rdoInputType = ipInputPanel;        
        return ipInputPanel;
    },
    _createHandPanel : function(){ 
    	var me = this;
        var handPanel = new Ext.Panel({
            id : this.id + '_handPanel',
            name : this.id + '_handPanel',
            border : false,
            layout : 'column',
            width : me.panelWidth,
            items : [{
                columnWidth : 1,
                xtype : 'textarea',
                autoScroll : true,
                hidden : this.readOnly,
                emptyText : '请输入IP，以“空格”或者“回车”或者“;”分隔',
                grow : true,
                growMin : 80,
                growMax : 80,
                id : this.id + '_hostsIP',
                name : this.id + '_hostsIP'
            },{
                width : 120,
                border : false,
                layout: {
                    type: 'column',
                    align: 'middle'
                },
                style : 'padding-left:10px;',
                items:[
                {
                	columnWidth:1,
                	text: '<i class="icon-white icon-plus"></i>&nbsp;IP添加',
                    xtype : 'button',
                    hidden : this.readOnly,
                    height : 25,
                    cls : 'opera btn_sec long',
                    id : this.id + '_btnAddIP',
                    ref : '../btnAddIP'
                },
                {
                	columnWidth:1,
                	style : 'margin-top:10px;',
                    text: '<i class="icon-white icon-list"></i>&nbsp;选择目标机器',
                    xtype : 'button',
                    hidden : this.readOnly,
                    height : 25,
                    cls : 'opera btn_main long',
                    id : this.id+'_btnSelectIP'
                }]
            }]
        });
        me.COMPONENTS.panelHand = handPanel; 
        return handPanel;
    },
    _createGridPanel : function(){
        var me = this;
	        
        if (this.hosts.hasOwnProperty('data')) {
            this.hosts = this.hosts.data;
        }
	    var store = Ext.create('Ext.data.Store', {
	            storeId:'simpsonsStore',	            
	            pageSize: me.IP_MaxCount,//me.pageSize,
	            fields:['isAgentOk','ip'],	            
	            proxy: {
	                type: 'memory'
	            },
	            listeners : {
	            	datachanged:function(grid){
	            		//数据变更时检查是否已清空
			    		me._isEdit();
			    	}
	            }
	        });
	    
        var gridPanel = Ext.create('Ext.grid.Panel', {
        	hideHeaders  : true,
            border  : false,
            bodyStyle: {
            	border: 'none'
            },
            width:400,
            maxHeight: 1100,//最多显示五十条数据
            store: store,	            
            columns: [{ 
            	width : 150,
            	text: "目标机器",
                dataIndex: "ip",
                style : 'padding:0;',
                renderer: function(value, metaData, record) {
                    metaData.css = "bold";
                    return value;
                }
            },{
            	width : 120,
            	text: "Agent状态",
                dataIndex: "isAgentOk",
                renderer: function(value, metaData, record) {
                    metaData.css = "bold";
                    return value===true ? '支持操作' : '不支持操作';
                }
            },{
            	width : 80,
            	text : '操作',
            	align : 'right',
            	xtype : 'linkcolumn',
            	items : [{
            		text : '删除&nbsp&nbsp',
            		handler: me._remove.bind(me)
            	}]
            }],
            forceFit : true, 
            viewConfig : {
            	stripeRows : true,            	
                getRowClass : function(record, rowIndex, rp, ds){ 
                    var rowClass = '';
                    rowClass = record.get('isAgentOk') !== true ? 'x-grid-row-ip-agent-fail' : '';
                    return rowClass+' small-grid-row';
                }
            },
            listeners : {
            	boxready : me._bindIPData.bind(me)
            }
        });
	    
        return gridPanel;
    },
    
    /**
     * 手动增加
     */
    _addIP : function(){
        var me = this;
        var txtHostsIP = Ext.getCmp(this.id+'_hostsIP').getRawValue()
					        .trim()
					        .replace(/^\s\s+|\s+/g,';');
        if(txtHostsIP.length === 0){
            return;
        } 
        //按；分隔，去除重复值
        txtHostsIP = Ext.unique(txtHostsIP.split(';'));
        var hostsIP = {};//所有主机IP,用于验证提高性能
        var arrHostsIP = [];//所有主机IP，用于请求参数
        var appendHostsIP = 0;//新增的主机IP数量
        var isAppend = false ;//是否有新增主机
        var oldHostsTotal = me.hosts.length; //已有主机数量        
        if(oldHostsTotal >= me.dataMaxLength  || txtHostsIP.length >me.dataMaxLength){
        	parent.Frame.insertMsg('最多只能添加'+me.dataMaxLength+'台目标机器',2);
            return;
        }        
		me._showMask('正在处理中，请等待...');

        //复制主机IP
        Ext.each(me.hosts,function(item){
            var ip =item.ip;
            hostsIP[ip]=ip;
            arrHostsIP.push(ip);
        });
        //验证新增的主机
        var validator = Ext.form.VTypes;
        var errors = [];
        var allHostsTotal = oldHostsTotal;
        Ext.each(txtHostsIP,function(ip){
            if(validator.IPAddress(ip)){
                 if(!hostsIP.hasOwnProperty(ip)){
                	 if(allHostsTotal >= me.dataMaxLength){
                		 errors.push('IP['+ip+']已移除，目标机器总数不能超过'+me.dataMaxLength+'条'); 
                	 }else{
	                	 appendHostsIP++;
	                	 allHostsTotal++;
	                	 arrHostsIP.push(ip);
	                	 isAppend = true;
                	 }
                 }else{
                    errors.push('IP['+ip+']已存在');
                 }
             }else{
                 if(ip!==''){
                    errors.push('IP['+ip+']不合法');
                 }
             }
        });
        
        if(!isAppend){
        	parent.Frame.insertMsg(errors.join("<br/>"),2);
        	this._hideMask();
            return;
        }
        
        Ext.Ajax.request({
            url: './jobs/getManualIpStatus.action',
            scope: this,
            method: "POST",
            params: {
                ipList :arrHostsIP.join(",")
            },            
            success: function(response,opts) {
            	me._hideMask();                
                if(response.responseText.indexOf("html") > 0){
                    parent.Frame.insertMsg("返回IP列表解析出错，导入失败，请检查数据格式是否正确",2);
                    return;
                }
                var result = Ext.decode(response.responseText);
                var hosts = result.data;
                var hostsLen = hosts.length;
                
                var errMsg = '';
                if(errors.length != 0){
                	errMsg += errors.join("<br/>")+'<br/>';
                }
                if(!Ext.isEmpty(result.errMsg)){
                	errMsg += result.errMsg;
                    
                }
                if(!Ext.isEmpty(errMsg)){
                	parent.Frame.insertMsg(errMsg,2);
                }

                if(hostsLen === 0){
                    return '';
                }                
                Ext.getCmp(this.id+'_hostsIP').reset();
                me.hosts = hosts;
                me._bindIPData();
                me._updateTip(appendHostsIP,hostsLen);
            }
        }); 
    },
    /**
     * 删除单个ip
     */
    _remove : function(grid,rowIndex,colIndex){
    	var me = this,
		store = grid.getStore(),
		record = store.getAt(rowIndex),
		ip = record.get('ip'),
		newHostsData = [];
    	
    	Ext.each(this.hosts,function(host){
            if(ip !== host.ip){
            	newHostsData.push(host);                        
            }
        });
    	me.hosts = newHostsData;
    	store.remove(record);
    	me._updateTip(0,me.hosts.length);
    	me._bindIPData();
    },
    /**
     * 把host的数据放入store
     */
    loadData : function(){
    	var me = this,
    		grid = me.COMPONENTS.panelHostGrid,
    		store = grid.getStore(),
    		hosts = me.hosts,
    		gridData=[];
    	
    	hosts.sort(function(a){
            return a.isAgentOk===true ? 1 : -1;
        });		
    	
    	
    	store.loadData(hosts);

    },
    /**
     * ip导入情况  暂时屏蔽掉
     * @param {} addHostsLen 新增主机数量
     * @param {} totalHosts 主机总数
     */
    _updateTip : function(addHostsLen,totalHosts){
        /*var fails = 0;
        Ext.each(this.hosts,function(host){
            if(Ext.isObject(host)){
                if(!host.isAgentOk){
                    fails++;
                }
            }
        });
        var tip = Ext.getDom(this.id+'_spanIPInfo');
        tip.innerHTML = Ext.String.format('<span id="'+this.id+'_spanIPInfo">本次导入[{0}]个IP，共计导入[{1}]个IP；agent检测状态异常的IP数量共计[{2}]；</span>',
            '<label style="color:#FF0000;"> '+(addHostsLen!==0 ? addHostsLen : totalHosts)+' </label>',
            '<label style="color:#FF0000;"> '+totalHosts+' </label>',
            '<label style="color:#FF0000;"> '+fails+' </label>');*/
    },
    /**
     * 主机面板初始化完成执行相关事件
     * @param {} grid
     */
    _onHostGridRender : function(grid){
        var total = this.hosts.length;
        this._updateTip(total,total);
    },
    _onHostGridBeforeload : function(store){
    	var me = this,
    		hosts = me.hosts;
    	
    	hosts.sort(function(a){
            return a.isAgentOk===true ? 1 : -1;
        });	
        store.proxy.data = {
            'totalProperty': hosts.length,
            'rows':hosts
        };
    },    
    
    /**
     * 根据主机状态把IP分到对应的数组里
     */
    _checkHostAgent : function(hosts){
    	var me = this;
    	me.NORMAL_HOST = [];
    	me.ERR_HOST = [];
    	if(Ext.isEmpty(hosts)){    		
    		hosts = me.hosts;
    	}    	
    	Ext.each(hosts,function(host){
        	if(host.isAgentOk===true){
        		me.NORMAL_HOST.push(host.ip);        		
        	}else{
        		me.ERR_HOST.push(host.ip);
        	}        	
        });
        //console.log('正常IP数：'+me.NORMAL_HOST.length);
        //console.log('异常IP数：'+me.ERR_HOST.length);
    },
    
    /**
     * 删除主机
     */    
    _removeHost : function(){
    	var me = this;
        var $p = this.COMPONENTS;
        var gridHosts = $p.panelHostGrid;
        var gridStore = gridHosts.getStore();
        var sm = gridHosts.getSelectionModel();
        var pagingBar = gridHosts.getDockedItems('pagingtoolbar')[0];
        var records = sm.getSelections();
        
        if(records.length === 0){
            return ;
        }
        
        Ext.Msg.confirm('提示','确定要删除选中的记录？',function(btn){
            if(btn === 'yes'){
                
                var hostsData = [],ips = [],filterHostsData = [];
                
                Ext.each(records,function(record){                        
                    ips.push(record.data.ip);                        
                });
                Ext.each(this.hosts,function(host){
                    if(ips.indexOf(host.ip)===-1){
                        hostsData.push(host);                        
                    }
                });
                if(me.isFilter){
                	Ext.each(this.filterHosts,function(host){
                        if(ips.indexOf(host.ip)===-1){
                        	filterHostsData.push(host);                        
                        }
                    });
                	me.filterHosts = filterHostsData;
                }
                this.hosts = hostsData;
                gridStore.remove(records);                
                gridStore.load();
                
                this._checkHostAgent();
                
                this._updateTip(0,this.hosts.length);
                if(gridStore.getCount()===0){
                    pagingBar.moveLast();                        
                }else{                
                    pagingBar.doRefresh();
                }
            }
        },this);
        
    },
    /**
     * 获取主机相关信息
     */
    getHosts : function(){
        return this.hosts;
    },
    /**
     * 设置主机列表
     * @param {Array} hosts
     */
    setHosts : function(hosts){
        if(Ext.isArray(hosts)){
            var total = hosts.length;
            this.hosts = hosts;
            this._updateTip(total,total);
        }
    },
    _isEdit:function(){
    	//判断是否已编辑，根据状态设置按钮
    	var me=this,
    	store=me.COMPONENTS.panelHostGrid.getStore(),
    	textHost=Ext.getCmp(me.id+'_hostsIP'),
    	clearBtn=Ext.getCmp(me.id+'_btnclearAll'),
    	copyBtn=Ext.getCmp(me.id+'_btnCopyAll'),
    	
    	allIP=Ext.getCmp(me.id+'_allIP');
    	
    	if(!textHost.getRawValue().trim()&&store.getCount()<=0&&this.hosts.length<=0){
    		clearBtn.disable();
    		copyBtn.disable();
    		allIP.disable();
    		return false;
    	}
    	allIP.enable();
    	copyBtn.enable();
    	clearBtn.enable();
    	return true;
    },
    _clearAll:function(callback){
    	var me=this,
    	store=me.COMPONENTS.panelHostGrid.getStore(),
    	textHost=Ext.getCmp(me.id+'_hostsIP');
    	if(me._isEdit()==false){
    		return;
    	}
    	Ext.Msg.confirm('提示','确定清空记录？',function(btn){
            if(btn === 'yes'){
            	store.removeAll();
            	textHost.reset();
            	me.hosts=[];
            	me._bindIPData();
            	if(typeof(callback)=="function"){
            		callback();
            	}
            }
    	});
    },
    _copyAll:function(){
    	var me=this,
    	store=me.COMPONENTS.panelHostGrid.getStore(),
    	textHost=Ext.getCmp(me.id+'_hostsIP');
    	if(me._isEdit()==false){
    		return;
    	}
    	window.clipboaedData.setData("text",textHost.value);
    },
    //创建预览所有已选择IP窗口
    _showAllIPList:function(){
    	var me=this,
    		_winHeight=0,
    	 store = Ext.create('Ext.data.Store', {
            storeId:'allIPStore',	            
            pageSize: me.IP_MaxCount,//me.pageSize,
            fields:['isAgentOk','ip'],	            
            proxy: {
                type: 'memory'
            },
            listeners : {
            	datachanged:function(grid){
            		//数据变更时检查是否已清空
		    		//me._isEdit();
		    	}
            }
        });
    	store.loadData(me.hosts);
    	//创建预览列表
    	var allPanel=me._createGridPanel();
    	//加载所有数据
    	allPanel.getStore().loadData(me.hosts);

    	var win=Ext.create('Ext.window.Window', {
    	    title: '预览',
    	    minHeight:160,
    	    maxHeight:400,
    	    width: 400,
    	    layout: 'fit',
    	    modal:true,//遮罩效果
    	    items: [allPanel],
    	    buttons:[
    	             {
            	 	xtype : 'button',
                    text: "复制IP",
                    icon: "./images/copy2.png",
                    ref : '../btnCopy',
                    plugins: {
                        ptype: 'zeroclipboard',
                        onCopyComplete : function(client,opt){
                            if (!Ext.isEmpty(opt.text)) {
                                parent.Frame.insertMsg('ip列表已复制到剪贴板',1);
                            }
                        },
                        targetFunc:function(){
                        	var iplist=[];
                        	Ext.each(me.hosts,function(item){
                        		iplist.push(item.ip);
                        	});
                        	return iplist.join(";");
                        } 
                    }
    	    	},{
    	    		xtype:"button",text:"清空数据",width:100,height:25,handler:function(){
    	    			me._clearAll(function(){
    	    				allPanel.getStore().loadData(me.hosts);
    	    				win.close();
    	    			});
    	    			
    	    			}
    	    	}]
    	}).show();
    	return win;
    },
    _bindIPData:function(){
    	var me = this,
		grid = me.COMPONENTS.panelHostGrid,
		store = grid.getStore(),
		hosts = me.hosts,
		gridData=[],
		isOkCount=0;
	
    	var _title=this.findById(this.id + 'title');
		hosts.sort(function(a){
			
	        return a.isAgentOk===true ? 1 : -1;
	    });
		//控制显示行数
		Ext.each(hosts,function(item,i){
			if(item.isAgentOk){
				isOkCount++;
			}
			if(i<me.IP_MaxCount){
				gridData.push({"isAgentOk":item.isAgentOk,"ip":item.ip});
			}
			
		});
		_title.removeAll();
		if(hosts.length>0){
			_title.add({xtype:"box",html:'本次操作涉及服务器['+hosts.length+']台，仅['+isOkCount+']台支持操作'});
		}
		_title.setVisible(true);
		store.loadData(gridData);
    }
});