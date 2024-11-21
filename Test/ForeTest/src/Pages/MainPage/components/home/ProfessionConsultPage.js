import * as echarts from 'echarts'
import 'echarts-wordcloud'
import {useEffect} from "react";

const salaryName = ['市政/水利总工程师', '光通信CTO', '首席法务官CLO', '兼职网页制作', '人工智能', '质量总负责人', '乡村振兴CEO', '大幅面打印维修工程师', 'cio信息官', '产品负责人'];
const salary = [115000, 80000, 73750, 70568.85, 62500, 60000, 56250, 54250, 53750, 53533.69];


const salaryWordCloud = [
    { name: '市政/水利总工程师', value: 115000.00 },
    { name: '光通信CTO', value: 80000.00 },
    { name: '首席法务官CLO', value: 73750.00 },
    { name: '兼职网页制作', value: 70568.85 },
    { name: '人工智能', value: 62500.00 },
    { name: '质量总负责人', value: 60000.00 },
    { name: '乡村振兴CEO', value: 56250.00 },
    { name: '大幅面打印维修工程师', value: 54250.00 },
    { name: 'cio信息官', value: 53750.00 },
    { name: '产品负责人', value: 53533.69 },
    { name: '高级C++开发工程师', value: 50250.00 },
    { name: '机器人算法CTO', value: 47500.00 },
    { name: '大数据架构师', value: 45000.00 },
    { name: '投融资合伙人', value: 45000.00 },
    { name: 'CTO', value: 43750.00 },
    { name: '区块链开发专家', value: 40781.25 },
    { name: 'Senior Software Engineer', value: 39218.75 },
    { name: '计算机技术', value: 36599.15 },
    { name: '车载中间件软件开发', value: 33750.00 },
    { name: 'linux应用层开发工程师', value: 33125.00 },
    { name: '事业部合伙人', value: 32500.00 },
    { name: '总经理', value: 32500.00 },
    { name: '监理', value: 32500.00 },
    { name: '单片机', value: 32500.00 },
    { name: 'java服务器主程', value: 31250.00 },
    { name: '硅光芯片设计', value: 31250.00 },
    { name: '技术总工    产品中心', value: 30625.00 },
    { name: '研发副总', value: 30000.00 },
    { name: '算法软件工程师', value: 29507.81 },
    { name: '销售VP', value: 28750.00 },
    { name: '对日C/C++软件开发工程师', value: 28250.00 },
    { name: 'Python工程师兼职', value: 28125.00 },
    { name: '正畸医生', value: 27500.00 },
    { name: '配送总监', value: 27500.00 },
    { name: '合伙人', value: 27500.00 },
    { name: 'C++ 汽车诊断软件工程师 (自招 深圳龙华)', value: 27500.00 },
    { name: 'AI Software Engineer', value: 27500.00 },
    { name: '高级后端工程师/后端软件架构师', value: 27500.00 },
    { name: '软件总监/总架构师', value: 27500.00 },
    { name: 'FPGA工程师', value: 27500.00 },
    { name: '数据科学家 Applied Scientist - 深度学习', value: 27500.00 },
    { name: '资深游戏TA（技术向）', value: 26250.00 },
    { name: 'APP推广', value: 26250.00 },
    { name: '机电工程师，设计非标炉用电机风机', value: 26250.00 },
    { name: '双向逆变高级软件工程师', value: 25937.50 },
    { name: '软件开发架构师', value: 25375.00 },
    { name: 'C++', value: 25312.50 },
    { name: 'Technical  Account Manager上海/厦门/福州', value: 25000.00 },
    { name: '微服务治理-mesh', value: 25000.00 },
    { name: '前端UI工程师', value: 24307.86 }
];

const outputName = ['IT运维工程师', '实习web前端开发工程师', '前端实习生', '计算机技术', '前端开发（接受实习生）', '节能工程师', '网络运营助理文员', '系统维护工程师', '初级前端开发（实习生&应届生）', '前端开发/网页制作'];
const outputFrequency = [0.33, 0.23, 0.16, 0.04, 0.03, 0.03, 0.02, 0.02, 0.02, 0.01];

const outputWordCloud = [
    { name: 'IT运维工程师', value: 0.33 },
    { name: '实习web前端开发工程师', value: 0.23 },
    { name: '前端实习生', value: 0.16 },
    { name: '计算机技术', value: 0.04 },
    { name: '前端开发（接受实习生）', value: 0.03 },
    { name: '节能工程师', value: 0.03 },
    { name: '网络运营助理文员', value: 0.02 },
    { name: '系统维护工程师', value: 0.02 },
    { name: '初级前端开发（实习生&应届生）', value: 0.02 },
    { name: '前端开发/网页制作', value: 0.01 },
    { name: '软件前端开发', value: 0.01 },
    { name: 'web3D技术优秀毕业生', value: 0.01 },
    { name: 'web前端', value: 0.01 },
    { name: '初级硬件工程师', value: 0.01 },
    { name: '兴宁前端、程序员实习生', value: 0.01 },
    { name: '计算机编程老师', value: 0.01 },
    { name: '见习运维工程师（琼海）', value: 0.01 },
    { name: '前端开发工程师 （react方向）(J10401)', value: 0.01 },
    { name: '计算机专业', value: 0.00 },
    { name: '计算机（办公/设计/装潢）老师/助教', value: 0.00 },
    { name: 'C++', value: 0.00 },
    { name: '前端UI工程师', value: 0.00 },
    { name: '计算机专业老师，护理，电子商务教师', value: 0.00 },
    { name: '.NET(C#)项目开发工程师助理', value: 0.00 },
    { name: '兼职网页制作', value: 0.00 },
    { name: '计算机讲师', value: 0.00 },
    { name: '网络数据员（五险+住宿+餐补）', value: 0.00 },
    { name: '计算机', value: 0.00 },
    { name: '网络维护和运营', value: 0.00 },
    { name: '产品负责人', value: 0.00 },
    { name: '系统集成', value: 0.00 },
    { name: '实习生', value: 0.00 },
    { name: '.net实习生', value: 0.00 },
    { name: '对日C/C++软件开发工程师', value: 0.00 },
    { name: '网络工程师【H3C】', value: 0.00 },
    { name: '汽车市场经理（八里街一汽大众4S店）', value: 0.00 },
    { name: '线上兼职计算机助教老师', value: 0.00 },
    { name: '网络安全售前工程师(面议)', value: 0.00 },
    { name: '网络维护', value: 0.00 },
    { name: '直签+C++工程师+七险一金+最高可定60K月薪', value: 0.00 },
    { name: '高级C++开发工程师', value: 0.00 },
    { name: '5g通信工程师', value: 0.00 },
    { name: '前端Vue开发实习生', value: 0.00 },
    { name: '专升本计算机老师', value: 0.00 },
    { name: '测绘工程师', value: 0.00 },
    { name: '算法软件工程师', value: 0.00 },
    { name: 'web前端工程师-兼职', value: 0.00 },
    { name: '上位机调试工程师', value: 0.00 },
    { name: '计算机程序设计员', value: 0.00 },
    { name: '疫情不失业网络推广含销售', value: 0.00 }
];

const skillName = ['计算机', '软件', '设计', '沟通', '维护', '工作经验', '前端', '硬件', 'CSS', 'HTML'];
const skillFrequency = [0.60, 0.59, 0.51, 0.50, 0.37, 0.30, 0.23, 0.17, 0.15, 0.14];

const skillWordCloud = [
    { name: '计算机', value: 0.60 },
    { name: '软件', value: 0.59 },
    { name: '设计', value: 0.51 },
    { name: '沟通', value: 0.50 },
    { name: '维护', value: 0.37 },
    { name: '工作经验', value: 0.30 },
    { name: '前端', value: 0.23 },
    { name: '硬件', value: 0.17 },
    { name: 'CSS', value: 0.15 },
    { name: 'HTML', value: 0.14 },
    { name: '数据库', value: 0.14 },
    { name: 'JavaScript', value: 0.10 },
    { name: '办公软件', value: 0.10 },
    { name: 'web', value: 0.10 },
    { name: 'Vue', value: 0.09 },
    { name: '后端', value: 0.09 },
    { name: '报告', value: 0.08 },
    { name: '小程序', value: 0.08 },
    { name: '实习', value: 0.08 },
    { name: 'UI', value: 0.08 },
    { name: 'PC', value: 0.07 },
    { name: '接口', value: 0.06 },
    { name: '项目经验', value: 0.06 },
    { name: 'app', value: 0.05 },
    { name: '对接', value: 0.05 },
    { name: '移动端', value: 0.05 },
    { name: 'C#', value: 0.05 },
    { name: '应届毕业生', value: 0.05 },
    { name: 'Python', value: 0.05 },
    { name: '电路', value: 0.04 },
    { name: '多线程', value: 0.04 },
    { name: '网络工程', value: 0.04 },
    { name: '信息安全', value: 0.04 },
    { name: '数学', value: 0.03 },
    { name: '浏览器兼容', value: 0.03 },
    { name: 'ps', value: 0.03 },
    { name: 'JAVA', value: 0.02 },
    { name: 'W3C', value: 0.02 },
    { name: 'uni-app', value: 0.02 },
    { name: '物联网', value: 0.02 },
    { name: 'element', value: 0.02 },
    { name: 'jquery', value: 0.02 },
    { name: '理工科', value: 0.02 },
    { name: 'JSON', value: 0.01 },
    { name: '游戏', value: 0.01 },
    { name: '前后端分离', value: 0.01 },
    { name: 'Bootstrap', value: 0.01 },
    { name: '电气自动化', value: 0.01 },
    { name: 'AJAX', value: 0.01 },
    { name: 'Socket', value: 0.01 }
];



const ProfessionConsultPage=()=>{
    useEffect(()=>{
        const offset=document.getElementById('bar').clientWidth

        const jobOption = {
            xAxis: {
                type: 'value',
            },
            yAxis: {
                type: 'category',
                data: outputName
            },
            grid:{
                left:'1%',
                right:'1%',
                top:'1%',
                bottom:'1%',
                containLabel:'true'
            },
            series: [
                {
                    data: outputFrequency,
                    type: 'bar',
                    showBackground: true,
                    label: {
                        show: true, // 显示
                        textStyle:{
                            color:'white',
                            fontSize:14,
                        },
                        align:'left',
                        position:'left',
                        offset:[offset*0.03,1],
                        verticalAlign:'middle',
                        formatter:function (params){
                            return '度中心性：'+outputFrequency[params.dataIndex]
                        }
                    }
                }
            ]
        };

        const skillOption = {
            xAxis: [
                {
                    type: 'value',
                },
            ],
            yAxis: {
                type: 'category',
                data: skillName
            },
            grid:{
                left:'1%',
                right:'5%',
                top:'1%',
                bottom:'1%',
                containLabel:'true'
            },
            series: [
                {
                    data: skillFrequency,
                    type: 'bar',
                    showBackground: true,
                    label: {
                        show: true, // 显示
                        textStyle:{
                            color:'white',
                            fontSize:14,
                        },
                        align:'left',
                        position:'left',
                        offset:[offset*0.03,1],
                        verticalAlign:'middle',
                        formatter:function (params){
                            return '度中心性：'+skillFrequency[params.dataIndex]
                        }
                    }
                }
            ]
        };

        const salaryOption = {
            xAxis: {
                type: 'value',
            },
            yAxis: [
                {
                    type: 'category',
                    data: salaryName,
                }
            ],
            grid:{
                left:'1%',
                right:'5%',
                top:'1%',
                bottom:'1%',
                containLabel:'true'
            },
            series: [
                {
                    data: salary,
                    type: 'bar',
                    showBackground: true,
                    label: {
                        show: true, // 显示
                        textStyle:{
                            color:'white',
                            fontSize:14,
                        },
                        align:'left',
                        position:'left',
                        offset:[offset*0.03,1],
                        verticalAlign:'middle',
                        formatter:function (params){
                            return '薪资：'+salary[params.dataIndex]+'元/月'
                        }
                    }
                }
            ]
        };

        const jobOption2 = {
            tooltip: {
                show:true
            },
            series: [
                {
                    data:outputWordCloud,
                    type: "wordCloud",
                    gridSize: 1,
                    sizeRange: [12, 50],
                    rotationRange: [-45,45],
                    textStyle: {
                        color: function() {
                            return (
                                "rgb(" +
                                Math.round(Math.random() * 255) +
                                ", " +
                                Math.round(Math.random() * 255) +
                                ", " +
                                Math.round(Math.random() * 255) +
                                ")"
                            );
                        }
                    },
                    left: "center",
                    top: "center",
                    right: null,
                    bottom: null,
                    width: "100%",
                    height: "100%",
                }
            ]
        };

        const skillOption2 = {
            tooltip: {
                show:true,
            },
            series: [
                {
                    data:skillWordCloud,
                    type: "wordCloud",
                    gridSize: 1,
                    sizeRange: [12, 50],
                    rotationRange: [-45,45],
                    textStyle: {
                        color: function() {
                            return (
                                "rgb(" +
                                Math.round(Math.random() * 255) +
                                ", " +
                                Math.round(Math.random() * 255) +
                                ", " +
                                Math.round(Math.random() * 255) +
                                ")"
                            );
                        }
                    },
                    left: "center",
                    top: "center",
                    right: null,
                    bottom: null,
                    width: "100%",
                    height: "100%",
                }
            ]
        };

        const salaryOption2 = {
            tooltip: {
                show:true,
                valueFormatter:function (value){
                    return value + ' 元/月'
                }
            },
            series: [
                {
                    data:salaryWordCloud,
                    type: "wordCloud",
                    gridSize: 1,
                    sizeRange: [12, 50],
                    rotationRange: [-45,45],
                    textStyle: {
                        color: function() {
                            return (
                                "rgb(" +
                                Math.round(Math.random() * 255) +
                                ", " +
                                Math.round(Math.random() * 255) +
                                ", " +
                                Math.round(Math.random() * 255) +
                                ")"
                            );
                        }
                    },
                    left: "center",
                    top: "center",
                    right: null,
                    bottom: null,
                    width: "100%",
                    height: "100%",
                }
            ]
        };

        echarts.init(document.getElementById('hotJob')).setOption(jobOption)
        echarts.init(document.getElementById('hotSkill')).setOption(skillOption)
        echarts.init(document.getElementById('highSalary')).setOption(salaryOption)
        echarts.init(document.getElementById('hotJob2')).setOption(jobOption2)
        echarts.init(document.getElementById('hotSkill2')).setOption(skillOption2)
        echarts.init(document.getElementById('highSalary2')).setOption(salaryOption2)
    },[])

    return (
        <div style={{display:'flex',justifyContent:'center',alignItems:'center',height:'100%',width:'100%'}}>
            <div style={{width:'100%',height:'95%'}}>
                <div style={{width:'100%',height:'45%',display:'flex',justifyContent:'space-around',alignItems:'center'}}>
                    <div id={'bar'} style={{width:'31%',height:'100%',textAlign:'center'}}>
                        <div style={{fontWeight:'bold',fontSize:17}}>热门职位</div>
                        <div id={'hotJob'} style={{width:'100%',height:'100%',marginTop:5}}></div>
                    </div>
                    <div style={{width:'31%',height:'100%',textAlign:'center'}}>
                        <div style={{fontWeight:'bold',fontSize:17}}>热门技能</div>
                        <div id={'hotSkill'} style={{width:'100%',height:'100%',marginTop:5}}></div>
                    </div>
                    <div style={{width:'31%',height:'100%',textAlign:'center'}}>
                        <div style={{fontWeight:'bold',fontSize:17}}>高薪职位</div>
                        <div id={'highSalary'} style={{width:'100%',height:'100%',marginTop:5}}></div>
                    </div>
                </div>
                <div style={{width:'100%',height:'45%',marginTop:'4%',display:'flex',justifyContent:'space-around',alignItems:'center'}}>
                    <div id={'hotJob2'} style={{width:'31%',height:'100%',textAlign:'center'}}></div>
                    <div id={'hotSkill2'} style={{width:'31%',height:'100%',textAlign:'center'}}></div>
                    <div id={'highSalary2'} style={{width:'31%',height:'100%',textAlign:'center'}}></div>
                </div>
            </div>
        </div>
    )
}

export default ProfessionConsultPage