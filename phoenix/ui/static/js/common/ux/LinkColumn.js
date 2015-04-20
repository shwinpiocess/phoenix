/**
 * @class Ijobs.common.ux.LinkColumn
 * @extends Ext.grid.column.Column
 * @description 支持表格中使用链接触事件
 * @author v_jfdong
 * 用法举例
 * this.columns = [{
 *      text: "操作",
 *      dataIndex: 'Operation',
 *      xtype : 'linkcolumn',
 *      items :[{
 *          text : '添加进程',
 *          action : 'lnkAddProcess',
 *          tooltip : '新增进程',
 *          disabled : true,//禁用该链接
 *          hidden : true,//隐藏该链接
 *          getClass : function(v, meta, rec,rowIndex){
 *              var column = this,
 *                  rowIndex = rowIndex+1;
 *              if (rec.get('type') > 0) {
 *                  Ext.defer(function(){//延时执行，防止dom节点未渲染
 *                      column.setText(0,rowIndex,'newLinkValue');//修改指定链接显示字符
 *                      column.disableAction(0,rowIndex);//禁用指定链接
 *                      column.enableAction(0,rowIndex);//启用指定链接
 *                  },300);
 *              }else {
 *                  column.hideLink(0,rowIndex);//隐藏指定链接
 *              }
 *              return ''
 *          }]
 *      }]
 * }]
 */
Ext.define('Ijobs.common.ux.LinkColumn', {
    extend: 'Ext.grid.column.Column',
    alias: ['widget.linkcolumn'],
    alternateClassName: 'Ijobs.ux.LinkColumn',

    actionIdRe: new RegExp(Ext.baseCSSPrefix + 'link-col-(\\d+)'),
    disabledCls : Ext.baseCSSPrefix + 'link-disabled',
    /**
     * @cfg {String} altText
     * The alt text to use for the image element.
     */
    altText: '',

    sortable: false,

    constructor: function(config) {
        var me = this,
            cfg = Ext.apply({}, config),
            // Items may be defined on the prototype
            items = cfg.items || me.items || [me],
            hasGetClass,
            i,
            len;


        me.origRenderer = cfg.renderer || me.renderer;
        me.origScope = cfg.scope || me.scope;
        
        me.renderer = me.scope = cfg.renderer = cfg.scope = null;
        
        // This is a Container. Delete the items config to be reinstated after construction.
        cfg.items = null;
        me.callParent([cfg]);

        // Items is an array property of ActionColumns
        me.items = items;
        
        for (i = 0, len = items.length; i < len; ++i) {
            if (items[i].getClass) {
                hasGetClass = true;
                break;
            }
        }
         me.addEvents('beforeItemRender');
        // Also need to check for getClass, since it changes how the cell renders
        if (me.origRenderer || hasGetClass) {
            me.hasCustomRenderer = true;
        }
    },
    
    // Renderer closure iterates through items creating an <img> element for each and tagging with an identifying
    // class name x-action-col-{n}
    defaultRenderer: function(v, meta, record, rowIdx, colIdx, store, view){
        var me = this,
            prefix = Ext.baseCSSPrefix,
            scope = me.origScope || me,
            items = me.items,
            len = items.length,
            i = 0,
            item,  disabled, tooltip,link = '',links = [],des={};
 
      
        me.fireEvent('beforeItemRender',v,record,des,items);
        meta.tdCls += ' ' + Ext.baseCSSPrefix + 'link-col-cell';
        for (; i < len; i++) {
		    if(des[i])continue;
            item = items[i];            
            if(Ext.isFunction(item.renderer)){
        		item.text = item.renderer(v, meta, record, rowIdx, colIdx, store, view);            		
            }
            link = '';
            
            disabled = item.disabled || (item.isDisabled ? item.isDisabled.call(item.scope || scope, view, rowIdx, colIdx, item, record) : false);
            tooltip = disabled ? null : (item.tooltip || (item.getTip ? item.getTip.apply(item.scope || scope, arguments) : null));

            // Only process the item action setup once.
            if (!item.hasActionConfiguration) {

                // Apply our documented default to all items
                item.stopSelection = me.stopSelection;
                item.disable = Ext.Function.bind(me.disableAction, me, [i], 0);
                item.enable = Ext.Function.bind(me.enableAction, me, [i], 0);
                item.hasActionConfiguration = true;
            }
            link = item.spacer ? '　' : '<a href="javascript:void(0)" '  +
                'alt="'+(item.altText || me.altText)+'" ' +
                (item.hidden ? ' style="display:none;"' : ' ') +
                ' class="' + prefix + 'link-col-a ' + prefix + 'link-col-' + String(i) + ' ' + (disabled ?  me.disabledCls : ' ') +
                ' ' + (Ext.isFunction(item.getClass) ? item.getClass.apply(item.scope || scope, arguments) : (item.iconCls || me.iconCls || '')) + '"' +
                (tooltip ? ' data-qtip="' + tooltip + '"' : '') + ' >' +
                (Ext.isEmpty(item.text) ? v : item.text) +'</a>';
                
            links.push(link);            
        }
        return links.join('&nbsp;');
    },

    /**
     * 激活指定链接.
     * @param {Number/Ext.grid.column.Link} index
     * @param {Boolean} [silent=false]
     */
    enableAction: function(lnkIndex,rowIndex,colIndex,silent) {
        var me = this,
            rowIndex = rowIndex || 1,
            colIndex = (colIndex || 1) + 1;

        if (!lnkIndex) {
            lnkIndex = 0;
        } else if (!Ext.isNumber(lnkIndex)) {
            lnkIndex = Ext.Array.indexOf(me.items, lnkIndex);
        }
        me.up('tablepanel').el.select('tr:nth-child('+rowIndex+')>td:nth-child(' +colIndex+')' +' .' + Ext.baseCSSPrefix + 'link-col-' + lnkIndex).removeCls(me.disabledCls);
        if (!silent) {
            me.fireEvent('enable', me);
        }
    },

    /**
     * 禁用指定链接.
     * @param {Number/Ext.grid.column.Action} index
     * @param {Boolean} [silent=false]
     */
    disableAction: function(lnkIndex,rowIndex,colIndex,silent) {
        var me = this,
            rowIndex = rowIndex || 1;

        if (!lnkIndex) {
            lnkIndex = 0;
        } else if (!Ext.isNumber(lnkIndex)) {
            lnkIndex = Ext.Array.indexOf(me.items, lnkIndex);
        }
        me.up('tablepanel').el.select('tr:nth-child('+rowIndex+')>td:nth-child(' +colIndex+')' +' .' + Ext.baseCSSPrefix + 'link-col-' + lnkIndex).addCls(me.disabledCls);
        if (!silent) {
            me.fireEvent('disable', me);
        }
    },
    /**
     * 隐藏指定链接
     * @param {} lnkIndex
     * @param {} rowIndex
     * @param {} animate
     */
    hideLink: function(lnkIndex,rowIndex,colIndex,animate) {
        var me = this,
            rowIndex = rowIndex || 1,
            colIndex = (colIndex || 1) + 1,
            ele;

        if (!lnkIndex) {
            lnkIndex = 0;
        } else if (!Ext.isNumber(lnkIndex)) {
            lnkIndex = Ext.Array.indexOf(me.items, lnkIndex);
        }
        ele = me.up('tablepanel').el.select('tr:nth-child('+rowIndex+')>td:nth-child(' +colIndex+')' +' .' + Ext.baseCSSPrefix + 'link-col-' + lnkIndex);
        ele.setVisibilityMode(Ext.dom.Element.DISPLAY);
        ele.hide(animate);
        
    },
    /**
     * 显示指定链接
     * @param {} lnkIndex
     * @param {} rowIndex
     * @param {} animate
     */
    showLink: function(lnkIndex,rowIndex,colIndex,animate) {
        var me = this,
            rowIndex = rowIndex || 1,
            colIndex = (colIndex || 1) + 1,
            ele;

        if (!lnkIndex) {
            lnkIndex = 0;
        } else if (!Ext.isNumber(lnkIndex)) {
            lnkIndex = Ext.Array.indexOf(me.items, lnkIndex);
        }
       ele = me.up('tablepanel').el.select('tr:nth-child('+rowIndex+')>td:nth-child(' +colIndex+')'+' .' + Ext.baseCSSPrefix + 'link-col-' + lnkIndex);
       ele.setVisibilityMode(Ext.dom.Element.DISPLAY);
       ele.show(animate);
        
    },    
    setText: function(lnkIndex,rowIndex,colIndex,val) {
        var me = this,
            rowIndex = rowIndex || 1,
            colIndex = (colIndex || 1) + 1;

        if (!lnkIndex) {
            lnkIndex = 0;
        }
        if (!Ext.isNumber(lnkIndex)) {
            lnkIndex = Ext.Array.indexOf(me.items, lnkIndex);
        }
        
        
        
        me.up('tablepanel').el.select('tr:nth-child('+rowIndex+')>td:nth-child(' +colIndex+')' +' .' + Ext.baseCSSPrefix + 'link-col-' + lnkIndex).setHTML(val);

    },
    destroy: function() {
        delete this.items;
        delete this.renderer;
        return this.callParent(arguments);
    },

    /**
     * @private
     * Process and refire events routed from the GridView's processEvent method.
     * Also fires any configured click handlers. By default, cancels the mousedown event to prevent selection.
     * Returns the event handler's status to allow canceling of GridView's bubbling process.
     */
    processEvent : function(type, view, cell, recordIndex, cellIndex, e, record, row){
        var me = this,
            target = e.getTarget(),
            match,
            item, fn,
            key = type == 'keydown' && e.getKey(),
            disabled;

        // If the target was not within a cell (ie it's a keydown event from the View), then
        // rely on the selection data injected by View.processUIEvent to grab the
        // first action icon from the selected cell.
        if (key && !Ext.fly(target).findParent(view.getCellSelector())) {
            target = Ext.fly(cell).down('.' + Ext.baseCSSPrefix + 'link-col-a', true);
        }

        // NOTE: The statement below tests the truthiness of an assignment.
        if (target && (match = target.className.match(me.actionIdRe))) {
            item = me.items[parseInt(match[1], 10)];
            disabled = target.className.match(me.disabledCls) || (item.isDisabled ? item.isDisabled.call(item.scope || me.origScope || me, view, recordIndex, cellIndex, item, record) : false);
            if (item && !disabled) {
                if (type == 'click' || (key == e.ENTER || key == e.SPACE)) {
                    fn = item.handler || me.handler;
                    if (fn) {
                        fn.call(item.scope || me.origScope || me, view, recordIndex, cellIndex, item, e, record, row,cell);
                    }
                } else if (type == 'mousedown' && item.stopSelection !== false) {
                    return false;
                }
            }
        }
        return me.callParent(arguments);
    },

    cascade: function(fn, scope) {
        fn.call(scope||this, this);
    },

    // Private override because this cannot function as a Container, and it has an items property which is an Array, NOT a MixedCollection.
    getRefItems: function() {
        return [];
    }
});