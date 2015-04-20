Docs_user = {};
Docs_user.Menu = [{
    id : 'user',
    text : '个人中心',
    isMutilLevel: false,//是否有多级子菜单，至多支持三级
    children: [{
        href: "./jobs/userFavorites.jsp",
        text: "我的收藏",
        leaf: true
    },{
        href: "./jobs/setHomepage.jsp",
        text: "首页设置",
        leaf: true
    },{
    	href: "./personal/personalConfig.jsp",
    	text: "个人设置",
    	leaf: true
    }]
},{
    id : 'job',
    text : '作业管理',
    isMutilLevel: true,
    children: [{
        text: "一次性操作",
        expanded: true,
        children: [{
            href: './jobs/tempScript.html',
            text: "执行脚本",
            leaf: true
        },{
            href: './jobs/tempFilesTransfer.jsp',
            text: "分发文件",
            leaf: true
        }]
    },{
        text: "作业管理",
        expanded: true,
        children: [{
            href: "./jobs/jobTemplateAdd.jsp",
            text: "新建作业模板",
            leaf: true
        },{
            href: "./jobs/getTaskTListSearch.action",
            text: "作业模板管理",
            leaf: true
        },{
            href: "./jobs/jobCustomSearch.jsp",
            text: "作业执行态管理",
            leaf: true
        }]
    },{
   	    text: "作业脚本管理",
   	    expanded: true,
   	    children: [{
            href: "./components/scriptEdit.jsp?isStandard=0",
            text: "新建作业脚本",
            leaf: true
        },{
            href: "./components/scriptList.jsp?isStandard=0",
            text: "查询作业脚本",
            leaf: true
        }]
   	},/*{
        text: "作业定时管理",
        expanded: true,
        children: [{
            href: "./jobs/crontabTaskList.jsp",
            text: "定时调度管理",
            leaf: true
        },{
            href: "./jobs/crontabHistory.jsp",
            text: "定时执行历史",
            leaf: true
        }]
    },*/{
        text: "执行账户管理",
        expanded: true,
        children: [{
            href: "./jobs/userAccountPage.jsp",
            text: "登记执行账户",
            leaf: true
        },{
            href: "./jobs/userAccountList.jsp",
            text: "执行账户管理",
            leaf: true
        }]
    },{
        text: "作业执行历史",
        expanded : true,
        children: [{
            href: "./jobs/taskIList.jsp",
            text: "作业执行历史",
            leaf: true
        }]
    },{
    	text: "Agent 状态查看",
        expanded : true,
        children: [{
            href: "./jobs/agentMgr.jsp",
            text: "Agent 状态查看",
            leaf: true
        }]
    }]
},{
    id : 'help',
    text : '使用帮助',
    isMutilLevel: false,
    onlyOpenTab:true,
    tabUrl:'./common/help2.jsp',
    tabTitle:'使用帮助'
}];
