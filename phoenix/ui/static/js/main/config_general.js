Docs_general = {};
Docs_general.Menu = [{
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
   	}/*,{
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
    }*/,{
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
    id : 'data',
    text : '数据统计',
    isMutilLevel: false,
	children: [{
        href: "./statistics/exeTaskIResult.jsp",
        text: "作业执行量",
        leaf: true
    },{
        href: "./statistics/exeJobIPStat.jsp",
        text: "成功执行目标机器数量",
        leaf: true
    },{
        href: "./statistics/transFilesStat.jsp",
        text: "文件传输吞吐量",
        leaf: true
    },{
        href: "./statistics/queryJobStat.jsp",
        text: "作业和执行态数量统计",
        leaf: true
    },{
        href: "./statistics/queryScriptFileStat.jsp",
        text: "作业脚本数量统计",
        leaf: true
    },{
        href: "./statistics/timeConsumingStat.jsp",
        text: "执行耗时分布",
        leaf: true
    },{
        href: "./statistics/errorTypeStat.jsp",
        text: "作业失败原因分布",
        leaf: true
    },{
        href: "./statistics/taskTypeStat.jsp",
        text: "作业执行类型分布",
        leaf: true
    }]
},{
    id : 'admin',
    text : '管理员入口',
    isMutilLevel: false,
    children: [{
        href: "./admin/errorTrans.jsp",
        text: "失败类型管理",
        leaf: true
    },{
        href: "./admin/viewCacheData.jsp",
        text: "查询缓存数据",
        leaf: true
    },{
    	href : './admin/configManage.jsp',
    	text : '配置数据管理',
    	leaf : true    	
    },{
    	href: './admin/registerAgent.jsp',
        text: "Agent注册",
        leaf: true
    },{
    	href : './admin/jobsvrReg.jsp',
    	text : "Jobsvr注册管理",
    	leaf : true        	
    },{
        href: './admin/tscSvrList.jsp',
        text: "Jobsvr列表",
        leaf: true
    },{
        href: './admin/tscTaskList.jsp',
        text: "当前运行任务",
        leaf: true
    },{
        href: './admin/tscRegSvrList.jsp',
        text: " Agent注册查询",
        leaf: true
    },{
        href: './admin/tscSplitedList.jsp',
        text: "TSC任务拆单查询",
        leaf: true
    },{
        href: './admin/tscJobList.jsp',
        text: " iJobs后台任务列表",
        leaf: true
    },{
        href: './admin/tscLog.jsp',
        text: "TSC任务诊断",
        leaf: true
    }]
},{
    id : 'help',
    text : '使用帮助',
    isMutilLevel: false,
    onlyOpenTab:true,
    tabUrl:'./common/help2.jsp',
    tabTitle:'使用帮助'
}];
