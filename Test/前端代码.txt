import * as echarts from 'echarts'
import 'echarts-wordcloud'
import {useEffect} from "react";

const salaryName=['IT运维工程师','web前端开发工程师','兴宁前端、程序员实习生', '前端开发', '初级前端开发', 'web前端', '前端实习生', '5g通信工程师', '前端Vue开发实习生', 'web前端实习']
const salary=[8612, 7676, 9255, 8130, 6438, 11862, 7714, 8214, 7789, 8500]

const salaryWordCloud=[
    {
        name: 'IT运维工程师' ,
        value:8612
    },
    {
        name:  'web前端开发工程师',
        value:7676
    },
    {
        name:  '兴宁前端、程序员实习生',
        value:9255
    },
    {
        name: '前端开发' ,
        value:8130
    },
    {
        name: '初级前端开发' ,
        value:6438
    },
    {
        name:  'web前端' ,
        value:11862
    },
    {
        name: '前端实习生' ,
        value:7714
    },
    {
        name:  '5g通信工程师' ,
        value:8214
    },
    {
        name: '前端Vue开发实习生' ,
        value:7789
    },
    {
        name:  'web前端实习' ,
        value:8500
    },
]

const outputName=['IT运维工程师', 'web前端开发工程师', '兴宁前端、程序员实习生', '前端开发', '初级前端开发', 'web前端', '前端实习生', '5g通信工程师', '前端Vue开发实习生', 'web前端实习']
const outputFrequency=[0.53, 0.43, 0.62, 0.59, 0.67, 0.86, 0.46, 0.53, 0.63, 0.59]

const outputWordCloud=[
    {
        name:'IT运维工程师',
        value:0.53
    },
    {
        name: 'web前端开发工程师',
        value:0.43
    },
    {
        name:'兴宁前端、程序员实习生',
        value:0.62
    },
    {
        name:'前端开发',
        value:0.59
    },
    {
        name:'web前端',
        value:0.86
    },
    {
        name:'前端实习生',
        value:0.46
    },
    {
        name: '5g通信工程师',
        value:0.53
    },
    {
        name:'前端Vue开发实习生',
        value:0.63
    },
    {
        name: 'web前端实习',
        value:0.59
    },
    {
        name:'初级前端开发',
        value:0.67
    },
]

const skillName=['软件', '实习', '办公软件', '报告', '数据库', '沟通', '定期巡检，运维', '项目技术方案', '现场采集', '维护']
const skillFrequency=[0.59, 0.76, 0.96, 0.83, 0.44, 0.50, 0.38, 0.48, 0.48, 0.38]

const skillWordCloud=[
    {
        name:'软件' ,
        value:0.59
    },
    {
        name:'实习' ,
        value:0.76
    },
    {
        name:  '办公软件',
        value:0.96
    },
    {
        name:  '报告',
        value:0.83
    },
    {
        name: '数据库',
        value:0.44
    },
    {
        name:'沟通' ,
        value:0.50
    },
    {
        name: '定期巡检，运维',
        value:0.38
    },
    {
        name: '项目技术方案' ,
        value:0.48
    },
    {
        name: '现场采集',
        value:0.48
    },
    {
        name:'维护' ,
        value:0.38
    },
]

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
                            return '中心度：'+outputFrequency[params.dataIndex]
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
                right:'1%',
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
                            return '中心度：'+outputFrequency[params.dataIndex]
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