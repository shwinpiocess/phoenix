Ext.ns('Ext.ijobs.index');
Ext.Loader.setPath('Ext.ux','./js/extjs4/ux');
/**
 * 不显示控制台提示信息
 */
Ext.Compat.ignoreInfo = true;
Ext.Compat.showErrors = true;
Ext.Compat.silent = true;
Ext.define('Ext.ijobs.index.TreeMenu',{
	extend: 'Ext.Panel',	
    constructor : function(config){
        config = Ext.apply({
            region:'west',
//            split:true,
            header: false,
            width: 211,
            layout : 'fit',
            border : false,
            //minSize: 170,
            maxSize: 500,
            collapsible: true,
            //autoScroll:true,
            animCollapse:false,
            animate: false,
            style: 'padding: 6px 14px;background-color: #f6f6f6;',
            bodyStyle: 'background-color: #f6f6f6;',
            overflowX : 'hidden',
            overflowY : 'auto',
            id : 'leftmenu_div',
            collapseMode:'mini',
            cls : 'left-wrapper'
        },config);
        Ext.ijobs.index.TreeMenu.superclass.constructor.call(this,config);
    },
    initComponent : function(){
        Ext.ijobs.index.TreeMenu.superclass.initComponent.call(this);
        
    },
    onRender : function(ct, position){
        Ext.ijobs.index.TreeMenu.superclass.onRender.call(this,ct, position);
        this._createTreeView();      
    },

    _createTreeView : function(){
        var tpl = new Ext.XTemplate(
            //'<div class="left-wrapper">主导航</div>', 
                '<dl class="leftnav">',
                    '<dl class="x-item">',                   
                    '<tpl for=".">',
                        '<dt class="active"><span class="ico_desk"></span>{menu}</dt>',
                        '<tpl for="subMenu">',
                        '<dd class="x-item"><span class="nav_arrow"></span><a id="{id}" href="javascript:void(0);" to="{url}" tabTitle="{menu}">{menu}</a></dd>',
                        '</tpl>',
                    '</tpl>',
                    '</dl>',
                '</dl>'
        ),
		updateIndexes=function(startIndex, endIndex) {
        	var ns = this.all.elements,
            	records = this.store.getRange(),
            	i, j;
            
        	startIndex = startIndex || 0;
        	endIndex = endIndex || ((endIndex === 0) ? 0 : (ns.length - 1));
        	for(i = startIndex, j = startIndex - 1; i <= endIndex; i++){
            	if (Ext.fly(ns[i]).is('dl')) {
                	j++;
            	}
            
            	ns[i].viewIndex = i;
            
            	ns[i].viewRecordId = records[j].internalId;
            	if (!ns[i].boundView) {
                	ns[i].boundView = this.id;
            	}
            }
		};

        var store = Ext.create('Ext.data.Store', {
        	proxy : {
        		type : 'memory'
        	},
        	fields: ['menu','subMenu','url','id']
        });        
        var view = Ext.create('Ext.view.View', {
            store: store,
            tpl : tpl,
            itemSelector: '.x-item',
            listeners : {
            	itemclick : function(){
            		//console.log(arguments);
            	}
            },
            listeners: this.dvListeners,            
            renderTo : this.body,
            updateIndexes:updateIndexes
        });
        this.dataView = view;
    },
    loadMenuData : function(menuData){
        var view = this.dataView,
			store = view.getStore();
        store.loadData(menuData);
             
    }
});
Ext.define('Ext.ijobs.index.MainPanel',{
	extend:'Ext.Panel',
    constructor : function(config){
        config = Ext.apply({
            region : 'center',
            border :false,
            minWidth : 1089,
            layout : 'border',
            cls: 'right-wrapper'
        },config);
        Ext.ijobs.index.MainPanel.superclass.constructor.call(this,config);
    },
    requires:['Ext.ux.IFrame'],
    initComponent : function(){
    	//this.COMPONENT.masPanel = new Ext.ijobs.index.MessagePanel();
        this.items = [
            this._createTabPanel()//,
            //this.COMPONENT.masPanel
        ];
        Ext.ijobs.index.MainPanel.superclass.initComponent.call(this);
        
        Ext.apply(
            this.COMPONENT,{
            contentTab : Ext.getCmp('contentTab'),
            msgDialogIds : []
        });
    },
    COMPONENT : {},
    _createTabPanel : function(){
        var tab = Ext.create('Ext.tab.Panel',{
            id : 'contentTab',
            region:'center',
            style : 'background-color:#fcfcfc;',
            bodyStyle: 'border: none;',
            resizeTabs : true,
            minTabWidth: 115,     //最小tab宽度
            maxTabWidth: 260,
            cls : 'main-tab-panel',
            tabBar : {
            	height : 48,
            	padding: '16 12 0 12',  //tabbar左右间距
        		defaults : {
        			margin: '0 3',
        			height : 32,
        			cls :"x-tab-item-iJobs",//未选中样式
        			activeCls:"item-iJobs-active"//选中样式 .x-top-item-iJobs-active
        			//style:"background-image: none !important;background-color: #f2f2f2;"
        		}        		
        	},
            plain : true,
            border : false,
            plugins: new Ext.ux.TabCloseMenu({
                closeTabText : '关闭标签页（Ctrl+`）',
                closeOthersTabsText : '关闭其它标签页',
                closeAllTabsText : '关闭所有标签页'
            }),
            enableTabScroll: true,
            
            initEvents : function(){
                this.on('tabchange', this._tabchange,this);
                this.on('remove', this._remove,this);
            },
            
            _tabchange: function() {
                //this.el.dom.style.backgroundColor = '#fcfcfc';
            	//Ext.query('.x-tab-bar-strip-default-top')[0].style.display = '';
            },
            
            _remove: function() {
            	if (this.items.length === 0) {
            		//this.el.dom.style.backgroundColor = 'white';
            		//Ext.query('.x-tab-bar-strip-default-top')[0].style.display = 'none';
            	}
            },
            
            createNewTab : function(){
                var id = "tab-" + arguments[1];
                var tab = this.getComponent(arguments[1]) || this.getComponent(id),
                    silence = arguments[3] || false;
                var p = null,
                    visitLog = function(moduleName,moduleURL){
                        var modules = [{
                            key : /^编辑作业/,
                            getName : function(){
                                return '编辑作业';    
                            }
                        },{
                            key : /(^作业[\s\S]*主页$|^查看模版)/,
                            getName : function(){
                                return '作业模版主页';
                            }
                        },{
                            key : /^查看实例/,
                            getName : function(){
                                return '查看作业实例';
                            }
                        },{
                            key : /^执行作业/,
                            getName : function(){
                                return '执行作业';
                            }
                        },{
                            key : /^账户/,
                            getName : function(){
                                return '编辑执行账户';
                            }
                        },{
                            key : /^新建执行态/,
                            getName : function(){
                                return '新建执行态';
                            }
                        },{
                            key : /^编辑执行态/,
                            getName : function(){
                                return '编辑执行态';
                            }
                        },{
                            key : /^脚本【.*】主页$/,
                            getName : function(){
                                return '查看脚本';
                            }
                        },{
                            key : /^查看脚本/,
                            getName : function(){
                                return '查看脚本';
                            }
                        },{
                            key : /^编辑脚本/,
                            getName : function(){
                                return '编辑脚本';
                            }
                        },{
                            key : /^查看.*CC脚本$/,
                            getName : function(){
                                return '查看CC脚本';
                            }
                        },{
                            key : /^编辑.*CC脚本$/,
                            getName : function(){
                                return '编辑CC脚本';
                            }
                        },{
                            key : /^开发商集/,
                            getName : function(){
                                return '编辑开发商集';
                            }
                        },{
                            key : /^脚本【.*】主页$/,
                            getName : function(){
                                return '作业脚本主页';
                            }
                        },{
                            key : /^调试【.*】脚本主页$/,
                            getName : function(){
                                return '调试脚本主页';
                            }
                        },{
                            key : /^灰度授权脚本【.*】$/,
                            getName : function(){
                                return '灰度授权脚本';
                            }
                        },{
                            key : /^同步【.*】脚本主页$/,
                            getName : function(){
                                return '同步作业脚本';
                            }
                        },{
                            key : /^标准脚本【.*】主页$/,
                            getName : function(){
                                return '标准作业脚本主页';
                            }
                        }];
                        Ext.each(modules,function(module){
                            if (module.key.test(moduleName)) {
                                moduleName = module.getName();
                                return false;
                            }
                        });
                        moduleURL = /[\s\S]action\?|[\s\S]jsp\?/.test(moduleURL) ? moduleURL.substring(0,moduleURL.indexOf('?')) : moduleURL;
                        Ext.Ajax.request({
                            url : './admin/userClickLog.action',
                            params : {
                                label : moduleName,
                                link : moduleURL,
                                department : department,
                                user : uploadUserName
                            },
                            success : function(response,opts) {
                                
                            }
                        });
                    };
                if (tab) {
                    this.setActiveTab(tab);
                    return;
                }           
                if(typeof(arguments[0])==='object'){
                    p = this.add(
                        new Ext.Panel({
                            id:id,
                            title: arguments[2],
                            tabTip : arguments[2],
                            closable: true,
                            border: false,
                            layout : 'fit',                     
                            items:arguments[0]
                        })
                    );              
                }else{
                    var href=arguments[0];

                    p=this.add(Ext.create('Ext.ux.IFrame',{
                    	id:id,
                    	title: arguments[2],
                    	border: false,
                    	src:href,
                    	tooltip: arguments[2],
                    	width: this.getWidth() == 0 ? (document.body.clientWidth - 208): 'auto',
                    	height: this.getHeight() == 0 ? (document.body.clientHeight - 201): 'auto',
                    	closable:true,
                    	afterRender : function(comp){
                    		this.getEl().mask('加载中……','x-mask-loading');
                            this.on('load',function(tab){
                            	tab.iframeEl.unmask();
                            });
                        },
                       setTitle : function(title, iconCls){
                            this.title = title;
                            if(this.header && this.headerAsText){
                                this.header.child('span').update(title);
                            }
                            if(iconCls){
                                this.setIconClass(iconCls);
                            }
                            this.fireEvent('titlechange', this, title);
                            return this;
                        }                        
                    }));
                    //visitLog(arguments[2],arguments[0]);屏蔽点击统计
                }
                if (!silence) {
                    this.setActiveTab(p);
                }
        
            }
        });
        return tab;
    },
    createNewTab : function(url,id,title,silence){
        var tab = this.COMPONENT.contentTab;
        tab.createNewTab(url,id,title,silence);
    },
    clearMsg : function(){
        //Ext.getDom("msgDiv").innerHTML =  "";
    },    
    insertMsg: function(msg,type){
    	if(type==2){
    		type="error";
    	}
    	else if(type==1){
    		type="success";
    	}
    	var me=this;
    	if(me.msg){
    		me.msg.addItem({msg:msg,type:type})
    	}
    	else{
    		me.msg=new Ext.ijobs.index.msgTip();
    		me.msg.addItem({msg:msg,type:type});
    	}
    	
    	
    	
    	var msg=new Ext.ijobs.index.msgBox({
    		title:"提示",
    		context:msg,
    		msgType:type,
    		btns:[
    		      //{text:"关闭",handler:function(text){
    					//msg.close();
    				//}
    			//}
    		]
    	});
    	
    }
});

Ext.define('Ext.ijobs.index.MessagePanel',{
	extend:'Ext.Panel',
    constructor : function(config){
        config = Ext.apply({
            stateId : 'ijobs-viewport-msgPanel',
            region: "south",
            margins: "1px 1px 0px 1px",
            border: false,
            header: false,
            split: true,
            collapsed: false,
            collapsible: true, //false,
            collapseFirst: false,
            enableTabScroll: true,
            animCollapse: false,
            animate: false,
            collapseMode: "mini",
            closable: true,
            height: 60,
            layout : 'border',
            isCollapse: false
        },config);
        Ext.ijobs.index.MessagePanel.superclass.constructor.call(this,config);
    },
    initComponent : function(){
        this.items = [
            this._createTipPanel()
        ];
        
        Ext.ijobs.index.MessagePanel.superclass.initComponent.call(this);
    },
    
    initEvents : function(){
        Ext.ijobs.index.MessagePanel.superclass.initEvents.call(this);
        		
        this.on('collapse', this._collapse,this);
        this.on('expand', this._expand,this);
    },
    
    _collapse: function( p, eOpts ) {
    	this.isCollapse = true;
    },
    
    _expand: function( p, eOpts ) {
    	this.isCollapse = false;
    },
    
    _createTipPanel : function(){
        var panel = new Ext.Panel({
            height: 45,
            border :false,
            region: "center",
            xtype : 'panel',
            autoScroll : true,
            html: "<div id='msgDiv' style='float:left'></div><div style='float:right'><input type='button' style='width:80px;'  onclick='Frame.cleanInfos()' value='清空'/></div>"      
        });
        return panel;
    }
});
Ext.onReady(function(){
    Ext.QuickTips.init();
    Ext.state.Manager.setProvider(new Ext.state.CookieProvider());
    var mainPanel = new Ext.ijobs.index.MainPanel({
        boxMinWidth : 1130,
        listeners : {
        	afterrender : function(){//如果有默认首页就打开设置的页面
        		var homepage = Ext.util.Cookies.get('__homepage');
        		if(!Ext.isEmpty(homepage)){
        			var pages = Ext.decode(homepage);
        			if(!Ext.isEmpty(pages.herf)){
        				mainPanel.createNewTab(pages.herf, Math.random(), pages.text);
        			}
        			
        		}else{//默认为作业执行历史
        			//mainPanel.createNewTab('./jobs/taskIList.jsp', Math.random(), '作业执行历史');
        			mainPanel.createNewTab('./common/help2.html', 'help', '使用帮助');
        		}
        		//setTimeout(function(){
        			//不延时，作业执行历史tab的渲染会出问题，表格展示挂了
        		//	Frame.createNewTab('./common/help2.jsp','help', '使用帮助');
        		//},80);
        	},
        	/**
    		 * 帮助信息
    		 */
        	boxready : function(){      		
        		/* 隐藏帮助信息
        		 * var btn = Ext.get('nav');
        		var submenu = Ext.select('.submenu').hide();
        		var hideEventId;
        		var hide = function(){
        			submenu.hide();
        		};
        		var show = function(){
        			submenu.show();
        		};
        		btn.on('mouseenter',function(){        			
        			show();
        			clearTimeout(hideEventId);
        		});
        		btn.on('mouseleave',function(){
        			hideEventId = Ext.Function.defer(function(){
        				hide();
        			}, 500);        			
        		});*/
        		  
        	}
        }
    });
    var treeMenu = new Ext.ijobs.index.TreeMenu({
        dvListeners: {
            "itemclick": function(view, record, item, index, e) {
               
                var node = e.target,
					title = node.getAttribute('tabTitle'),
					href = node.getAttribute('to'),
					id = node.id;
				if(!title)return;
                Ext.each(Ext.query('dd'),function(dd){                    
                    Ext.get(dd).removeCls('active');
                });
                Ext.fly(node.parentNode).addCls('active');
                mainPanel.createNewTab(href, id, title);
            }
        }        
    });    
    /**
     * 全局方法
     */
    window.Frame = {
        /**
         * 防止session过期
         */
         keepSessionAlive : function(s_url){
            Ext.TaskManager.stop(window.Frame.taskInvokeSessionAlive);
            if(!window.sessionWin){
              //自动关闭弹窗的页面
              //s_url = 'http://ijobs.qcloud.com/ijobs/common/refresh.jsp?u='+s_url; 
            	s_url = 'http://'+window.location.host+window.location.pathname+'common/refresh.jsp?u='+s_url; 
              //QQ登录接口
              var url = 'http://ui.ptlogin2.qcloud.com/cgi-bin/login?hide_title_bar=1&bgcolor=ffffff&no_verifyimg=1&link_target=blank&style=12&appid=543009503&target=self&enable_qlogin=0&s_url='+s_url;  
              window.sessionWin = new Ext.window.Window({
                    height : 305,
                    width : 418,
                    modal : true,
                    header : false,
                    resizable : false,
                    padding : 0,
                    bodyBorder : false,
                    border : false,
                    frame : true,
                    listeners : {                    	
                        close : function(){
                            window.sessionWin = null;
                            Ext.TaskManager.start(window.Frame.taskInvokeSessionAlive);
                        }
                    },
                    shadowOffset  : 7,
                    style : 'overflow: visible;border-radius: 0px;border: none;box-shadow: 0 3px 26px rgba(0, 0, 0, .9);',
                    bodyStyle : 'overflow: visible;',
                    html : "<a id=\"login_window_close_btn\" class=\"aui_close\" href=\"javascript:window.sessionWin.close();\">×</a><iframe id='login_frame' name='login_frame' scrolling='auto' src='"+ url +"' frameborder='0' height='100%' width='100%'></iframe></div>"              
                }).show();              
            }
  
        },
        /**
         * 定时任务：600s请求一次session状态，当http的status为999或者为0时才触发登录
         */
        taskInvokeSessionAlive : {
            run : function(){
                Ext.Ajax.request({
                    url : './personal/isSessionAlive.action',
                    success : function(response,opts) {
                        var status = response.status;
                        if (999 ===status  || 0===status) {
                            window.Frame.keepSessionAlive();
                        }
                    },
                    failure : function(response,opts) {
                        var status = response.status;
                        if (999 ===status  || 0===status) {
                            window.Frame.keepSessionAlive();
                        }
                    } 
                });
            },
            interval : 1000//改为5分钟请求一次
            //interval : 300 * 1000//改为5分钟请求一次
        },        
        getBody : function(){
            return Ext.getBody();  
        },
        insertMsg: function(msg,type){
            mainPanel.insertMsg(msg,type);
        },
        getCurUser: function() {
            return uploadUserName;
        },
        createNewTab: function() {
            arguments.length!==1 ?          
            mainPanel.createNewTab(arguments[0], arguments[1], arguments[2], arguments[3]) : mainPanel.createNewTab(arguments[0]);
        },
        
        getActiveTab: function() {
            return mainPanel.COMPONENT.contentTab.getActiveTab();
        },
        
        closeTab: function(id) {
            mainPanel.COMPONENT.contentTab.remove(id);
        },
        
        setTabTitle: function(id, title) {
            mainPanel.COMPONENT.contentTab.getItem(id).setTitle(title);
        },
        cleanInfos : function(){
            mainPanel.clearMsg();
        },
        getTabTitle: function(id) {
            return mainPanel.COMPONENT.contentTab.getItem(id).title;
        }};
 
    
    /**
     * 构造主页布局
     */
    Ext.create('Ext.Viewport',{
        layout:'border',
        autoScroll : true,
        minWidth : 1300,
        items:[{
                region:'north',
                xtype:'box',
                el:'header',                
                minWidth : 1300
            },treeMenu,mainPanel]
    });
    
    /**
     * 构造主页菜单及点击事件
     */
    (function(){
    	var v3_topmenu = {
        	user: {cls:'user-center', name: '个人中心'},	
            job: {cls:'job-manage', name: '作业管理'},	
            step: {cls:'step-component', name: '步骤组件'},	
            set: {cls:'set', name: '设置'},	
            data: {cls:'data-statistics', name: '数据统计'},	
            admin: {cls:'admin-entrance', name: '管理员入口'},
            help: {cls:'help', name: '使用帮助'}
        };
    	
        var mainMenu = [];
        /**
         * 构造主页顶部菜单
         */
        var buildTopMenu = function(){
            var lis = [];
            var dh = Ext.DomHelper;     
            if(isAdmin){
                if (isGeneralVersion) {
                    mainMenu = Docs_general.Menu;
                } else {
                    mainMenu = Docs.Menu;
                }
            }else{
                if (isGeneralVersion) {
                    mainMenu = Docs_user_general.Menu;
                } else {
                    mainMenu = Docs_user.Menu;
                	//mainMenu = Docs.Menu;
                }
            }
            
            Ext.each(mainMenu, function(menu){
            	lis.push({
                    tag: 'li',
                    cls: v3_topmenu[menu.id].cls,
                    html: '<h4>'+v3_topmenu[menu.id].name+'</h4>'
                });
            });
            dh.append('topmenu', lis);
            
        };
        
        /**
         * 构造主页左面的菜单
         */
        var buildLeftMenu = function(menus){
            var _menus = [];
            var _subMenus = [];
            if(menus.isMutilLevel){
                var secLevelMenu = menus.children;
                Ext.each(secLevelMenu,function(secMenu,secIndex){
                    Ext.each(secMenu.children,function(thridMenu,thridIndex){
                        _subMenus.push({
                            id : menus.id+"_"+secIndex+"_"+thridIndex,
                            menu : thridMenu.text,
                            url : thridMenu.href
                        });
                    });
                    _menus.push({
                        menu : secMenu.text,
                        subMenu : _subMenus
                    });
                    _subMenus = [];
                });
            }else{
                Ext.each(menus.children,function(menu,index){
                    _subMenus.push({
                        id : menus.id+"_"+index,
                        menu : menu.text,
                        url : menu.href
                    });
                });
                _menus.push({
                    menu : menus.text,
                    subMenu : _subMenus
                });
            }
            treeMenu.loadMenuData(_menus);
            bindLeftNav();
        };
        
        var bindLeftNav = function(){
        	//主导航图标上的点击菜单
        	//return;
            //var treeMenuEl = treeMenu.getEl();
            var navs = [];
            Ext.each(mainMenu,function(menu){
                navs.push({
                    text : menu.text,
                    handler : function(){
                        var navDom = Ext.query('#header>ul[id="topmenu"]>li[class*="'+menu.id+'"]')[0],
                            navEl = Ext.get(navDom),
                            className = navEl.getAttribute('class'),
                            hoverClass = className;// + '_hover';
                        navEl.addCls(hoverClass);
                        navEl.removeCls(className);
                        navDom.click();
                    }
                });
            });
            
            var navMenu = new Ext.menu.Menu({
                items : navs
            });  
            
            /*var navdiv = Ext.query('div[class="leftmenu_head"]')[0];
            var navDivEl = Ext.get(navdiv);
            navDivEl.on('click',function(e){
                navMenu.showAt(e.getXY());
            });*/
        };
        
        /**
         * 绑定主页上方菜单点击事件及样式变化
         */
        var applyTopMenuHover = function(){
            var menus = Ext.query('#header>ul[id="topmenu"]>li');
            Ext.each(menus,function(menu,index){
                menu = Ext.get(menu);
                var className = menu.getAttribute('class');
                var hoverClass = className;// + '_hover';
                var selectClass = "active";
                menu.hover(function(){    
                    if(!menu.hasCls(selectClass)){
                        menu.addCls(hoverClass);
                        //menu.removeCls(className);
                    }
                },function(){
                    if(!menu.hasCls(selectClass)){
                        menu.addCls(className);
                        //menu.removeCls(hoverClass);
                    }
                });
                menu.on('click',function(){
                    var selectedMenus = Ext.query('#header>ul[id="topmenu"]>li[class*="active"]');
                    Ext.each(selectedMenus,function(selectedMenu){
                        selectedMenu = Ext.get(selectedMenu);
                        if(menu === selectedMenu){
                            return false;
                        }
                        selectedMenu.removeCls(selectClass);
                        
                        //判断：点击后，有的地方需要更新左侧菜单+右侧内容；有的只需在右侧打开一个tab。
                        if( mainMenu[index].onlyOpenTab ){
                        	Frame.createNewTab( mainMenu[index].tabUrl, 'help', mainMenu[index].tabTitle);
                        }else{
                        	buildLeftMenu(mainMenu[index]);
                        }
                        //var hoverClass = selectedMenu.getAttribute('class');
                        //var normalClass = hoverClass.replace('_hover','');
                        //selectedMenu.removeCls(hoverClass);
                        //selectedMenu.addCls(normalClass);
	                    
	                    menu.addCls(selectClass);                           
                    });             
                });
            });
        };
        
        /**
         * 解析外链
         * **/
        var autoGoDirectlink = function(){
            var url = window.location.href;
            if (url.indexOf("directlink") != -1) {
                var arr    = url.split("/");
                var action = "./jobs/" + arr[arr.length - 1];
                 Ext.defer(function(){
                	window.Frame.createNewTab(action, Math.random(), "查看执行作业")
                },1000);
            }
        };
        
        var autoGoStatDirectlink = function(){
            var url = window.location.href;
            if (url.indexOf("statdirectlink") != -1) {
                var arr    = url.split("/");
                var action = "./statistics/" + arr[arr.length - 1];
                window.Frame.createNewTab(action, Math.random(), "统计数据查看");
            }
        };
        var changeAppID=function(appid){
        	Ext.Ajax.request({
                url: "./bk/personal/roleAction!updateDefaultApplication.action",
                method: 'POST',
                params: {
                    'appId': appid
                },
                success: function (response) {
                	var result = Ext.decode(response.responseText);
                	var success = result.success;
                    if(success){
                    	APPID=appid;
                    }
    	            if (result.msg&&result.msg.message) {
    	            	window.Frame.insertMsg(result.msg.message, result.msg.msgType);
    	            }
                },
                failure: function (error) {
                	window.Frame.insertMsg("服务器异常！","error");
                }
            });
        }
        /**
         * 初始化菜单选中样式及左边菜单
         */
        var initApp = function(){
            autoGoDirectlink();
            autoGoStatDirectlink();
            buildTopMenu();
            
            applyTopMenuHover();
            //暂时注释轮询Ext.TaskManager.start(window.Frame.taskInvokeSessionAlive);
            var index = 1;//默认选中作业管理
            var menu = Ext.get(Ext.query('#header>ul[id="topmenu"]>li')[index]);
            
            var normalCls = menu.getAttribute('class');
            var overCls = normalCls;// + '_hover';
            menu.set({'class' : overCls + ' active'});
            Ext.defer(function(){
            	buildLeftMenu(mainMenu[index]);
            },30);
            roleInfo = Ext.isObject(roleInfo) ? roleInfo : {};
            if(isAdmin){
            	var store = Ext.create('Ext.data.Store', {
            	    autoLoad: true,
                    autoDestroy: true,
                    fields: ["id", "applicationName"],
                    proxy: {
                    	type: 'ajax',
                    	url: './bk/jobs/getAppList.action',
                    	reader: {
                            type: 'json',
                            root: "data"
                        }
                    },
                    listeners:{
                    	load:function(){
                    		
                    		//数据加载完成后绑定初始值
                    		Ext.getCmp("combox_admin").setValue(parseInt(Ext.value(APPID, -1), 10));
                    	}
                    }
            	});
            	Ext.create('Ext.form.ComboBox', {
            		id:"combox_admin",
            		editable: true,
            	    enableRegEx : true,
            	    forceSelection : true,
            		queryMode: 'local',
            	    fieldLabel: '开发商',
            	    store: store,
            	    valueField: 'id',
                    displayField: 'applicationName',
            	    renderTo: Ext.get('lblAppNames'),
            	    width:260,
            	    labelWidth: 60,
            	    //value:parseInt(Ext.value(APPID, -1), 10),
            	    labelCls:"ijobs-appcombox",
            	    listeners:{
            	    	select:function(com, newValue, oldValue, eOpts){
            	    		changeAppID(com.value);
            	    	}
            	    },
            	    doLocalQuery: function(queryPlan) {
            	        var me = this,
            	            queryString = queryPlan.query;
            	        
            	        if (!me.queryFilter) {
            	            me.queryFilter = new Ext.util.Filter({
            	                id: me.id + '-query-filter',
            	                anyMatch: me.anyMatch,
            	                caseSensitive: me.caseSensitive,
            	                root: 'data',
            	                property: me.displayField
            	            });
            	            me.store.addFilter(me.queryFilter, false);
            	        }
            	        if (queryString || !queryPlan.forceAll) {
            	            me.queryFilter.disabled = false;
            	            queryString = queryString.replace(/\(/igm,'\\(')
            	                        .replace(/\)/igm,'\\)')
            	                        .replace(/\[/igm,'\\[')
            	                        .replace(/\[/igm,'\\]')
            	                        .replace(/\*/igm,'\\*');
            	            me.queryFilter.setValue(me.enableRegEx ? new RegExp(".*" + queryString + ".*", "i") : queryString);
            	        }

            	        else {
            	            me.queryFilter.disabled = true;
            	        }

            	        me.store.filter();

            	        if (me.store.getCount()) {
            	            me.expand();
            	        } else {
            	            me.collapse();
            	        }

            	        me.afterQuery(queryPlan);
            	    }
            	});
            	//Ext.get('lblAppNames').update('用户：'+roleInfo.roleName);
            }
            else{
            	Ext.get('lblAppNames').update("用户："+APPNAME);
            }
            /*
            Ext.QuickTips.register({
                target: 'lblAppNames',
                text: roleInfo.appsName,
                trackMouse : true,
                dismissDelay: 60 * 1000
            });
            */
            /*Ext.get('lnkAgentMgr').addListener('click',function(e){
                window.Frame.createNewTab('./jobs/agentMgr.jsp','AgentMgr','Agent monitor');    
            });*/
            /*Ext.get('TSCStatusMgr').addListener('click',function(e){//tsc系统运行状态
                window.Frame.createNewTab('./admin/tscMgr.jsp','TSCMgr','TSC系统运行状态');    
            });*/
            /*注销按钮的事件绑定Ext.get('lnkLogout').addListener('click',function(e){
                window.location.href = "http://passport.oa.com/modules/passport/signout.ashx?url=" + window.encodeURIComponent(basePath);
            });*/            
        }();
        
        /**
         * 当角色为访客时，显示提示框申请权限
         */
        if(isAdmin === false){
	        if(Ext.isEmpty(userRole) && roleInfo.roleName === '访客'){
	        	var tipTask = '';
	        	closeTopTip = function(){
	        		if(tipTask){
	        			Ext.TaskManager.stop(tipTask);
	        		}
	        		Ext.getCmp('_topTip').close();
	        	};
	        	var w = new Ext.Window({
	        		id : '_topTip',
	        		modal :true,//遮罩
	        		width : 400,	
	        	    height : 200,
	        		closable:false,
	        		closeAction : 'close',
	        		//draggable : false,//拖动
	        		resizable : false,//改变窗口大小
	        		title : '提示',
	        		items : [{
	        			xtype : 'box',
	        			style : 'width:380px;padding:40px 5px;font-size:14px;',
	        			html : '您当前在iJobs系统的权限角色为：<span style="color:red;">访客</span>，只能使用部分查询功能，如需要执行作业等权限请点击跳转至“<a style="text-decoration:underline;color:red" target="_blank" href="http://sec.cm.com/RightApplyPersonal/?sys_id=510" onclick="closeTopTip()">敏感权限系统</a>”申请权限'
	        		}],
	        		buttonAlign : 'center',
	        		buttons : [{
	        			itemId : 'btnClose',
	        			disabled : true,
	        			text : '关闭 (5)'
	        		}],
	        		listeners : {
	        			show : function(win){
	        				var btn = win.down('button[itemId="btnClose"]');
	        				var _tipTask = {
	        						run : function(){
	        							if(this.number === 0){
	        								btn.setText('关闭');
	        								btn.setDisabled(false);
	        								btn.on('click',function(){
	        									win.close();
	        								});
	        								return false;//返回false停止定时器
	        							}
	        							text = '关闭 (' + this.number + ')';
	        							this.number = this.number-1;
	        							btn.setText(text);
	        						},
	        						number : 5,
	        						interval : 1000
	        				};
	        				tipTask = Ext.TaskManager.start(_tipTask);
	        			}
	        		}
	        	
	        	});
	        	w.show();
	        }
        }
        
    }());
});

/*头部弹出提示信息 */
/*
 * msgType: alert error success warn
 */
Ext.define('Ext.ijobs.index.msgBox', {
    extend: 'Ext.Panel',
    constructor: function (config) {
        config = Ext.apply({
        	timeSpan:config.hasOwnProperty("timeSpan")?config.timeSpan:3000,
        	msgType:"warn",
        	
        }, config);
        var me=this;
    	me.callParent(arguments);
    },
    initComponent: function () {
        var me = this;
        me.items = [me._initMsg()];
        var me=this;
    	me.callParent(arguments);
    },
    _createBox:function(type){
    	var me=this;
    	var html=[];
    	var msgClass="";
    	switch(type){
    		case "error":
    			msgClass="msg-error";
    			break;
    		case "success":
    			msgClass="msg-success";
    			break;
    		case "warn":
    			msgClass="msg-warning";
    			break;
    		case "alert":
    			msgClass="msg-alert";
    			break;
			default:
				msgClass="msg-warning";
				break;
    	}
    	html.push('<div class="msg '+msgClass+' msg-shadow">');
    	html.push('	<div class="msg-title">');
    	html.push('		<span class="msg-title-text">' + me.title + '</span><span id="'+me.id+'_msg_close" class="msg-close" title="关闭">&nbsp</span>');
    	html.push('	</div>');
    	html.push('	<div class="msg-context"><div>');
    	html.push('		<div class="msg-contxt-text">' + me.context + '</div>');
    	html.push('	</div>');
    	html.push('	<div class="msg-btn-box">');
    	for(var i=0;me.btns&&i<me.btns.length;i++){
    		html.push('		<a class="msg-btn-item" href="javascript:void(0)" id="'+me.id+'_msgBtn_'+i+'">'+me.btns[i].text+'</a>');
    	}
    	html.push('	</div>');
    	html.push('</div>');
    	return html.join('');
    },
    _clearTimer:function(){
    	var me=this;
    	if(!me.timer){
    		return;
    	}
    	clearTimeout(me.timer);
		me.timer=null;
    },
    _setTimer:function(){
    	var me=this;
    	me.timer=setTimeout(function(){
        	me.close();
        },me.timeSpan);
    	return me.timer;
    },
    close:function(){
    	var me=this;
    	if(!me.openMsg){
    		return null;
    	}
    	me.openMsg.ghost("t", { delay: 100, remove: false,callback :function(){
				if(me.body){
					me.body.remove();
					me=null;
				}
	    	}
    	});
    },
    _getID:function(){
    },
    _index:10000,
    _initMsg:function(){
    	var me=this;
    	//me._close();
    	var index=Ext.query(".msg-body").length?me._index+Ext.query(".msg-body").length:me._index;
    	var msgCt=Ext.DomHelper.insertFirst(document.body, {id:me.id,"class":"msg-body","style":'z-index:'+index+''}, true);
        var m = Ext.DomHelper.append(msgCt, this._createBox(me.msgType), true);
        m.hide();
        //渐变显示
        me.openMsg=m.slideIn('t');
        //设定超时隐藏
        me._setTimer();
        me.body=Ext.getDom(me.id,this);
        me.closeBtn=Ext.getDom(me.id+'_msg_close',this);
        me.moreBtn=[];
        for(var i=0;me.btns&&i<me.btns.length;i++){
        	
        	var btn=Ext.getDom(me.id+'_msgBtn_'+i,this);
        	btn.index=i;
        	btn.item=me.btns[i];
        	if(typeof(me.btns[i].handler)=="function"){
        		btn.onclick=function(){
        			this.item.handler(this.item.text,this.item);
        		};
    		}
        	me.moreBtn.push(btn);
    	}
        Ext.getDom(me.id+'_msg_more',this);
        
        me.body.onmousemove=function(){
        	me._clearTimer();
        };
        
        me.body.onmouseleave=function(){
        	me._setTimer();
        };
        
        me.closeBtn.onclick=function(){
    		me.close();
        };
        
        return me;
    }
});

//消息历史记录列表

Ext.define('Ext.ijobs.index.msgTip', {
    extend: 'Ext.Panel',
    constructor: function (config) {
        var me=this;
    	me.callParent(arguments);
    },
    initComponent: function () {
        var me = this;
        me.items = [me._initMsg()];
        var me=this;
    	me.callParent(arguments);
    },
    _tipTip:Ext.getDom("msg-tip"),
	_tipMenu:Ext.getDom("msg-menu"),
	_tipBox:Ext.getDom("msg-tip-box"),
	_tipClearBtn:Ext.getDom("msg-tip-clearBtn"),
	_time:1000,
	msgData:[
	         //{msg:"test",type:"error"}
	         ],
	_setTimer:function(){
		var me=this;
		this.timer= setTimeout(function(){
			me.hide();
		},this._time);
	},
	_clearAllMsg:function(){
		var me=this;
		me.msgData=[];
		me._initMsgBody();
		me._tipBox.innerHTML='<li class="msg-tip-empty">记录已清空</li>';
		me._tipClearBtn.style.display="none";
	},
	_initMsgBody:function(){
		var me=this;
		if(me.msgData.length<=0){
			me._tipBox.innerHTML='';
		}
	},
	_newItem:function(item){
		var me=this;
		me._initMsgBody();
		var dateTime=Ext.Date.format(new Date(), 'Y-m-d H:i:s');
		switch(item.type){
			case "error":
				me._tipBox.innerHTML='<li class="msg-tip-error"><span class="msg-tip-time">【'+dateTime+'】</span>&nbsp<span class="msg-tip-context">'+item.msg+'</span></li>'+me._tipBox.innerHTML;
				break;
			case "success":
				me._tipBox.innerHTML='<li class="msg-tip-success"><span class="msg-tip-time">【'+dateTime+'】</span>&nbsp<span class="msg-tip-context">'+item.msg+'</span></li>'+me._tipBox.innerHTML;
				break;
			case "warn":
				me._tipBox.innerHTML='<li class="msg-tip-warning"><span class="msg-tip-time">【'+dateTime+'】</span>&nbsp<span class="msg-tip-context">'+item.msg+'</span></li>'+me._tipBox.innerHTML;
				break;
			default:
				me._tipBox.innerHTML='<li class="msg-tip-warning"><span class="msg-tip-time">【'+dateTime+'】</span>&nbsp<span class="msg-tip-context">'+item.msg+'</span></li>'+me._tipBox.innerHTML;
				break;
		};
		me.msgData.splice(0,0,item);
		if(!me.newMsgtimer){
			me.setNewMsgClass();
		}
	},
	clearMsgClass:function(){
		var me=this;
		if(!me.newMsgtimer){
			return;
		}
		clearTimeout(me.newMsgtimer);
		me._tipMenu.style.border="";
		me.newMsgtimer=null;
	},
	setNewMsgClass:function(){
		var me=this;
		if(me._tipMenu.style.border==""){
			me._tipMenu.style.border="1px solid rgb(239, 142, 157)";
		}
		else{
			me._tipMenu.style.border="";
		}
		
		me.newMsgtimer=setTimeout(function(){
			me.setNewMsgClass();
		},350);
	},
	_clearTimer:function(){
		var me=this;
		if(this.timer){
			clearTimeout(me.timer);
			me.timer=null;
		};
	},
	
	addItem:function(item){
		var me=this;
		me._tipClearBtn.style.display="block";
		me._newItem(item);
	},
	show:function(){
		this._tipTip.style.display="block";
	},
	hide:function(){
		this._tipTip.style.display="none";
	},
	_initMsg:function(){
		var me=this;
		me._tipMenu.onmouseover=function(){
			me._clearTimer();
			me.show();
			me.clearMsgClass();
		};
		
		me._tipClearBtn.onclick=function(){
			me._clearAllMsg();
		};
		
		me._tipMenu.onmouseleave=function(){
			me._setTimer();
		};
		
		me._tipTip.onmouseover=function(){
			me._clearTimer();
		};
		
		me._tipTip.onmouseleave=function(){
			me._setTimer();
		};
		
		me._tipTip.onmouseleave=function(){
			me._setTimer();
		};
	}
});
		
