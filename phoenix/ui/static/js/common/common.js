// 屏蔽控制台提示
/*Ext.Compat.ignoreInfo = true;
Ext.Compat.showErrors = false;
Ext.Compat.silent = true;*/

/**
 * 让grid内的文字可以选择
 */
Ext.override(Ext.grid.View,{
	enableTextSelection : true
});


/*******************************************************************************
 * 这个文件定义了公共常量,以及通用函数
 ******************************************************************************/

/**
 * 更改Ajax默认超时时间为180秒
 */
Ext.Ajax.timeout = 180 * 1000;
if(CsrfKey){
	Ext.Ajax.defaultHeaders = {
			CsrfKey: CsrfKey
	};
}
//if  (!Ext.grid.GridView.prototype.templates) {    
//    Ext.grid.GridView.prototype.templates = {};    
//}    
//Ext.grid.GridView.prototype.templates.cell =  new  Ext.Template(    
//     '<td class="x-grid3-col x-grid3-cell x-grid3-td-{id} x-selectable {css}" style="{style}" tabIndex="0" {cellAttr}>' ,    
//     '<div class="x-grid3-cell-inner x-grid3-col-{id}" {attr}>{value}</div>' ,    
//     '</td>'    
//);

/**
 * 解决分页右边的字显示不完全的问题
 */
Ext.PagingToolbar.prototype.style = 'padding-right:20px;';
	
/**
 * 解决旧版浏览器不支持数组的filter方法 
 */
if (!Array.prototype.filter)
{
	Array.prototype.filter = function(fun , thisp)
	{
		var len = this.length;
		if (typeof fun != "function")
		{
			throw new TypeError();
		}
			

		var res = new Array();
		var thisp = arguments[1];
		for (var i = 0; i < len; i++)
		{
			if (i in this)
			{
				var val = this[i];
				if (fun.call(thisp, val, i, this))
				{
					res.push(val);
				}
			
			}
		}

		return res;
	};
} 

var TimerForLoadSelect;

function evalScript(str) {
    var reg = '<script[^>]*>([\\S\\s]*?)<\/script>';
    var str = str.match(new RegExp(reg, 'img'));
    if (Ext.isEmpty(str)) {
        return ;
    }
    for (var i = 0, num = str.length; i < num; i++) {
        eval(str[i].match(new RegExp(reg, 'im'))[1]);
    }
}

function replaceToUtf8(str) {
    return str.replace(/(&gt;)/g, ">")
        .replace(/(&lt;)/g, "<")
        .replace(/(&apos;)/g, "'")
        .replace(/(&quot;)/g, "\"")
        .replace(/(&amp;)/g, "&");
}

function reset(domId) {
    
    Ext.each(Ext.query("#" + domId+' input[type=text],input[type=hidden]'),function(inputDom){
        inputDom.value = "";
    });
    Ext.each(Ext.query("#" + domId+' select'),function(inputDom){
        inputDom.selectedIndex = 0;
    });
}


function optRadioOnChange(radios, type) {
    var i, stepDiv = Ext.getDom("operator4stepDiv"), wholeParmsDiv = Ext.getDom("operator4WholeParmsDiv"), strutsTag = "stepTask" + type + "base";

    if (typeof (radios.length) == "undefined") {
        i = radios.value;
    } else if (radios.length == 3) {
        for (i = 0; i < radios.length; i++) {
            if (radios[i].checked) {
                break;
            }
        }
    }

    if (i == 0) {
        if (stepDiv != null) {
            stepDiv.children[0].value = "";
            stepDiv.style.display = "none";
            Ext.getDom("operator4stepDivDiv").style.display = "none";
        }
        wholeParmsDiv.children[0].value = "";
        wholeParmsDiv.style.display = "none";
        Ext.getDom("operator4WholeParmsDivDiv").style.display = "none";
    }

    if (i == 1) {
        if (stepDiv != null) {
            stepDiv.children[0].value = "";
            stepDiv.style.display = "none";
            Ext.getDom("operator4stepDivDiv").style.display = "none";
        }

        if (wholeParmsDiv.children.length == 1) {
            wholeParmsDiv.innerHTML += Ext.getDom("operatorDivTemp1").innerHTML;
            wholeParmsDiv.children[3].value = wholeParmsDiv.children[0].value;
        }

        wholeParmsDiv.style.display = "";
        Ext.getDom("operator4WholeParmsDivDiv").style.display = "none";
    }

    if (i == 2) {
        if (stepDiv != null && stepDiv.children.length == 1) {
            stepDiv.innerHTML += Ext.getDom("operatorDivTemp").innerHTML;
            stepDiv.children[3].value = stepDiv.children[0].value;
            if (wholeParmsDiv != null)
                wholeParmsDiv.children[0].value = "";
        }

        wholeParmsDiv.children[0].value = "";

        if (stepDiv != null) {
            stepDiv.style.display = "";
            Ext.getDom("operator4stepDivDiv").style.display = "";
        }
        wholeParmsDiv.style.display = "none";
        Ext.getDom("operator4WholeParmsDivDiv").style.display = "none";
    }
}
function getUserNameByStr(userName) {
    var endIndex = userName.indexOf("(");
    if (endIndex < 0)
        endIndex = userName.indexOf(";");
    if (endIndex < 0)
        endIndex = userName.length;
    userName = userName.substring(0, endIndex);
    return userName;
}

function setOpt2Submit(radios, type) {
    var i, stepDiv = Ext.getDom("operator4stepDiv"), wholeParmsDiv = Ext.getDom("operator4WholeParmsDiv"), strutsTag = "stepTask" + type + "base.operator";
    for (i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
            break;
        }
    }

    if (i == 0) {
        if (stepDiv != null) {
            stepDiv.children[0].value = "";
            stepDiv.style.display = "none";
        }
        wholeParmsDiv.children[0].value = "";
        wholeParmsDiv.style.display = "none";
    }

    if (i == 1) {
        if (stepDiv != null) {
            stepDiv.children[0].value = "";
        }
        wholeParmsDiv.children[0].value = getUserNameByStr(wholeParmsDiv.children[3].value);
    }

    if (i == 2) {
        if (stepDiv != null) {
            stepDiv.children[0].value = getUserNameByStr(stepDiv.children[3].value);
        }
        wholeParmsDiv.children[0].value = "";
    }
    
}

function phaseTime(time) {
    return new Date(time.time).format('Y-m-d H:i:s');
}

function myDateRenderer(v, format) {
    var dateTime = Ext.util.Format.date(v, format);
    return dateTime == "1970-01-01 00:00:00" ? "" : dateTime;
}



function delSelectForSelect(selectId,array){
    var options = $("#"+selectId)[0].options;
    var count=0;
    var length=options.length;
    for(var i=0;i<length;i++){
        if(options[i-count].selected){
            options.remove(i-count);
            array.splice(i-count,1);
            count++;
        }
    }
}

function delAllForSelect(selectId,array){
    $("#"+selectId)[0].options.length=0;
    array.length = 0;
}

function voidfunction(data){
}

function checkTaskPullParms(ip, path, usr, passwd){
    var curPath;
    
    if(!ipCheck(Ext.getDom(ip).value)){
        printMsg("输入IP不合法",2);return false;
    }
    
    curPath = Ext.getDom(path).value;
    //furionwang判断文件路径是否规范(linux和windows下)
    var pathPartn = /[a-zA-Z]:(\\([0-9a-zA-Z]+))+|(\/([0-9a-zA-Z]+))+/;
    if (!pathPartn.test(curPath)){
        printMsg("文件路径不合法",2);return false;
    }
    
        
    return true;
}

function openNewTab(href, text) {
    self.parent.Frame.createNewTab(href, Math.random(), text);
}
function getActiveTabId() {
    return self.parent.Frame.getActiveTab();
}

function closeTab(id) {
    self.parent.Frame.closeTab(id);
}

function setTabTitle(id, title) {
    self.parent.Frame.setTabTitle(id, title);
}

function getTabTitle(id) {
    //return self.parent.Frame.getTabTitle(id);
}

function printMsg(msg,type){
    self.parent.Frame.insertMsg(msg,type);
}

var appid_temp;
function setDefaultApp(appid){
    appid_temp = appid;
    return appid_temp;
}

function getUserName(domId){
    var userName = Ext.getCmp(domId).getValue();
    if(userName){
    	userName.trim();
    }
    return userName;
}


function getSelect(divName,action){
    Ext.Ajax.request( {
        url : "./common/"+action,
        success : function(xmlHttp) {
            var bodyData = xmlHttp.responseText;

            Ext.getDom(divName).innerHTML = bodyData;
        },
        failure : function() {
        },
        method : 'POST',
        params : {
        }
    });
}


function showAndHideDiv(h1dom, divId) {
    if (Ext.getDom(divId).style.display != "none") {
        h1dom.children[0].className ="icon05";
        Ext.getDom(divId).style.display = "none";
    } else {
        Ext.getDom(divId).style.display = "";
        h1dom.children[0].className ="icon06";
    }
}



// 异步提交表单
function submitFormAsync(submit, callBackFunction, beforeSendFunction) {
    if(document.getElementById("application_id") != null){
        document.getElementById("application_id").value = application.value;
    }
    var beforeResult = true;
    if (beforeSendFunction != undefined) {
        beforeResult = beforeSendFunction();
    }
    if(beforeResult != false){
        jQuery.ajax({
             url: submit.form.action,                    // 提交的页面
             data: $('#'+submit.form.id).serialize(),    // 从表单中获取数据
             type: "POST",                                // 设置请求类型为"POST"，默认为"GET"
             beforeSend: function()                        // 设置表单提交前方法
             {
                 
             },
             error: function(request) {        // 设置表单提交出错
                 new screenClass().unlock();
                 printMsg("表单提交出错，请稍候再试",2);
             },
             success: function(data) {
                // alert(data);
                callBackFunction(data);
             }
         });
    }
}


function intCheck(int_str) {
    var exp = /^[0-9]\d*$/;
    if ("" == int_str) return true;
    return int_str.match(exp) == null ? false : true;
}

function ipCheck(ip_str) {
    var exp=/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
    var reg = ip_str.match(exp);
    return reg == null ? false : true;
}


function nameCheck(model,name){
        function createXhrObject() {     
            var http;     
            var activeX = ['MSXML2.XMLHTTP.3.0', 'MSXML2.XMLHTTP', 'Microsoft.XMLHTTP'];     
        
            try {     
                http = new XMLHttpRequest();     
            } catch (e) {     
                for (var i = 0; i < activeX.length; ++i) {     
                    try {     
                        http = new ActiveXObject(activeX[i]);     
                        break;     
                    } catch (e) { }     
                }     
            } finally {     
                return http;     
            }     
        };     
        name = encodeURI(encodeURI(name));
        var conn = createXhrObject();     
        conn.open("GET", "./common/checkName.action?model="+model+"&name="+name, false);     
        conn.send(null);
        var result = Ext.decode(conn.responseText);
        if( result.showInConsole) {
            printMsg(result.message,result.msgType);
            return false;
        }
        return true;
        
}

function updateNameCheck(model,id,name){
        function createXhrObject() {     
            var http;     
            var activeX = ['MSXML2.XMLHTTP.3.0', 'MSXML2.XMLHTTP', 'Microsoft.XMLHTTP'];     
        
            try {     
                http = new XMLHttpRequest();     
            } catch (e) {     
                for (var i = 0; i < activeX.length; ++i) {     
                    try {     
                        http = new ActiveXObject(activeX[i]);     
                        break;     
                    } catch (e) { }     
                }     
            } finally {     
                return http;     
            }     
        };     
        name = encodeURI(encodeURI(name));
        var conn = createXhrObject();     
        conn.open("GET", "./common/updateName.action?taskIid="+id+"&name="+name+"&model="+model, false);     
        conn.send(null);     
        var result = Ext.decode(conn.responseText);
        if( result.showInConsole) {
            printMsg(result.message,result.msgType);
            return false;
        }
        return true;  
}
function seltext(v, record) {
    if(record.accountName !=undefined){
        return record.accountAlias+ " 账号:"+record.accountName;
    }else{
        return record.accountAlias;
    }
}
Ext.override(Ext.form.field.Text, {
    initComponent : function() {
        var me = this;
        if(!Ext.isEmpty(me.fieldLabel)){
	        me.beforeBoxLabelTextTpl = '<input type="button" class="x-form-field x-form-checkbox x-form-cb" autocomplete="off" hidefocus="true" aria-invalid="false" data-errorqtip="" style="">';
	        if (!me.allowBlank) {
	            me.afterLabelTextTpl = '<span style="color:red;font-weight:bold" data-qtip="必填">*</span>';
	        }
        }
        me.callParent(arguments);
    }
});
Ext.override(Ext.form.FieldContainer, {
    initComponent : function() {
        var me = this;
        if(!Ext.isEmpty(me.fieldLabel)){
	        me.beforeBoxLabelTextTpl = '<input type="button" class="x-form-field x-form-checkbox x-form-cb" autocomplete="off" hidefocus="true" aria-invalid="false" data-errorqtip="" style="">';
	        if (!me.allowBlank) {
	            me.afterLabelTextTpl = '<span style="color:red;font-weight:bold" data-qtip="必填">*</span>';
	        }
        }
        me.callParent(arguments);
    }
});

//store错误信息处理
/*
Ext.override(Ext.data.proxy.Server, {
	afterRequest : function(request, success){
		var operation = request.operation;
		if(success){
			var responseText = operation.response.responseText;
			try{
				var result = Ext.decode(responseText);              				
				if(result.hasOwnProperty('showInConsole')&&result.showInConsole){
					printMsg(result.message, result.msgType);
				}
			}catch(e){}                				
		}else{
			var error = operation.getError();
			msg = '服务器错误：'+error.statusText+"  code:"+error.status;
			printMsg(msg, 2);
		}
	}
});
*/
Ext.override(Ext.data.Connection,{
	parseStatus: function(status) {
        // see: https://prototype.lighthouseapp.com/projects/8886/tickets/129-ie-mangles-http-response-status-code-204-to-1223
        status = status == 1223 ? 204 : status;

        var success = (status >= 200 && status < 300) || status == 304,
            isException = false;
        
        if (999 ===status) {
        	self.parent.Frame.keepSessionAlive();
        }
        
        if (!success) {
            switch (status) {
                case 12002:
                case 12029:
                case 12030:
                case 12031:
                case 12152:
                case 13030:
                    isException = true;
                    break;
            }
        }
        return {
            success: success,
            isException: isException
        };
    },
});
