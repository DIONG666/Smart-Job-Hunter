import MainPage from "./Pages/MainPage/MainPage";
import RegisterPage from "./Pages/RegisterPage/RegisterPage";
import SignInPage from "./Pages/SignInPage/SignInPage";
import ApplyForJobPage from "./Pages/MainPage/components/ApplyForJobPage";
import HomePage from "./Pages/MainPage/components/HomePage";
import ProfessionConsultPage from "./Pages/MainPage/components/ProfessionConsultPage";
import RecruitPage from "./Pages/MainPage/components/RecruitPage";
import PersonalInformationPage from "./Pages/MainPage/components/PersonalInformationPage";
import EditInformation from "./Pages/MainPage/components/EditInformation";

const routes=[
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
                path: '/main/personal',
                element: <PersonalInformationPage/>,
                children:[
                    {
                        path:'/main/personal/edit',
                        element:<EditInformation/>
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
]

export default routes