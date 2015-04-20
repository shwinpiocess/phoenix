/**
 * 账户combox组件,增加新建账户和刷新账户功能
 * @class Ijobs.common.ux.ComboBox
 * @extends Ext.form.FieldContainer
 */
Ext.define('Ijobs.common.ux.AccountComboBox',{
    extend : 'Ext.form.FieldContainer',
    alias: ['widget.ijobsaccountcombo'],
    alternateClassName: 'Ijobs.ux.AccountComboBox',
    layout : 'column',
    comboxConfig : {},
    constructor : function(config){
    	var me = this;
    	me.comboxConfig = Ext.clone(config);
    	Ext.apply(config,{
    		id:config.id+'-fieldContainer'
    	});
    	this.callParent(arguments);
    },
    initComponent: function() {
    	var me = this;

    	me.items = [me._createCombox(),me._createNewBtn(),me._createRefreshBtn()];
        this.callParent(arguments);
    },
    _createCombox : function(){
    	var me = this;
    	var comboxBoxConfig =  Ext.apply({
    		hideLabel : true,
    		columnWidth:1,
    		listeners :{
    			show:function(){
    				me.show();
    			},
    			hide:function(){
    				me.hide();
    			}
    		}
    	},me.comboxConfig);
    	var cmb = new Ijobs.ux.ComboBox(comboxBoxConfig);
    	me.combox = cmb;
    	return cmb;
    },
    _createNewBtn : function(){
    	var me = this;
    	var panel = {
    			xtype : 'panel',
    			width : 110,
    			hidden : me.readOnly,
    			padding : '0px 0px 0px 10px',
    			border : false,
    			items : [{
    				xtype : 'button',
    				text : '<i class="icon-white icon-plus"></i>&nbsp;添加账户',
                    cls : 'opera btn_sec',
                    handler:function(){
                    	parent.Frame.createNewTab('./jobs/userAccountPage.jsp', Math.round(), '新建执行账户');
                    }    					
    			}]    	
    	};
    	return panel;
    },
    _createRefreshBtn : function(){
    	var me = this;
    	var panel = {
    			xtype : 'panel',
    			border : false,
    			hidden : me.readOnly,
    			width : 80,
    			items : [{
    				xtype : 'button',
            		text : '<i class="icon-white icon-refresh"></i>&nbsp;刷新',
            		cls : 'opera btn_main',
            		handler : me._refresh.bind(me)			
    			}]    	
    	};
    	return panel;
    },
    _refresh : function(){
    	var me = this,
    	refrshFn = me.refrshFn;
    	if(Ext.isFunction(refrshFn)){
    		refrshFn.call(me);
    	}
    	
    }
});
