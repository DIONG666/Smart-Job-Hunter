import MainPage from "./Pages/MainPage/MainPage";
import RegisterPage from "./Pages/RegisterPage/RegisterPage";
import SignInPage from "./Pages/SignInPage/SignInPage";
import ApplyForJobPage from "./Pages/MainPage/components/home/ApplyForJob/ApplyForJobPage";
import HomePage from "./Pages/MainPage/components/home/HomePage/HomePage";
import ProfessionConsultPage from "./Pages/MainPage/components/home/ProfessionConsultPage";
import RecruitPage from "./Pages/MainPage/components/home/RecruitPage/RecruitPage";
import PersonalInformationPage from "./Pages/MainPage/components/person/student/PersonalInformationPage";
import EditInformation from "./Pages/MainPage/components/person/student/EditInformation";
import GuidePage from "./Pages/GuidePage/GuidePage";
import FirstGuidePage from "./Pages/GuidePage/components/FirstGuidePage";
import StudentGuidePage from "./Pages/GuidePage/components/StudentGuidePage";
import FirmGuidePage from "./Pages/GuidePage/components/FirmGuidePage";
import SecondStudentGuidePage from "./Pages/GuidePage/components/SecondStudentGuidePage";
import FirmInformation from "./Pages/MainPage/components/person/firm/FirmInformation";
import EditFirmInformation from "./Pages/MainPage/components/person/firm/EditFirmInformation";
import InitialPage from "./Pages/InitialPage";

const routes=[
    {
        path: '/',
        element: <InitialPage />
    },
    {
        path:'/main',
        element:<MainPage />,
        children:[
            {
                path:'/main/home',
                element:<HomePage/>
            },
            {
                path: '/main/job',
                element: <ApplyForJobPage/>
            },
            {
                path: '/main/recruit',
                element: <RecruitPage/>
            },
            {
                path: '/main/consult',
                element: <ProfessionConsultPage/>
            },
            {
                path: '/main/student_information',
                element: <PersonalInformationPage/>,
                children:[
                    {
                        path:'/main/student_information/edit',
                        element:<EditInformation/>
                    }
                ]
            },
            {
                path: '/main/firm_information',
                element: <FirmInformation />,
                children:[
                    {
                        path:'/main/firm_information/edit',
                        element:<EditFirmInformation/>
                    }
                ]
            }
        ]
    },
    {
        path: '/signIn',
        element: <SignInPage/>
    },
    {
        path: '/register',
        element: <RegisterPage/>
    },
    {
        path: '/guide',
        element: <GuidePage />,
        children:[
            {
                path:'/guide/identity',
                element:<FirstGuidePage/>
            },
            {
                path:'/guide/student_resume',
                element:<StudentGuidePage/>
            },
            {
                path:'/guide/student_information',
                element:<SecondStudentGuidePage/>
            },
            {
                path:'/guide/firm',
                element:<FirmGuidePage/>
            },
        ]
    },
]

export default routes