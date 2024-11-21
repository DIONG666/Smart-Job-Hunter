import {Button, Message, Modal, Radio, Steps, Upload} from "@arco-design/web-react";
import {IconCheck, IconUpload} from "@arco-design/web-react/icon";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {useState} from "react";
import leftWord from '../images/studentLeftWord.png'
import leftIcon from '../images/studentLeftIcon.png'
import rightWord from '../images/studentRightWord.png'
import rightIcon from '../images/studentRightIcon.png'
import '../style/guide.css'
import axios from "axios";
const RadioGroup = Radio.Group;
const Step = Steps.Step;

const StudentGuidePage=()=>{
    const user=useLocation().state
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const navigate=useNavigate()
    const [visible, setVisible] = useState(false);

    const [animationStyle,setAnimationStyle]=useState('fadeInAnimation')
    setTimeout(()=>{setAnimationStyle('')},1500)
    
    const [privacy,setPrivacy]=useState('')

    function Title(){
        return <p style={{fontWeight:'bold',fontSize:25}}>“慧职通”招聘门户网站 - 隐私政策</p>
    }

    return (
        <>
            <div style={{position:'fixed',top:'10%',bottom:0,left:0,right:'78%',textAlign:'center',paddingTop:100,paddingBottom:100}}>
                <img src={leftWord} alt={''} style={{width:'80%'}} class={animationStyle}></img>
                <img src={leftIcon} alt={''} style={{width:'90%'}} class={animationStyle}></img>
            </div>
            <div style={{position:'absolute',top:0,bottom:0,left:'22%',right:'22%',backgroundColor:'white',padding:'60px 120px 70px 120px'}}>
                <div>
                    <Steps current={2} style={{ width: 600, margin: '0 auto' }}>
                        <Step title='身份' description='请选择您的身份' icon={<IconCheck style={{marginTop:4,marginLeft:1}}/>}/>
                        <Step title='信息' description='请完善您的信息'/>
                    </Steps>
                </div>
                <div style={{fontSize:25,fontWeight:'bold',marginTop:30}}>
                    请上传您的简历
                </div>
                <div style={{marginTop:20,backgroundColor:'white',width:'100%',borderRadius:20,marginBottom:10}}>
                    <Upload
                        drag
                        action={`http://192.210.174.146:5000/resume/upload/${user.user_id}`}
                        limit={1}
                        onExceedLimit={() => {
                            Message.warning('超过上传数量限制！最多上传1个');
                        }}
                    />
                </div>
                <div style={{marginTop:15}}>
                    <div style={{display:'flex',alignItems:'center'}}>
                        <div style={{fontWeight:'bold'}}>隐私设置</div>
                        <Button style={{textDecoration:'none',color:'rgba(60,192,201,100%)',marginLeft:20,backgroundColor:'white',border:'none'}} onClick={() => setVisible(true)}>隐私协议和用户协议</Button>
                        <Modal
                            title={<Title/>}
                            visible={visible}
                            onOk={() => setVisible(false)}
                            onCancel={() => setVisible(false)}
                            autoFocus={false}
                            focusLock={true}
                            style={{width:'50%',marginTop:30,marginBottom:30}}
                        >
                            <p>
                                《用户服务协议和隐私政策》（以下简称“本政策”）及其条款，系您使用“慧职通”网页（以下简称“本网页”）所订立的、描述您与本软件之间权利义务的协议。
                                <br/>
                                本政策载列了我们处理您向我们提供的任何个人信息（包括您通过我们的招聘门户网站（下文简称“门户网站”提供的信息））以及我们接收自您或第三方（如推荐人）的与您的工作申请有关的个人信息所遵照的依据。请仔细阅读以下内容，以便了解我们将如何处理您的个人信息。您向我们提供个人信息或对本隐私政策勾选同意，即表示您承认及认可本隐私政策所述的条款。
                                本隐私政策仅针对我们控制的个人信息。您可能会通过第三方提交您的信息，他们会根据自身的独立隐私政策处理您的个人信息。我们对该等第三方如何处理您的个人信息概不负责。
                                <br/>
                                下文将帮您详细了解我们如何收集、使用、存储、传输、共享与保护个人信息；帮您了解查询、访问、删除、更正、撤回授权个人信息的方式。其中，有关您个人信息权益的条款重要内容我们已用加粗形式提示，请特别关注。
                                <br/><br/>
                                <span style={{fontSize:25}}>我们如何收集和使用您的个人信息</span>
                                <br/>
                                我们根据合法、正当、必要的原则，仅收集实现招聘目的所必要的信息。我们会按照如下方式收集您的个人信息， 包括但不限于您在使用我们的招聘服务时主动提供的、通过自动化手段收集的您在使用或接受服务中所产生的以及来自其他第三方的信息：
                                <br />
                                <span style={{fontWeight:'bolder'}}>注册和登录</span><br/>
                                您注册并登录本网页账号时至少向我们提供账号名称、头像、手机号码或电子邮箱，并创建密码。注册成功后，您提供的上述信息，将在您使用本软件平台和服务期间持续授权我们使用。在您注销账号时，我们将停止使用并删除上述信息或对您的个人信息进行匿名化处理，法律法规另有规定的除外。
                                <br />
                                <span style={{fontWeight:'bolder'}}>查看与筛选岗位</span><br/>
                                为提供相关功能所必须、分析我们服务的使用情况以及提升用户使用的体验，当您使用该网站的职位查看与筛选功能时，我们可能会收集您的搜索关键字信息。
                                <br />
                                <span style={{fontWeight:'bolder'}}>申请岗位</span><br/>
                                您作为申请的一部分向我们提供的信息。当您使用我们的门户网站申请职位时，您向我们提供的关于您的信息。这包括您在注册和使用门户网站时提供的简历信息 （如您的姓名、性别、 身份证号、联络信息、当前居住国家/地区、当前居住省/市（选填）、个人照片（选填）、紧急联系人信息（选填）、学历信息、工作经历、资料证明人信息（选填））以及您选择在门户网站提交或上传至门户网站的信息（如来自简历或附件中的信息）。
                                <br />
                                <span style={{fontWeight:'bolder'}}>岗位符合度评估</span><br/>
                                来自第三方的信息。我们可能会就您的申请从第三方接收信息，如推荐人、招聘人员、前用人单位或现用人单位及其雇员、 招聘服务机构及提供背景调查的组织（包括在适用法律允许的情况下，进行资料、资格核实等背景调查）。
                                <br/>
                                我们基于以下目的使用您的信息：<br/>
                                1.与您通信，沟通招聘事宜；<br/>
                                2.识别及评估您是否适合相关职位；<br/>
                                3.安排笔试、面试、素质或能力测试/测评等事宜；<br/>
                                4.确保遵循我们的内部政策；<br/>
                                5.确定及验证您的就业资格；<br/>
                                6.开展背景调查（包括在适用法律允许的情况下，进行资料、资格核实）；<br/>
                                7.管理、开发及改进门户网站；<br/>
                                8.若有与您的状况匹配的新职位（包括关联公司的职位）时与您取得联系（短信、邮件、电话等）；<br/>
                                9.与您联系，发送与招聘、入职相关的通知及信息；<br/>
                                10. 向您发送关于我们提供的服务的满意度、招聘活动参与意向的问卷。<br/>
                                特别提示：如我们收集的信息无法单独或结合其他信息识别到您的个人身份，则其不属于法律意义上的个人信息。
                                <br /><br />
                                <span style={{fontSize:25}}>我们如何转让和公开披露您的个人信息</span><br />
                                <span style={{fontWeight:'bolder'}}>转让</span><br/>
                                我们不会转让您的个人信息给任何其他第三方，除非征得您的明确同意。随着我们业务的持续发展，我们有可能进行合并、收购、资产转让等交易。 如若发生我们将告知您相关情形，按照法律法规及不低于本政策所要求的标准继续保护或要求接收方继续保护您的个人信息，否则我们将要求该接收方重新征得您的同意。
                                <br />
                                <span style={{fontWeight:'bolder'}}>公开披露</span><br/>
                                我们不会对外公开披露所收集的个人信息，如必须公开披露时，我们会向您告知此次公开披露的目的、披露信息的类型及可能涉及的敏感信息，并征得您的明示同意。
                                <br />
                                共享、转让、公开披露个人信息时事先征得授权同意的例外。
                                <br />
                                另外，根据相关法律法规及国家标准，以下情形中，我们可能会共享、转让、公开披露个人信息无需事先征得您的授权同意：
                                <br/>
                                · 与国家安全、国防安全直接相关的；<br/>
                                · 与公共安全、公共卫生、重大公共利益直接相关的；<br/>
                                · 与犯罪侦查、起诉、审判和判决执行等直接相关的；<br/>
                                · 出于维护个人信息主体或其他个人的生命、财产等重大合法权益但又很难得到本人同意的；<br/>
                                · 个人信息主体自行向社会公众公开个人信息的；<br/>
                                · 从合法公开披露的信息中收集个人信息的，如合法的新闻报道、政府信息公开等渠道。
                                <br/><br/>
                                <span style={{fontSize:25}}>我们如何存储您的个人信息</span><br />
                                <span style={{fontWeight:'bolder'}}>存储方式和期限</span><br/>
                                我们会通过安全的方式存储您的信息，包括本地存储、数据库和服务器日志。<br/>
                                一般情况下，我们只会在为实现本政策第一部分所述目的所必需的最短时间内或法律、行政法规规定或您另行授权同意的条件/范围内存储您的个人信息。<br/>
                                <span style={{fontWeight:'bolder'}}>存储地点</span><br/>
                                一般情况下，我们会将境内收集的个人信息存储于中华人民共和国境内。 若您申请境外岗位时，可能需要将您的个人信息跨境传输或储存到岗位所在的国家或地区。 除此之外，我们不会跨境传输或存储您的个人信息。将来如需跨境传输或存储的，我们会向您告知个人信息出境的目的、接收方、安全保证措施和安全风险， 并征您的单独同意。此外根据国内法律、行政法规和相关监管部门的规定执行，通过签订协议、评估核查等有效措施，要求境外机构为所获得的您的个人信息保密。
                                <br/><br/>
                                <span style={{fontSize:25}}>我们如何保障您的个人信息的安全</span><br />
                                <span style={{fontWeight:'bolder'}}>安全保护措施</span><br/>
                                我们已使用符合业界标准的安全防护措施保护第三方开发者和/或终端用户提供的个人信息，防止数据遭到未经授权访问、公开披露、使用、修改、损毁、泄漏或丢失。我们采用业界领先的技术保护措施。我们使用的技术手段包括但不限于防火墙、加密、去标识化或匿名化处理、访问控制措施等。此外，我们还会不断加强将SDK集成到第三方上的安全能力。
                                <br/>
                                <span style={{fontWeight:'bolder'}}>安全事件处置措施 </span><br/>
                                若发生个人信息泄露、损毁、丢失等安全事件，我们会启动应急预案，阻止安全事件扩大。安全事件发生后，我们会及时以推送通知、 邮件等形式向您告知安全事件的基本情况、我们即将或已经采取的处置措施和补救措施，以及我们对您的应对建议。
                                <br/><br/>
                                <span style={{fontSize:25}}>您如何行使您的权利</span><br />
                                在您使用期间，为了让您更便捷地查询访问、删除、更正您的个人信息，同时保障您撤回个人信息使用的同意和注销账户的权利，我们在门户网站设计中为您提供了相应的操作设置，您可参考下面的指引进行操作。
                                <br/>
                                <span style={{fontWeight:'bolder'}}>访问个人信息</span><br/>
                                访问我的简历信息：<br/>
                                1) 点击登录进入首页后，点击顶部导航栏中的用户昵称；<br/>
                                2) 点击“我的简历”；<br/>
                                3) 进行信息查询访问。<br/>
                                <span style={{fontWeight:'bolder'}}>删除个人信息</span><br/>
                                1) 点击登录进入首页后，点击顶部导航栏中的用户昵称；<br/>
                                2) 点击“我的简历”；<br/>
                                3) 点击“编辑修改”；<br/>
                                4) 进行信息删除。<br/>
                                <span style={{fontWeight:'bolder'}}>更正个人信息</span><br/>
                                更改简历信息：<br/>
                                1) 点击登录进入首页后，点击顶部导航栏中的用户昵称；<br/>
                                2) 点击“我的简历”；<br/>
                                3) 点击“编辑修改”；<br/>
                                4) 进行简历编辑修改操作。<br/>
                                更改头像和昵称：<br/>
                                1) 点击登录进入首页后，点击顶部导航栏中的用户昵称；<br/>
                                2) 进行头像和昵称编辑修改操作。<br/>
                                <span style={{fontWeight:'bolder'}}>退出登录</span><br/>
                                1) 点击登录进入首页后，点击顶部导航栏中的用户昵称；<br/>
                                2）点击“退出登录”。
                            </p>
                        </Modal>
                    </div>
                    <div style={{marginTop:10}}>
                        <RadioGroup onChange={value => {setPrivacy(value)}}>
                            <Radio value={2}>不公开</Radio>
                            <Radio value={1}>仅投递企业可见</Radio>
                            <Radio value={0}>公开</Radio>
                        </RadioGroup>
                    </div>
                    <div style={{display:'flex',marginTop:30,float:'right'}}>
                        <Button onClick={()=>{navigate('/guide/identity',{state:user})}} style={{border:'1px solid lightgrey',color:'rgba(60,192,201,100%)',backgroundColor:'white',width:85,height:35,fontSize:16,borderRadius:3,display:"flex",justifyContent:'center',alignItems:'center'}}>返 回</Button>
                        <Button onClick={()=>{
                            if(privacy!=='') {
                                axios({
                                    method:'post',
                                    url:'http://192.210.174.146:5000/resume/post-info/'+user.user_id,
                                    data:{
                                        "identity":'student',
                                        "privacySetting":privacy,
                                    }
                                }).then(
                                    res=>{
                                        if(res.status===200){
                                            Message.info('隐私设置上传成功！')
                                            navigate('/guide/student_information',{state:user})
                                        }
                                    },
                                    error=>{
                                        if(error.response){
                                            if(error.response.status===400){
                                                Message.error('请求的资源错误！')
                                            }
                                            if(error.response.status===404){
                                                Message.error('用户不存在！')
                                            }
                                            if(error.response.status===422){
                                                Message.error('文件格式不正确，请上传pdf文件')
                                            }
                                            if(error.response.status===500){
                                                Message.error('服务器内部错误！')
                                            }
                                        } else {
                                            Message.error('Network Error!')
                                        }
                                    }
                                )
                            } else {
                                Message.error('请先完善信息！')
                            }
                        }} style={{color:'white',backgroundColor:'rgba(60,192,201,100%)',marginLeft:30,width:85,height:35,fontSize:16,borderRadius:3,display:"flex",justifyContent:'center',alignItems:'center'}}>继 续</Button>
                    </div>
                </div>
            </div>
            <div style={{position:'fixed',top:'10%',bottom:0,left:'78%',right:0,textAlign:'center',paddingTop:100,paddingBottom:100}}>
                <img src={rightIcon} alt={''} style={{width:'90%'}} class={animationStyle}></img>
                <img src={rightWord} alt={''} style={{width:'70%'}} class={animationStyle}></img>
            </div>
        </>
    )
}

export default StudentGuidePage