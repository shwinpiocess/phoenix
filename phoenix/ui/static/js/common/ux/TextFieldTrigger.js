/**
 * 输入框组件，功能如下：
 * 1.输入框后面带一个编辑图标，点击以后，光标移到到文本最后，
 * 2.输入框可以为文本框或者文本域，通过inputXtype 来设置输入框类型，默认为textfield
 * 3.如果内容有改变，文字加粗显示
 * 使用方式和普通输入框一样
 */
Ext.define('Ijobs.common.ux.TextFieldTrigger', {
    extend: 'Ext.form.FieldContainer',
    alias: 'widget.texttrigger',
    allowBlank  : true,
    layout : 'column',
    alternateClassName: ['Ijobs.ux.TextEditField', 'Ijobs.ux.TextFieldTrigger'],
    constructor: function(config) {
    	var me = this;
    	
    	me.COMPONENTS = {};
        config = Ext.apply({
            fieldCls : 'edit-field-1'
        }, config);
        
        me.callParent(arguments);
    },
    
    initComponent: function() {
        var me = this;
        me.items = [me._createInput()];
        if(!me.readOnly){
        	me.items.push(me._createEditIcon());
        }
        me.callParent(arguments);
    },
    _createInput : function(){
    	var me = this,    		
    		xtype = Ext.valueFrom(me.inputXtype, 'textfield');
    	
    	me.inputValue = me.value;
    	var inputConfig = Ext.apply({
    		columnWidth : 1,
    		value : me.value,
    		cls  : me.fieldCls,
    		readOnly : me.readOnly,
    		maxLength : me.maxLength,
    		vtype : me.vtype,
    		validator : me.validator,
    		msgTarget: me.msgTarget,
    		allowBlank : me.allowBlank,
    		name : me.name,
    		hideLabel : true,
    		emptyText : me.emptyText,
    		grow : true,
    		growMin : 24,
    		listeners : {
    			blur : function(){
    				if(!me.readOnly){
    					me._toDisplay();
    				}
    			},
    			focus : function(){
    				if(!me.readOnly){
    					me._toEidt();
    				}
    			},
    			boxready : function(f){
    				f.autoSize();
    			}
    			
    		}
    	},me.inputConfig);
    	//console.log(inputConfig);
    	var input = Ext.create('widget.'+xtype, inputConfig);
    	
    	me.COMPONENTS.input = input; 
    	return input;
    },
    _createEditIcon : function(){
    	var me = this;
    	var icon = Ext.create('Ext.button.Button',{
    		width : 25,
			style : 'border: none;background: none;padding-top: 5px;',
			icon : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAC0SURBVHjanNNRDcIwFEbhbwsCkICESQAHzMACCpgDpAwUIAEcMAlIwMF4aZOlGWzlf2qbnNPb9rYYhgE0TWNhtnjESSkvHe54Yp0rOOMQxlUQrcsM+Ip+tFahKxeW3eKGOpHMVtBhj0vYcSzpUa8Wwu2o7CiBd5kBp3nBKhPuscP7Wx9kwakgwv1SOBUccJx4qq/w1BHO2IyAn/DUJVY4hT5/zcGpIP6wTYBmYSjid/43nwEArW83VzBkRj4AAAAASUVORK5CYII=', 
			handler : function(){
				var input = me.COMPONENTS.input,
					el = input.getEl(),
					value = input.getValue(),				
					length = value.length;
				
				el.removeCls(me.fieldCls);
				input.selectText(length,length);
			}
    	});
    	return icon;
    },
    _toEidt : function(){
    	var me = this,
    		input = me.COMPONENTS.input,
			el = input.getEl();
    	
		el.removeCls(me.fieldCls);
    },
    _toDisplay : function(){
    	var me = this,
			input = me.COMPONENTS.input,
			value = input.getValue();
    	
		el = input.getEl();
    	el.addCls(me.fieldCls);
    	if(value !== me.value){
    		me.setTextBold();
    	}else{
    		me.setTextNormal();
    	}
    },
    setTextBold : function(){
    	var me = this,
			input = me.COMPONENTS.input;
    	input.setFieldStyle('font-weight: bold;');
    },
    setTextNormal : function(){
    	var me = this,
			input = me.COMPONENTS.input;
    	input.setFieldStyle('font-weight: normal;');
    },
    getInput : function(){
    	var me = this;
    	return me.COMPONENTS.input;
    },
    getValue : function(){
    	var me = this;
    	return me.COMPONENTS.input.getValue();
    },
    setValue : function(value){
    	var me = this;
    	me.value = value;
    	me.COMPONENTS.input.setValue(value);
    },
    reset : function(){
    	var me = this;
    	me.COMPONENTS.input.reset();
    },
    isValid : function(){
    	var me = this;
    	return me.COMPONENTS.input.isValid();
    }
});
