Ext.define('Ijobs.jobs.Guide',{
    extend : 'Ext.Container',
    alias : 'widget.guide',
    border : false,
    padding : 10,
    initComponent : function() {
        var me = this;
        
        me.items = [{
            xtype : 'fieldset',
            title : '新手上路',
            collapsible: true,
            bodyPadding : 10,
            name : 'simple_guide',
            items : [{
                xtype : 'panel',
                border : false,
	            html : [
	                '　　iJobs(作业管理平台) 是一个以开放的思路实现的“开放式”操作平台，运维人员在iJobs界面中可以定制几乎所有的运维操作，例如 批量shell脚本执行，大量文件传输，发布变更，数据备份等。',
	                '　　iJobs核心是作业，一个作业即代表一类运维场景。例如：发布游戏版本作业，数据库备份作业',
	                '　　下面我们来了解下iJbos创建和执行作业基本步骤 &nbsp;(更多帮助 请点击→<a style="font-size:14px;color:blue;" target="_blank" href="http://wiki.qcloud.com/wiki/iJobs"> iJobs wiki</a> )'
	            ].join('<br/></br>'),
	            buttonAlign : 'left',
	            buttons : [{
	                cls : 'opera btn_main long',
	                height : 30,
	                width : 150,
	                text : '新手上路',
	                style : 'margin :0 0 0 93px',
	                handler : me.guide.bind(me)
                }]            
            }]
        },me._buildAdvanceGuide()];
        

        me.callParent(arguments);
        Ext.TaskManager.start({
            run : function() {
                var isAdvance = localStorage.getItem('advance') =="true" ? true : false;
                if (isAdvance) {
                    me.down('fieldset[name=simple_guide]').collapse();
                    me.advanceGuide.expand();
                    localStorage.setItem('advance',false);
                }
            },
            interval : 500
        });
    },
    
    _buildAdvanceGuide : function () {
        var me = this,
            fs;
        me.advanceGuide = fs = Ext.widget({
            xtype : 'fieldset',
            title : '高级教程',
            collapsed  : true,
            collapsible: true,
            margin : '20px 0 0 0',
            name : 'advance_guide',
            
            layout: 'border',
            width : Ext.getBody().getWidth() - 50,
            height : 400,
            items : [{
                region: 'west', 
                xtype: 'dataview',
                trackOver: true,
                store: {
                    xtype : 'store',
                    autoLoad : true,
                    proxy: {
                        type: 'memory'
                    },
                    
                    fields: [
                        {name: 'url',  type: 'string'},
                        {name: 'name', type: 'string'}
                    ],                    
                    data: [
                        {name: '第一步：创建作业脚本'},
                        {name: '第二步：创建执行账户'},
                        {name: '第三步：创建作业模版'},
                        {name: '第四步：生成执行态'},
                        {name: '第五步：执行作业'}
                    ]                    
                },
                style:"background: #f2f2f2;",
                cls: 'step-list',
                itemSelector: '.step-list-item',
                overItemCls: 'step-list-item-hover',
                tpl: '<tpl for="."><div class="step-list-item">{name}</div></tpl>',
                listeners: {
                    boxready: function(dv){
                        var me = this,
                            panel = dv.nextSibling('panel'),
                            layout = panel.getLayout();
                        me.highlight(panel.items.indexOf(layout.getActiveItem()));                        
                    },
                    itemclick : function( dv,selected,item,index) {
                        var me = this;
                        me.activeCard(index);
                    },
                    scope: this
                }               
            },{
                region: 'center',
                layout : 'card',
                bodyStyle : 'padding:15px;border-color: #ccc;',                
                defaults : {
                	border :false,
                    listeners : {
                        boxready : me.bindLink.bind(me)
                    }
                },
                items : [{
                    action : 'stepCreateScript',
                    html: [
                        '<h1>第一步：创建作业脚本</h1>',
                        '<p style="margin-top:5px;">创建作业要执行的shell脚本，<a href="javascript:;" id="lnkstepCreateScript">点击这里</a>，如果复用已有脚本可跳过该步骤</p>'
                    ].join('')                    
                },{
                    action : 'stepCreateAccount',
                    html: [
                        '<h1>第二步：创建执行账户</h1>',
                        '<p style="margin-top:5px;">创建能远程登录主机和执行shell脚本的linux账户，<a href="javascript:;" id="lnkstepCreateAccount">点击这里</a>，如之前已创建过可跳过该步骤</p>'
                    ].join('')
                },{
                    action : 'stepCreateJobTemplate',                    
                    html: [
                        '<h1>第三步：创建作业模版</h1>',
                        '<p style="margin: 10px 0px 20px 15px;">如之前已创建过可跳过该步骤</p>',
                        '<p><ol>',
                        '<li style="margin: 5px 0px 20px 15px;">创建作业模版，<a href="javascript:;" id="lnkstepCreateJobTemplate">点击这里</a>，并依次执行下面步骤，稍微有点小复杂，请亲能耐心完成！</li>',
                        '<li style="margin: 5px 0px 20px 15px;">创建成功后，点击"编辑作业模版”，并添加执行步骤</li>',
                        '<li style="margin: 5px 0px 20px 15px;">在"编辑作业模版”，点击“全程设定” （在该步骤里绑定相应执行权限，jobIP等信息）</li>',
                        '</ol></p>'
                    ].join('')
                },{
                    html: [
                        '<h1>第四步：生成执行态</h1>',
                        '<p style="margin-top:5px;margin-bottom: 5px;">上一步创建的作业模版，仅能定义我们的运维操作场景，不能执行，须通过它生成执行态后，执行生成的执行态，来启动我们的作业，点“添加”按钮</p>',
                        '<p><img style="margin-top:5px;border: 1px solid #ccc;border-radius: 4px;-webkit-border-radius: 4px;-moz-border-radius: 4px;" src="' + IMAGES.JOB_TEMPLATE + '"/></p>'
                    ].join('')
                },{
                    html: [
                        '<h1>第五步：执行作业</h1>',
                        '<p style="margin-top:5px;margin-bottom: 10px;">执行作业，您已经学习了ijobs的高级功能，是不是有点小激动：）</p>',
                        '<p ><img style="border: 1px solid #ccc;border-radius: 4px;-webkit-border-radius: 4px;-moz-border-radius: 4px;"  src="' + IMAGES.JOB_EXEC + '"/></p>'
                        
                    ].join('')
                }],
                 bbar: ['->',{
                    action : 'prev',
                    text: '上一步',
                    handler: me.navigate.bind(me),
                    disabled: true
                },{
                    action : 'next',
                    text: '下一步',
                    handler: me.navigate.bind(me)
                }]                
            }]
                    
        });
        return fs;
    },
    
    bindLink : function(panel) {
        var me = this,
            func = null;
        if (panel.action) {
            panel.getEl().getById('lnk' + panel.action).on('click',me.execute[panel.action]);
        }
    },
    
    guide : function(btn) {
        var me = this,
            Frame = Frame ? Frame : parent.Frame;
        Frame.createNewTab( './jobs/tempScript.html?guide=1', 'job_0_00', '执行脚本(帮助)');
    },
    
    advanceGuide : function() {
        var me = this,
            Frame = Frame ? Frame : parent.Frame;

        Frame.createNewTab( './jobs/tempScript.html?guide=1', 'job_0_0', '执行脚本');        
    },
    
    navigate : function(btn) {
        var me = this,
            panel = me.advanceGuide.down('panel'),
            layout = panel.getLayout(),
            index = panel.items.indexOf(layout.getActiveItem()); 
        btn.action === 'next' ? index++ : index--;
        me.activeCard(index);
    },
    
    activeCard : function(index) {
        var me = this,
            panel = me.advanceGuide.down('panel'),
            layout = panel.getLayout(),
            btnNext = panel.down('button[action=next]'),
            btnPrev = panel.down('button[action=prev]');
        layout.setActiveItem(index);
//        layout[btn.action]();
        me.highlight(panel.items.indexOf(layout.getActiveItem()));
        btnPrev.setDisabled(!layout.getPrev());
        btnNext.setDisabled(!layout.getNext());
    },
    
    highlight : function(index) {
        var me = this,
            dv = me.advanceGuide.down('dataview'),
            sm = dv.getSelectionModel();
        sm.select(index);
    },
    
    execute : {
        
        stepCreateScript : function(event,dom) {
            var Frame = Frame ? Frame : parent.Frame;
            Frame.createNewTab( './components/scriptEdit.jsp?isStandard=0','job_2_0', '新建作业脚本');
        },
        
        stepCreateAccount : function(event,dom) {
            var Frame = Frame ? Frame : parent.Frame;
            Frame.createNewTab( './jobs/userAccountPage.jsp','job_4_0', '新建执行账户');
        },
        
        stepCreateJobTemplate : function(event,dom) {
            var Frame = Frame ? Frame : parent.Frame;
            Frame.createNewTab( './jobs/jobTemplateAdd.jsp','job_1_0', '新建作业模版');
        }
    }
    
});

Ext.onReady(function(){
	Ext.History.useTopWindow = false;
    Ext.History.init();
    Ext.create('Ijobs.jobs.Guide',{
        renderTo : Ext.getBody()
    });
    
});
var IMAGES = {
    JOB_TEMPLATE : './images/JOBSTEMPLAT.png',
    JOB_EXEC : './images/JobsExe.png'
};
