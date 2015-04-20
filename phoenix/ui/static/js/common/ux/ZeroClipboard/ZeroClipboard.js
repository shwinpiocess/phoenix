Ext.define('Ijobs.ux.ZeroClipboard.ZeroClipboard', {
    alias: 'plugin.zeroclipboard',
    
    onCopyComplete : Ext.emptyFn,
    
    constructor: function (config) {
        Ext.apply(this,config);
    },

    init: function(component) {
        var me = this;
        me.component = component;
        component.on('afterrender', me.initZeroClipboard, me, {single: true});
    },
    
    initZeroClipboard: function() {
        var me = this;
        
        ZeroClipboard.config({ moviePath: './js/common/ux/ZeroClipboard/ZeroClipboard.swf'});
        me.clip = new ZeroClipboard(me.component.getEl().dom);
        me.clip.on("mouseover", me.onMouseOver.bind(me));
        me.clip.on("mouseout", me.onMouseOut.bind(me));
        me.clip.on("mousedown", me.onMouseDown.bind(me));
        me.clip.on("mouseup", me.onMouseUp.bind(me));
        me.clip.on('complete', me.onCopyComplete.bind(me));
    },

    onMouseUp : function(client,e) {
        var me = this;
        e.button = 0;
        me.component.onMouseUp(e);        
    },
    
    onMouseDown : function(client,e) {
        var me = this,
            value = '';
        //目标组件的name属性，根据name属性获取此组件的value作为复制内容
        if(me.targetCmpName) {
            var targetCmp = me.component.up('form').getForm().findField(me.targetCmpName);
            value = targetCmp.getValue();
        //目标方法，返回value作为复制内容
        } else if(me.targetFunc) {
            value = me.targetFunc(me.component);
        //目标值，直接作为复制内容
        } else if(me.targetValue) {
            value = me.targetValue;
        }
        e.button = 0;
        me.component.onMouseDown(e);
        me.clip.setText(value);        
    },
    
    clear : function() {
        var me = this;
        if (me.clip) {
            me.clip.setText('');
        }
    },
    
    onMouseOut : function(){
        var me = this,
            btnCopy = me.component;
        btnCopy.removeOverCls.call(btnCopy); 
    },
    
    onMouseOver: function() {
        var me = this,
            btnCopy = me.component;
        btnCopy.addOverCls.call(btnCopy);
    },
    
    destroy: function() {
        var me = this;
        me.component.clearListeners();
        ZeroClipboard.destroy();
        delete me.component;
        delete me.clip;
    }
});
