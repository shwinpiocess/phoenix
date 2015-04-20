/**
 * 扩展combox组件，支持匹配下拉选项中任意字符
 * @class Ijobs.common.ux.ComboBox
 * @extends Ext.form.field.ComboBox
 */
Ext.define('Ijobs.common.ux.ComboBox',{
    extend : 'Ext.form.field.ComboBox',
    alias: ['widget.ijobscombo'],
    alternateClassName: 'Ijobs.ux.ComboBox',
    editable: true,
    enableRegEx : true,
    forceSelection : true,
    queryMode : 'local',    
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

//刷新常用账户
var refreshUserAccount = function(id){
	var o = Ext.getCmp(id),
		store = o.getStore();
	
	store.load();
}