function HashSet(array_size, key_form_callback){
	this.hash_size = array_size;
	this.hash_table = Array(array_size);
	this.keyForm = key_form_callback == "" ? default_keyForm : key_form_callback;
	
	this.enumErr = {KeyGenFail:-4, KeyAddFail:-3, KeyMustBeString:-2, DonNotFindKey:-1};
	this.enumConst = {DefKeyValue:-1};
	
	this.__init = function(){
        var i = 0;
        
        for(i = 0; i < this.hash_size; i++){
        	this.hash_table[i] = this.enumConst.DefKeyValue;
        }
  }
  
  this.__init();
}

HashSet.prototype.default_keyForm = function(data){
	var i = 0, result=0;
	 for(i = 0; i < data.length; i++){
		 result += data[i]*i;
	 }

	 return result >= 0 ? result : -result;
}

HashSet.prototype.FindKey = function(rawKey){
	var hash_index = 0, i = 0, key = 0, result = this.enumErr.DonNotFindKey;

	if("string" != (typeof rawKey))
		return this.enumErr.KeyMustBeString;
	
	key = this.keyForm(rwaKey);
	
	hash_index = key % this.array_size;

	if('NaN' == String(hash_index)) return this.enumErr.KeyGenFail;

	while(i++ < this.hash_size && key != this.hash_table[hash_index]) {
	   hash_index = hash_index - 1 < 0 ? this.hash_size - 1 : hash_index - 1;
	}

	if(i <= this.key) result = hash_index;

	return result;
};

HashSet.prototype.AddKey = function(rawKey){
	var key = 0, i=0, hash_index, result = this.enumErr.KeyAddFail;
	
	if("string" != (typeof rawKey))
		return this.enumErr.KeyMustBeString;
	
	key = this.keyForm(rwaKey);
	
	hash_index = key % this.array_size;
	
	if('NaN' == String(hash_index)) return this.enumErr.KeyGenFail;
	
	while(i++ < this.hash_size){
		
		if(this.hash_table[hash_index] != this.enumConst.DefKeyValue){
			hash_index = hash_index - 1 < 0 ? this.hash_size - 1 : hash_index - 1;
			continue;
		}
		
		this.hash_table[hash_index] = key;
		result = hash_index;
	}
	
	if(this.enumErr.KeyAddFail == result && i == this.hash_size){
		result = this.hash_size;
		this.hash_table[this.hash_size++] = key;
	}
	
	return result;
}

function copyToClipboard(txt) {
    Ext.MessageBox.minWidth=300 ;
    if(window.clipboardData) { 
        window.clipboardData.clearData(); 
        window.clipboardData.setData("Text",txt); 
        return true;
    } else if(navigator.userAgent.indexOf("Opera")!= -1) { 
        window.location = txt; 
    } else if (window.netscape) { 
        try { 
            netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect"); 
        } catch (e) { 
//            Ext.Msg.alert("<br/><br/>您的firefox安全限制限制您进行剪贴板操作，<br/>请打开'about:config'将<br/>signed.applets.codebase_principal_support'<br/>设置为true'之后重试");
            printMsg("您的firefox安全设置限制您进行剪贴板操作，请打开'about:config'将signed.applets.codebase_principal_support'设置为true'之后重试", 1);
            return false; 
        } 
        var clip = Components.classes["@mozilla.org/widget/clipboard;1"].createInstance(Components.interfaces.nsIClipboard); 
        if (!clip) 
            return false; 
        var trans = Components.classes["@mozilla.org/widget/transferable;1"].createInstance(Components.interfaces.nsITransferable); 
        if (!trans) 
            return false; 
        trans.addDataFlavor('text/unicode'); 
        var str = new Object(); 
        var len = new Object(); 
        var str = Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString); 
        var copytext = txt; 
        str.data = copytext; 
        trans.setTransferData("text/unicode",str,copytext.length*2); 
        var clipid = Components.interfaces.nsIClipboard; 
        if (!clip) 
            return false; 
        clip.setData(trans,null,clipid.kGlobalClipboard); 
        return true;
    } 
}
//修正s.gif一直加载，导致权限问题
Ext.BLANK_IMAGE_URL = "./images/s.gif";

/**
 * 扩展原生方法
 */
(function(){
	if (!('filter' in Array.prototype)) {
	    Array.prototype.filter= function(filter, that /*opt*/) {
	        var other= [], v;
	        for (var i=0, n= this.length; i<n; i++)
	            if (i in this && filter.call(that, v= this[i], i, this))
	                other.push(v);
	        return other;
	    };
	}
})();
/**
 * 常用工具包类
 * @author v_jfdong
 * @description
 * 1、简单封装Extjs中的ajax
 * 2、提供查询条件fieldset显示隐藏效果
 * 3、“回车换行符”替换成“换行”
 * @requires extjs
 */
Ext.ns('Ext.ijobs.common');
Ext.ijobs.common.Kit = function(){
	Ext.override(Ext.toolbar.Paging,{
	    // @private
	    onLoad : function(){
	        var me = this,
	            pageData,
	            currPage,
	            pageCount,
	            afterText,
	            count,
	            isEmpty,
	            item;

	        count = me.store.getCount();
	        isEmpty = count === 0;
	        if (!isEmpty) {
	            pageData = me.getPageData();
	            currPage = pageData.currentPage;
	            pageCount = pageData.pageCount;
	            afterText = Ext.String.format(me.afterPageText, isNaN(pageCount) ? 1 : pageCount);
	        } else {
	            currPage = 0;
	            pageCount = 0;
	            afterText = Ext.String.format(me.afterPageText, 0);
	        }

	        Ext.suspendLayouts();
	        item = me.child('#afterTextItem');
	        if (item) {    
	            item.setText(afterText);
	        }
	        item = me.getInputItem();
	        if (item) {
	            item.setDisabled(isEmpty).setValue(currPage);
	        }
	        me.setChildDisabled('#first', currPage === 1 || isEmpty);
	        me.setChildDisabled('#prev', currPage === 1 || isEmpty);
	        me.setChildDisabled('#next', currPage === pageCount  || isEmpty);
	        me.setChildDisabled('#last', currPage === pageCount  || isEmpty);
	        me.setChildDisabled('#refresh', isEmpty);//当没有加载数据时，刷新按钮禁用
	        me.updateInfo();
	        Ext.resumeLayouts(true);

	        if (me.rendered) {
	            me.fireEvent('change', me, pageData);
	        }
	    }    
	});
	/**
	 * 重写findById方法，支持容器通过itemId不限层级查找组件
	 */
	Ext.override(Ext.Container,{
	    findById : function(id){
	        var m = null, 
	            ct = this;
	        this.cascade(function(c){
	            if(ct != c && (c.id === id || c.itemId === id)){
	                m = c;
	                return false;
	            }
	        });
	        return m;
	    }
	}); 

	Ext.override(Ext.AbstractComponent,{
		removeCls : function(cls) {
	        var me = this,
	            el = me.rendered ? me.el : me.protoEl;

	        if(el){
	        	el.removeCls.apply(el, arguments);
	        }	        
	        return me;
	    }
	});
	
	/*
	 * Ext.each(btnMains,function(btn){
                var table =Ext.get(btn).findParentNode("table[class]");
                btn.className =  "btn btn-primary";
            });
            Ext.each(btnSecs,function(btn){
                 var table =Ext.get(btn).findParentNode("table[class]");
                 btn.className = "btn btn-info";
            });
            
            Ext.each(btnQuerys,function(btn){
                var table =Ext.get(btn).findParentNode("table[class]");
                btn.className =  "btn btn-primary";
            });
	 * */
/**
 * 改变按钮样式
 */
	/*Ext.override(Ext.button.Button, {
		initComponent: function() {
	        var me = this;
	        var cls = me.cls;
	        if(cls){
	        	//this.scale = 'medium';//大按钮
	        	this.style = 'background-image: none;';
	        	if(cls.indexOf("btn_sec") != -1 ){
	        		me.addCls('btn btn-info');
	        	}else if(cls.indexOf("btn_query") != -1 || cls.indexOf('btn_main') != -1){
	        		me.addCls('btn btn-primary');
	        	}
	        }

	        me.callParent(arguments);
	    }
	});*/
	/**
	 * 增加sideText
	 */
    Ext.override(Ext.form.field.Text, {
    	sideText : '',
    	constructor : function(config){
    		if(Ext.isString(config.sideText)){
    			if(this.componentLayout == 'textfield'){
	    			this.fieldSubTpl = [
	    			    "<table style='width : 100%;' cellpadding='0' cellspacing='0'><tr><td style='width : 100%;'>",
	    		        '<input id="{id}" type="{type}" {inputAttrTpl}',
	    		            ' size="1"',
	    		            '<tpl if="name"> name="{name}"</tpl>',
	    		            '<tpl if="value"> value="{[Ext.util.Format.htmlEncode(values.value)]}"</tpl>',
	    		            '<tpl if="placeholder"> placeholder="{placeholder}"</tpl>',
	    		            '{%if (values.maxLength !== undefined){%} maxlength="{maxLength}"{%}%}',
	    		            '<tpl if="readOnly"> readonly="readonly"</tpl>',
	    		            '<tpl if="disabled"> disabled="disabled"</tpl>',
	    		            '<tpl if="tabIdx"> tabIndex="{tabIdx}"</tpl>',
	    		            '<tpl if="fieldStyle"> style="{fieldStyle}"</tpl>',
	    		        ' class="{fieldCls} {typeCls} {editableCls} {inputCls}" autocomplete="off"/>',
	    		        '</td><td><a class="infos" data-qhide="user" data-qtip="'+config.sideText+'"></a></td></tr></table>',
	    		        {
	    		            disableFormats: true
	    		        }
	    		    ];
    			}else if(this.componentLayout == 'textareafield'){
    				this.fieldSubTpl = [
	    			    "<table style='width : 100%;' cellpadding='0' cellspacing='0'><tr><td style='width : 100%;'>",
		    			    '<textarea id="{id}" {inputAttrTpl}',
		    	            '<tpl if="name"> name="{name}"</tpl>',
		    	            '<tpl if="rows"> rows="{rows}" </tpl>',
		    	            '<tpl if="cols"> cols="{cols}" </tpl>',
		    	            '<tpl if="placeholder"> placeholder="{placeholder}"</tpl>',
		    	            '<tpl if="size"> size="{size}"</tpl>',
		    	            '<tpl if="maxLength !== undefined"> maxlength="{maxLength}"</tpl>',
		    	            '<tpl if="readOnly"> readonly="readonly"</tpl>',
		    	            '<tpl if="disabled"> disabled="disabled"</tpl>',
		    	            '<tpl if="tabIdx"> tabIndex="{tabIdx}"</tpl>',
		    	            ' class="{fieldCls} {typeCls} {inputCls}" ',
		    	            '<tpl if="fieldStyle"> style="{fieldStyle}"</tpl>',
		    	            ' autocomplete="off">\n',
		    	            '<tpl if="value">{[Ext.util.Format.htmlEncode(values.value)]}</tpl>',
		    	            '</textarea>',
	    		        '</td><td align="left" valign="top"><a class="infos" data-qhide="user" data-qtip="'+config.sideText+'"></a></td></tr></table>',
	    		        {
	    		            disableFormats: true
	    		        }
    				 ];	
    			}
    		}
    		this.callParent(arguments);
    	}
    }); 

    var bindCloseKeys = (function(bindObj){
	     /**
	     * 主页中的关闭tab快捷键
	     */
        try{
	        var keyMap=new Ext.util.KeyMap(
	                bindObj,
	                [{    
	                    //ctrl+`关闭当前tab
	                    key:192,  
	                    ctrl:true,  
	                    fn:function(){
	                        var activeTab = parent.Frame ? parent.Frame.getActiveTab() : null;
	                        if(activeTab){
	                            parent.Frame.closeTab(activeTab.getId());
	                        }
	                    },  
	                    scope:bindObj,  
	                    defaultEventAction: "stopEvent"  
	              }]);
        }catch(e){
        }              
    })(document);
    /**
     * 给对象加上回车键事件
     * @param el 需要绑定事件的对象
     * @param fn 要绑定的事件
     * @param n 计时器。可选值，如果有，n秒内只触发一次事件 默认为1秒
     * @returns 无返回值
     */
    var bindEnterEvent = function(el, fn, time){
    	if(!Ext.isDefined(el)){
    		printMsg("对象为空", 2);
    		//console.log(el);
    		return;
    	}

    	if(!Ext.isFunction(fn)){
    		printMsg("函数不存在", 2);
    		return;
    	}
    	
    	if(!Ext.isDefined(time)){
    		time = 1;
    	}
    	
    	var n = 0,
    		taskcode;
    	var task = function(){
			n=0;
			window.clearInterval(taskcode);
			taskcode = undefined;
    	};

    	var keyMap = new Ext.util.KeyMap(el, {
    	    key: 13,
    	    fn: function(){

    	    	if(!Ext.isDefined(taskcode)){
    	    		taskcode = window.setInterval(task, time*1000);
    	    	}
    	    	if(n>=1){
    	    		return;
    	    	}else{
    	    		Ext.TaskManager.start(task);
    	    		fn();
    	    	}
    	    	n++;
    	    }
    	});
    	
    	return keyMap;
    	
    };
    var bindPagingKeys = function(grid){
        var bbar = grid.getDockedItems('toolbar[dock="bottom"]')[0];
        
        var hasNext = function(pageData){
	        var curPage = pageData.currentPage;
	        var pages = pageData.pageCount;
            return curPage < pages;
        };
        
        var hasPrev = function(pageData){
            var curPage = pageData.currentPage;
            //var pages = pageData.pageCount;
            return curPage > 1;    
        };
        
        var Frame = parent.Frame;
	    var nav = new Ext.KeyNav(Ext.get(Frame.getBody().dom), {
	        "left" : function(e){
	            var activeTab = Frame.getActiveTab();                
	            if(activeTab){
                    if(hasPrev(bbar.getPageData())){
                        bbar.movePrevious();
                    }
	            }
	        },
	        "right" : function(e){
                var activeTab = Frame.getActiveTab();
                if(activeTab){
                    if(hasNext(bbar.getPageData())){
                        bbar.moveNext()
                    }
                }
	        },
	        scope :  this
	    });
        var nav2 = new Ext.KeyNav(Ext.getBody(), {
            "left" : function(e){
                var activeTab = parent.Frame.getActiveTab();                
                if(activeTab){
                    if(hasPrev(bbar.getPageData())){
                        bbar.movePrevious();
                    }
                }
            },
            "right" : function(e){
                var activeTab = parent.Frame.getActiveTab();
                if(activeTab){
                    if(hasNext(bbar.getPageData())){
                        bbar.moveNext();
                    }
                }
            },
            scope :  this
        });
    };
    return {
        /**
         * 消息控制台文字闪烁效果
         * @param {Ext.Element} ele 闪烁对象
         * @param {String} cls 样式类
         * @param {Number} times 闪烁次数
         */
        shake : function (ele,cls,times){
            var i = 0,t= false ,o =ele.getAttribute("class")+" ",c ="",times=times||2;
            if(t) return;
            t= setInterval(function(){
                i++;
                c = i%2 ? o+cls : o;
                ele.set({"cls":c});
                if(i==2*times){
                     clearInterval(t);
                     ele.removeCls(cls);
                }
            },200);
        },
        /**
         * 将IE9-版本中的回车换行统一替换为换行符
         * 即"\r\n"替换成"\n"
         * @params {string} val
         */
        enter2wrap : function(val){
            return val.replace(/\r\n/gi,'\n');
        },
        
        /**
         * extjs中的ajax简单封装
         * @param {} args
         */
        ajaxRequest : function(url,params,callback,scope){ 
            Ext.Ajax.request({
                url: url,
                params: params,
                scope : scope,
                success: function(response, opts) {
                    var result = Ext.decode(response.responseText);
                    if (result.showInConsole) {
                        parent.Frame.insertMsg(result.message, result.msgType);
                        return;
                    } else {
                       callback(result);
                    }
                },
                failure: function(response, opts) {
                    Ext.Msg.alert('错误信息','错误代码：' + response.status + '\n错误描述：' + response.statusText)
                }
            });
        },
        /**
         * 验证该操作是否有权限
         */
        hasPermission : function(response,callback) {
            try{
                var result = Ext.decode(response.hasOwnProperty('responseText') ? response.responseText.trim() : response);
	            if (result.showInConsole) {
	                parent.Frame.insertMsg(result.message, result.msgType);
	            }
                return result.hasOwnProperty('msgType') ? result.msgType===1 : true;//1:正常，其它数字为异常（异常可能是由于没有权限或者业务操作失败引起，详细信息可参见result.message）
            }catch(e){
                return true;
            }
        },
        /**
         * 提供查询条件fieldset显示隐藏效果
         * 用法:初始化页面完毕后调用该方法，依赖extjs及样式
         * 要求页面规则为下面格式才会生效
	        <fieldset class="x-fieldset x-form-label-left"  >
	          <legend class="x-fieldset-header x-unselectable">
	            <div class="x-tool x-tool-toggle" >&nbsp;</div>
	            <span>查询条件</span>
	          </legend>
	          <table>
	          </table>
	        </fieldset>
         */
        toggleCollapse : function(){

            var $dq = Ext.DomQuery;
            var $q = Ext.query;
            
            Ext.each($q('fieldset'),function(fieldset){
                fieldset =  Ext.get(fieldset);
                
                var legend = Ext.get(fieldset.dom.children[0]);
                var table =  Ext.get(fieldset.dom.children[1]);
                
                if(fieldset.hasCls("x-panel-collapsed")){
                    table.setStyle("display","none");
                }
                Ext.each(legend.query('div.x-tool-toggle'),function(div){
                    div = Ext.get(div);
                    div.on('click',function(){
                        if(fieldset.hasCls("x-panel-collapsed")){
                            fieldset.removeCls("x-panel-collapsed");
                            table.setStyle("display","inline-table");
                        }else{
                            fieldset.addCls("x-panel-collapsed");
                            table.setStyle("display","none");
                        }
                    });
                });
            });

        },
        /**
         * 将extjs中的button转换成普通按钮
         * 查询按钮中的“查询”、“重置”等，在extjs中cls属性设置为"query"
         * 主要操作按钮cls属性设置为"opera btn_main"，按钮4字以上的再加"long"
         * 次要操作按钮cls属性设置为"opera btn_sec"
         */
        transButtons : function(){
            var tables = Ext.query("table[class*='query']");
            var operaTables = Ext.query("table[class*='opera']");
            var btnMains = Ext.query("table[class*='btn_main'] button");
            var btnSecs = Ext.query("table[class*='btn_sec'] button");
            var btnQuerys = Ext.query("table[class*='query'] button");
            tables = tables.concat(operaTables);
            
            Ext.each(tables,function(table){
                if(table.className.indexOf("render")===-1){
	                var vboxStyle = " ";
	                var hideClass = '';
	                if(table.className.indexOf("x-box-item")!==-1){
	                    vboxStyle = " x-box-item";
	                }
	                //如果按钮设置为隐藏，加上隐藏样式
	                if(table.className.indexOf("x-hide-display")!==-1){
	                	hideClass = 'x-hide-display';
	                }else if(table.className.indexOf("x-hide-visibility")!==-1){
	                	hideClass = 'x-hide-visibility';
	                }
	                
	                if(table.className.indexOf("query")!==-1){
	                    table.className = (table.className.indexOf("btn_main")!==-1 ? "query btn_main" : "query btn_sec") + " render " + hideClass;
	                }else if(table.className.indexOf("btn_main")!==-1){
	                    table.className = (table.className.indexOf("long")!==-1 ? "opera btn_main long" : "opera btn_main") + " render " + hideClass;
	                }else{
	                    table.className =(table.className.indexOf("long")!==-1 ? "opera btn_sec long" : "opera btn_sec") + " render " + hideClass;
	                }
	                table.className += vboxStyle; 
	                var tbody = table.firstChild;
	                var trs = tbody.childNodes;
	                tbody.className = "";
	                var aTrs = [],aTds =[];
	                Ext.each(trs,function(tr,trIndex){
	                    tr.className = trIndex===1 ? "" : "del"; 
	                    aTrs.push(tr);
	                });
	                Ext.each(aTrs,function(tr){
	                    if(tr.className.indexOf("del") !==-1){
	                        Ext.removeNode(tr);
	                    }
	                });
	                Ext.each(trs[0].cells,function(td,tdIndex){
	                    td.className = tdIndex===1 ? "" : "del"; 
	                    aTds.push(td);
	                });
	                Ext.each(aTds,function(td){
	                    if(td.className.indexOf("del") !==-1){
	                        Ext.removeNode(td);
	                    }
	                });                    
                }

            });
            Ext.each(btnMains,function(btn){
                var table =Ext.get(btn).findParentNode("table[class]");
                btn.className =  "btn btn-primary";
            });
            Ext.each(btnSecs,function(btn){
                 var table =Ext.get(btn).findParentNode("table[class]");
                 btn.className = "btn btn-info";
            });
            
            Ext.each(btnQuerys,function(btn){
                var table =Ext.get(btn).findParentNode("table[class]");
                btn.className =  "btn btn-primary";
            });
        },
        bindPagingKeys : function(grid){
            bindPagingKeys(grid);
        },
        bindEnterEven : function(el, fn, n, m){
        	bindEnterEvent(el, fn, n, m);
        },
        bindCloseKeys : function(bindObj){
            this.bindCloseKeys(bindObj);
        },
        /**
         * 状态类型
         */
        STATE_TYPE :{
            /**
             * 参数类型
             */
            PARAM_TYPE : 'paramType',
            /**
             * ip获取方式
             */
            IP_GET_TYPE : 'ipGetType',
            /**
             * 作业类型
             */
            JOB_TYPE : 'jobType',
            /**
             * 步骤类型
             */
            STEP_TYPE : 'stepType',
            /**
             * 作业执行状态、作业步骤执行状态
             */
            RUN_STATUS : 'runStatus',
            /**
             * 作业执行模式
             */
            EXE_TYPE : 'exeType',
            /**
             * 定时作业启动结果
             */
            CRONRESULT_TYPE : 'cronresultType'
        },
        /**
         * 获取指定状态的显示值
         * @param{string} STATE_TYPE[IP_GET_TYPE/JOB_TYPE/STEP_TYPE/RUN_STATUS/EXE_TYPE] 状态类型
         * @param{int} code 状态码
         * @return typeText 状态显示值
         */
        getStateByType : function(type,code){
            var text = '';
            Ext.each(typeDef[type],function(status){
                if(status.value===code){
                    text = status.label;
                    return false;
                }
            });
            return text;
        },
        validPath : function(value) {
            if(/(\/\/|\\\\)+/.test(value)){
                return "路径中不能有重复的“/”或者“\\”";
            }
            /*if(/[?*"<>|]/.test(value)){
                return "路径中不能包含特殊字符“?、*、\"、<、>、|”";
            }*/
            if(/^[a-zA-Z]{1}:(\/|\\){1}/.test(value)){//windows
                
                /*var path = [];
                Ext.each(value.split(/\/|\\/),function(text){
                    path.push(text.trim());
                });
                console.log(path.join('\/'));*/
                return true;                 
            }else if(/^\//.test(value)){//linux
	            var index = value.indexOf('REGEX:');
	            if(index!==-1){
	                fileName = value.substring(index,value.length-1);
	                value = value.substring(0,index);
	            }                    
                if(/[\\]/.test(value)){
                    return "路径中不能包含特殊字符“\\”";
                }
                return true;
                
            }else {//unknow
                return '非法路径';
            }
        },
        /*验证路径是否在规定的范围内    
        	允许使用作为文件传输目的地址的路径为：
        		linux服务器：/usr, /data,/tmp,/home,/data1,/data2,/data3,/data4,/opt 
        		windows服务器：除了C:\WINDOWS\system32之外的所有目录
        */
        validSpecialPath : function(value){
        	 if(/(\/\/|\\\\)+/.test(value)){
                 return "路径中不能有重复的“/”或者“\\”";
             }             
             if(/^[a-zA-Z]{1}:(\/|\\){1}/.test(value)){//windows
            	 value = value.toLowerCase();            	 
            	 if(value.indexOf('c:\\windows\\system32') !== -1){
            		 return "windows服务器可设置的目录：除了C:\\WINDOWS\\system32之外的所有目录";
            	 }
                 return true;                 
             }else if(/^\//.test(value)){//linux
 	            var index = value.indexOf('REGEX:');
 	            if(index!==-1){
 	                fileName = value.substring(index,value.length-1);
 	                value = value.substring(0,index);
 	            }                    
				if(/[\\]/.test(value)){
				return "路径中不能包含特殊字符“\\”";
				}
				value = value.toLowerCase();
				var  allowPath = ['usr', 'data', 'tmp', 'home', 'data1', 'data2', 'data3', 'data4', 'opt'];
				values = value.split('/');
				if(Ext.Array.indexOf(allowPath, values[1]) === -1){
					return "linux服务器可设置的目录：/usr, /data,/tmp,/home,/data1,/data2,/data3,/data4,/opt";
				}
				return true;
                
				
             }else {//unknow
                 return '非法路径';
             }
        }
    };
    

}();

Ext.ijobs.common.Valid = function(){
	Ext.apply(Ext.form.VTypes, {
        //验证IP地址
	    IPAddress:  function(v) {
	        return /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/.test(v);
	    },
	    IPAddressText: '请输入正确的IP地址',
        //验证是否为数字
        Number:  function(v) {
            return /^\d+$/.test(v);
        },
        NumberText: '请输入正确的数值',
        NumberMask: /[0-9]/i,
        //验证日期范围    
	    daterange : function(val, field) {
	        var date = field.parseDate(val);
	        if(!date){
	            return false;
	        }
	        if (field.startDateField) {
	            var start = Ext.getCmp(field.startDateField);
	            if (!start.maxValue || (date.getTime() != start.maxValue.getTime())) {
	                start.setMaxValue(date);
	                start.validate();
	            }
	        }
	        else if (field.endDateField) {
	            var end = Ext.getCmp(field.endDateField);
	            if (!end.minValue || (date.getTime() != end.minValue.getTime())) {
	                end.setMinValue(date);
	                end.validate();
	            }
	        }
	        /*
	         * Always return true since we're only using this vtype to set the
	         * min/max allowed values (these are tested for after the vtype test)
	         */
	        return true;
	    }
    });
}();

if(Ext.isIE8){
	if (!Function.prototype.bind) {
	  Function.prototype.bind = function (oThis) {
	    if (typeof this !== "function") {
	      throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
	    }
	
	    var aArgs = Array.prototype.slice.call(arguments, 1), 
	        fToBind = this, 
	        fNOP = function () {},
	        fBound = function () {
	          return fToBind.apply(this instanceof fNOP && oThis
	                 ? this
	                 : oThis,
	                 aArgs.concat(Array.prototype.slice.call(arguments)));
	        };
	
	    fNOP.prototype = this.prototype;
	    fBound.prototype = new fNOP();
	
	    return fBound;
	  };
	}
}

if (!Object.keys) {
	  Object.keys = (function () {
	    'use strict';
	    var hasOwnProperty = Object.prototype.hasOwnProperty,
	        hasDontEnumBug = !({toString: null}).propertyIsEnumerable('toString'),
	        dontEnums = [
	          'toString',
	          'toLocaleString',
	          'valueOf',
	          'hasOwnProperty',
	          'isPrototypeOf',
	          'propertyIsEnumerable',
	          'constructor'
	        ],
	        dontEnumsLength = dontEnums.length;

	    return function (obj) {
	      if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
	        throw new TypeError('Object.keys called on non-object');
	      }

	      var result = [], prop, i;

	      for (prop in obj) {
	        if (hasOwnProperty.call(obj, prop)) {
	          result.push(prop);
	        }
	      }

	      if (hasDontEnumBug) {
	        for (i = 0; i < dontEnumsLength; i++) {
	          if (hasOwnProperty.call(obj, dontEnums[i])) {
	            result.push(dontEnums[i]);
	          }
	        }
	      }
	      return result;
	    };
	  }());
}
//全局配置store中ajax传值方式，统一为post
Ext.override(Ext.data.proxy.Ajax,{
    actionMethods : {
        create: 'POST', read: 'POST', update: 'POST', destroy: 'POST'
    }
});

//如果输入框含有特殊字符，就提示用户
Ext.override(Ext.form.field.Base,{
	validateValue: function(value) {		
		var me = this,
			needFilter = Ext.value(me.needFilter, true), 
			xtype = me.xtype,
			errors = [],
			errorMsg = '',
			needFilterXType = ['textfield','textarea'];
		
		if(needFilter && needFilterXType.indexOf(xtype) > -1){				
			if(!me.stringFilter(value)){
				errorMsg = '包含特殊字符！(\"\'&?><)';				
			}
		}
		errors = me.getErrors(value);
		if(!Ext.isEmpty(errorMsg)){
			errors.push(errorMsg);			
		}
        var isValid = Ext.isEmpty(errors);
        if (!me.preventMark) {
            if (isValid) {
                me.clearInvalid();
            } else {
                me.markInvalid(errors);
            }
        } 
		
	    return isValid;
    },
	stringFilter : function(value){
		if(/^[^"'&?><]*$/.test(value)){			
			return true;
		}
		return false;
	}
});


//修复方法grid.reconfigure的bug 
Ext.define('EXTJS-15510.view.AbstractView', {
    override: 'Ext.view.AbstractView',
 
    bindStore: function(store, initial, propName) {
        var me = this;
        me.mixins.bindable.bindStore.apply(me, arguments);
 
        // Bind the store to our selection model unless it's the initial bind.
        // Initial bind takes place afterRender
        if (!initial) {
            me.getSelectionModel().bindStore(store);
        }
 
        // If we have already achieved our first layout, refresh immediately.
        // If we have bound to the Store before the first layout, then onBoxReady will
        // call doFirstRefresh
        if (me.store && me.componentLayoutCounter) {
            me.doFirstRefresh(store);
        }
    }
 
});

//tree 修复兼容文件的bug
Ext.override(Ext.tree.View, {
	treeRowTpl: [
    '{%',
        'this.processRowValues(values);',
        'this.nextTpl.applyOut(values, out, parent);',
    '%}', {
        priority: 10,
        processRowValues: function(rowValues) {
            var record = rowValues.record,
                view = rowValues.view;

            //修复兼容文件的bug,下面3行是加的
			if(Ext.isEmpty(rowValues.rowAttr)){
				rowValues.rowAttr = {};
			}
            rowValues.rowAttr['data-qtip'] = record.get('qtip') || '';
            rowValues.rowAttr['data-qtitle'] = record.get('qtitle') || '';
            if (record.isExpanded()) {
                rowValues.rowClasses.push(view.expandedCls);
            }
            if (record.isLeaf()) {
                rowValues.rowClasses.push(view.leafCls);
            }
            if (record.isLoading()) {
                rowValues.rowClasses.push(view.loadingCls);
            }
        }
    }
]
});

//tip消失时间改为60s
Ext.override(Ext.tip.ToolTip, {
	dismissDelay : 60000
});
