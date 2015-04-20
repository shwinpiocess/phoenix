/**
 * 带信息提示的脚本参数输入框，
 * @author v_weilli
 */
Ext.define('Ijobs.common.ux.ParamInput',{
    extend : 'Ijobs.ux.ComboBox',
    alternateClassName: 'Ijobs.ux.ParamInput',
    alias: ['widget.param-input'],
    queryMode: 'local',
    editable : true,
    forceSelection : false,
    valueField: 'param',
    hideTrigger : true,
    displayField: 'param',
    listConfig: {
    	maxHeight : 150
    },
    constructor: function(config) {
    	config = Ext.apply({            
            fieldLabel : 'CC脚本参数',
            dataName : '_IjobsCCParams',
            expires : new Date('2999/12/31'),//cookie过期时间
            dataMaxLength : 20//保存的数据长度
        }, config);
    	this.callParent(arguments);    	
    	this._cookie = Ext.util.Cookies;
    	this.dataLength = 0;
    },
    initEvents : function(){
    	var me = this;    	
    	me.callParent(arguments); 
    	me.on("focus", me._insertData, me , {single:true});//输入框开始输入时加载提示框
    	me.on("change", me._saveData, me);
    },
    
    initComponent : function(){
        var me = this;
        me.callParent(arguments);
        
    },
    onExpand : function(){
    	var me = this;
    	me.callParent();
    	me.listKeyNav.map.addBinding({
    		key: Ext.EventObject.DELETE,
		    fn: me._delete,
		    scope: me
    	});
    },
    _delete : function(){    	
    	var me = this;
    		view = me.getPicker(),
    		highlighted = view.highlightedItem;
		
    	if(!highlighted){
    		return;
    	}    	
    	var record = view.getRecord(highlighted);
    	me._deleteDataByKey(record.get('key'));    	
    	Ext.removeNode(highlighted);
    	var boundList = view,
	        allItems = boundList.all,
	        oldItem = highlighted,
	        oldItemIdx = oldItem ? boundList.indexOf(oldItem) : -1,
	        newItemIdx = oldItemIdx < allItems.getCount() - 1 ? oldItemIdx + 1 : 0; //wraps around
	        
	    boundList.highlightItem(view.getNode(newItemIdx));
    },
    _getDataType : function(){
    	var me = this;
    	try{
    		window.localStorage;
    		return 'local';
    	}
    	catch(e){
    		var t = me._cookie.set('__test', '1');
    		if(Ext.isDefined(t)){
    			me._cookie.clear('__test');
    			return 'cookie';
    		}else{
    			printMsg('浏览器不支持cookie，请打开cookie或升级浏览器版本', 1);    			
    		}
    	}
    },
    _saveData : function(){
    	var me = this,
    		dataType = me._getDataType(),
    		value = me.getValue();

    	if(Ext.isEmpty(value)){
    		return;
    	}
    	//先判断值是否存在，如果不存在就调用trim方法会报错
    	value = Ext.String.trim(value);
    	if(Ext.isEmpty(value)){
    		return;
    	}
    	if(dataType === 'local'){
    		oldData = window.localStorage.getItem(me.dataName);
    	}else if(dataType === 'cookie'){
    		oldData = me._cookie.get(me.dataName);
    	}else{
    		return;
    	}
    	
    	if(Ext.isEmpty(oldData)){			
			oldData = '{}';
		}
    	
    	try{
    		oldData = Ext.decode(oldData);    		
    	}catch(error){
    		oldData = {};
    	};    	
    	var date = new Date();
		oldData[date.getTime()] = value;		
		oldData = me._processData(oldData);
		
		if(dataType === 'local'){
			window.localStorage.setItem(me.dataName, oldData);
    	}else if(dataType === 'cookie'){
    		oldData = me._cookie.set(me.dataName, oldData, me.expires);    		
    	}
		me.dataLength++;	
    	
    },
    _processData : function(data){
    	var me = this,
    		tmpArr = [];
    	
    	Object.keys(data).sort();//排序对象
    	Ext.iterate(data, function(key,val){	
    		if(Ext.isEmpty(tmpArr[val])){
    			tmpArr[val] = true;
    		}else{
    			delete data[key];
    			me.dataLength--;
    		}
    	});
    	if(me.dataLength > me.dataMaxLength-1){
    		//删除第一个
	    	Ext.iterate(data, function(key,val){
	    		delete data[key];
	    		me.dataLength--;
	    		return false;
	    	});
    	}
    	delete tmpArr;
    	return Ext.encode(data);
    	
    },
    /**
     * 从保存的数据里删除key指定的值
     */
    _deleteDataByKey : function(key){    	
    	var me = this,
    		dataType = me._getDataType(),
    		data = me._getData();
    	
    	if(Ext.isEmpty(data) || Ext.isEmpty(key) || Ext.isEmpty(dataType)){
    		return;
    	}
    	
    	if(Ext.isDefined(data[key])){
    		delete data[key];
    		me.dataLength--;
    	}

    	if(Ext.isEmpty(data)){
    		data = '';
    	}else{
    		data = Ext.encode(data);
    	}
    	if(dataType === 'local'){
			window.localStorage.setItem(me.dataName, data);
    	}else if(dataType === 'cookie'){
    		oldData = me._cookie.set(me.dataName, data, me.expires);    		
    	}

    },
    
    _getData : function(){
    	var me = this,
			dataType = me._getDataType(),
			data;
    	
		if(dataType === 'local'){
			data = window.localStorage.getItem(me.dataName);
		}else if(dataType === 'cookie'){
			data = me._cookie.get(me.dataName);
		}else{
			return;
		}

		data = Ext.decode(data,true);

		if(Ext.isEmpty(data) || data == 'undefined' || data == 'null'){
			data = {};
		}
		return data;
    },
    _createStore : function(){
    	var me = this,
    		myData = me._getData(),
    		arr = [];
    	
    	Ext.iterate(myData,function(key,val){
    		arr.push({
    			'param' : val,'key': key
    		});
    	});
    	var store = new Ext.data.JsonStore({
    	    autoDestroy: true,
    	    autoLoad : true,
    	    fields:['param','key'],  
    	    data:arr
    	});
    	
    	me.dataLength = store.getCount();
    		
    	return store;
    },
    
    _insertData : function(){
    	var me = this;
	
    	var store = me._createStore();
    	if(store.getCount() === 0){
    		return;
    	}
    	me.bindStore(store);        
        me.focus();
    }
});