Ext.define('js.common.ux.Wizard',{
    alias: 'plugin.wizard',
    extend: 'Ext.AbstractPlugin',
    init : function(component) {
        var me = this,
            path = document.location.href,
            params = Ext.urlDecode(path.substring(path.indexOf('?')+1,path.length)),
            isGuide = me.isGuide = params['guide']=='1' ? true : false,
            spot;
        me.component = component;
        if (isGuide) {  
            component.on('afterrender', me.initWizard, me, {single: true});
        }
        
    },
    
    initWizard : function(comp) {
        var me = this,
            win,
            Frame = Frame ? Frame : parent.Frame;
            
        win =  Ext.widget({
            xtype : 'window',
            bodyPadding : 10,
            title : 'Tip',
            width : 200,
            height : 150,
            html : '绑定IP和账户权限就可以直接运行喽，另外还可以做“分发文件”呀，<a id="lnkFilesTrans" href="javascript:;">点击这里</a>',
            listeners : {
                boxready : function(win) {
                    win.getEl().getById('lnkFilesTrans').on('click',function(){
                        Frame.createNewTab( './jobs/tempFilesTransfer.jsp','job_0_1', '分发文件');
                    });
                }
            }
        });
        
        comp.add(win);
        win.show();
        win.setPosition(Ext.getBody().getWidth() - win.getWidth() - 40,20);
        
        comp.down('button[ref*=btnExecute]').setText('<i class="icon-ok icon-white"></i>&nbsp;运行吧');
    },
    
    done : function(){
        var me = this,
            Frame = Frame ? Frame : parent.Frame;
        if (!me.isGuide) {
            return;
        }
        Ext.Msg.on('boxready',function(msg){
            msg.getEl().getById('lnkAdvance').on('click',function(){
                localStorage.setItem('advance',true);
                Frame.createNewTab('./common/help2.jsp#!advance', 'help', '使用帮助');
            });
        });
        Ext.Msg.show({
            title : '系统提示',
            msg: '恭喜您成功执行了该脚本，是不是很简单呀？想探索更多高级功能吗？<a id="lnkAdvance" href="javascrpt:;">请点击这里</a>',
            width: 300,
            buttons: Ext.Msg.OK,
            icon: Ext.Msg.INFO
        });         
    }
});