/**
 * 根据不同角色显示所属业务下拉框
 * @class Ext.ijobs.common.AppCombox
 * @extends Ext.ux.form.ComboBox
 */
Ext.define('Ijobs.common.ux.AppComboBox', {
    extend: 'Ijobs.common.ux.ComboBox',
    alias: ['widget.app-combo'],
    editable : false,//禁止编辑
    apps: Ext.value(parent.userRole, []),//当前用户的所属业务
    showMore: false,//是否显示“显示更多业务”,查询页面使用
    defaultApp: parseInt(Ext.value(appid, -1), 10),//默认所属业务
    excludeApps: [],//排除的业务
    isAdmin: Ext.value(parent.isAdmin, false),//是否为管理员
    isAllApp: Ext.value(parent.isAllApp, false),//是否为全业务
    initComponent: function () {
        var me = this,
            store = me.getStore();
        
        me.callParent(arguments);
        
        if (!me.isAdmin) {
            me.on('beforeselect', me._onSelect, me);
        }

        if (store.getTotalCount() !== 0) {//内联数据
            var records = [];
            store.each(function (record) {
                records.push(record);
            });
            this._processData(store, records);
        } else {//非内联数据
            store.on('load', function (store, records) {
                me._processData(store, records);
            });
        }
    },

    _onSelect: function (combo, record, index) {
        if (record.get('id') === 9998) {
            return false;
        }
        if (record.get('id') === 9999) {
            var store = combo.getStore();
            store.removeAt(index);
            store.add(combo.excludeApps);
            store.sort('id', 'ASC');
            combo.showMore = false;
            return false;
        }
    },

    /**
     * 处理各种角色时，所属业务显示方式
     * 1、ijobs管理员：显示所有业务
     * 2、全业务运维：业务中一定要包含“全业务”，显示所有业务
     * 3、普通运维：显示授权的所属业务
     * 4、授权运维、访客：不显示任何所属业务
     * @param {} store
     * @param {} records
     */
    _processData: function (store, records) {
        var me = this,
            apps = me.apps,
            defaultApp = me.defaultApp,
            isGuest = apps.length === 0,
            tempAppId = isGuest ? 9998 : 9999;//9998授权角色、访客，9999普通运维

        var attachmentData = function () {

            /*if (isGuest && me.showMore) {//当为授权角色或者访客时，查询类所属业务显示所有
                return;
            }*/
            /*if (me.showMore) {
                store.add([
                    {
                        'id': tempAppId,
                        'tempAppId': tempAppId,
                        'applicationName': '显示更多开发商……',
                        'name': '显示更多开发商……'
                    }
                ]);
            } else */if (isGuest) {
                store.add([
                    {
                        'id': tempAppId,
                        'tempAppId': tempAppId,
                        'applicationName': '无开发商',
                        'name': '无开发商'
                    }
                ]);

            }
            
            //将“显示更多”或“无业务”作为特殊业务保存在 当前用户的所属业务 中防止给删除掉 
            if (apps.indexOf(tempAppId) === -1) {
                apps.push(tempAppId);
            }
            
            //清除当前用户的所属业务 以外的业务            
            Ext.each(records,function(record){
                var id = record.get('id');
                //id===-1 表示 “请选择业务名” 该项
                if (apps.indexOf(id) === -1 && id !== -1) {
                    me.excludeApps.push(record);
                    store.remove(record);
                } 
            });
        };

        if (me.isAdmin) {
                //console.log('管理员');
        } else if (me.isAllApp) {
                //console.log('全业务');
            attachmentData();
        } else if (isGuest) {
                //console.log('授权角色、访客');
            attachmentData();
        } else {
                //console.log('普通运维');
            attachmentData();
        }

        if (apps.indexOf(defaultApp) !== -1 || defaultApp !== -1) {
            me.setValue(defaultApp);
            me.fireEvent('change', me);
        }

    }
});
