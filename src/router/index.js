import Vue from 'vue'
import Router from 'vue-router'

// 路由懒加载
const Register = r => require.ensure([], () => r(require('@/pages/register/Register')), 'Register');
const Login = r => require.ensure([], () => r(require('@/pages/login/Login')), 'Login');
const Contact = r => require.ensure([], () => r(require('@/pages/contact/Contact')), 'Contact');
const ContactGroup = r => require.ensure([], () => r(require('@/pages/contact/ContactGroup')), 'ContactGroup');
const Create = r => require.ensure([], () => r(require('@/pages/contact/Create')), 'Create');
const Edit = r => require.ensure([], () => r(require('@/pages/contact/Edit')), 'Edit');
const PositionIndex = r => require.ensure([], () => r(require('@/pages/position/PositionIndex')), 'PositionIndex');
const PositionChoose = r => require.ensure([], () => r(require('@/pages/position/PositionChoose')), 'PositionChoose');
const PositionParentChild = r => require.ensure([], () => r(require('@/pages/position/PositionParentChild')), 'PositionParentChild');
const MechanismIndex = r => require.ensure([], () => r(require('@/pages/mechanism/MechanismIndex')), 'MechanismIndex');
const MechanismParentChild = r => require.ensure([], () => r(require('@/pages/mechanism/MechanismParentChild')), 'MechanismParentChild');
const Department = r => require.ensure([], () => r(require('@/pages/department/Department')), 'Department');
const DepartmentAdd = r => require.ensure([], () => r(require('@/pages/department/DepartmentAdd')), 'DepartmentAdd');
const Upload = r => require.ensure([], () => r(require('@/pages/contact/Upload')), 'Upload');
const Name = r => require.ensure([], () => r(require('@/pages/contact/Name')), 'Name');
const Industry = r => require.ensure([], () => r(require('@/pages/contact/Industry')), 'Industry');
const Background = r => require.ensure([], () => r(require('@/pages/background/Background')), 'Background');
const BackgroundAdd = r => require.ensure([], () => r(require('@/pages/background/BackgroundAdd')), 'BackgroundAdd');
const Favorite = r => require.ensure([], () => r(require('@/pages/favorite/Favorite')), 'Favorite');
const FavoriteAdd = r => require.ensure([], () => r(require('@/pages/favorite/FavoriteAdd')), 'FavoriteAdd');
const Telphone = r => require.ensure([], () => r(require('@/pages/contact/Telphone')), 'Telphone');
const Location = r => require.ensure([], () => r(require('@/pages/contact/Location')), 'Location');
const Analyse = r => require.ensure([], () => r(require('@/pages/analyse/Analyse')), 'Analyse');
const AnalyseDetail = r => require.ensure([], () => r(require('@/pages/analyse/AnalyseDetail')), 'AnalyseDetail');
const Relationship = r => require.ensure([], () => r(require('@/pages/relationship/Relationship')), 'Relationship');

/* import Register from '@/pages/register/Register'
import Login from '@/pages/login/Login'
import Contact from '@/pages/contact/Contact'
import ContactGroup from '@/pages/contact/ContactGroup'
import Create from '@/pages/contact/Create'
import Edit from '@/pages/contact/Edit'
import PositionIndex from '@/pages/position/PositionIndex'
import PositionChoose from '@/pages/position/PositionChoose' 
import PositionParentChild from '@/pages/position/PositionParentChild'
import MechanismIndex from '@/pages/mechanism/MechanismIndex'
import MechanismParentChild from '@/pages/mechanism/MechanismParentChild'
import Department from '@/pages/department/Department'
import DepartmentAdd from '@/pages/department/DepartmentAdd'
import Upload from '@/pages/contact/Upload'
import Name from '@/pages/contact/Name'
import Industry from '@/pages/contact/Industry'
import Background from '@/pages/background/Background'
import BackgroundAdd from '@/pages/background/BackgroundAdd'
import Favorite from '@/pages/favorite/Favorite'
import FavoriteAdd from '@/pages/favorite/FavoriteAdd'
import Telphone from '@/pages/contact/Telphone'
import Location from '@/pages/contact/Location'
import Analyse from '@/pages/analyse/Analyse'
import AnalyseDetail from '@/pages/analyse/AnalyseDetail'
import Relationship from '@/pages/relationship/Relationship' */

Vue.use(Router)

export default new Router({
    linkActiveClass: 'link-active', // 默认样式起别名
    routes: [{
            path: '/',
            component: Login
        },
        {
            path: '/register',
            name: 'Register',
            component: Register,
        },
        {
            path: '/login',
            name: 'Login',
            component: Login
        },
        {
            path: '/contact',
            name: 'Contact',
            component: Contact,
            meta: { requiresAuth: true }
        },
        {
            path: '/group',
            name: 'ContactGroup',
            component: ContactGroup,
            meta: { requiresAuth: true }
        },
        {
            path: '/create',
            name: 'Create',
            component: Create,
            meta: { requiresAuth: true }
        },
        {
            path: '/edit',
            name: 'Edit',
            component: Edit,
            meta: { requiresAuth: true }
        },
        {
            path: '/upload',
            name: 'Upload',
            component: Upload,
            meta: { requiresAuth: true }
        },
        {
            path: '/name',
            name: 'Name',
            component: Name,
            meta: { requiresAuth: true }
        },
        // 职位部分的路由
        {
            path: '/position/positionIndex',
            name: 'PositionIndex',
            component: PositionIndex,
            meta: { requiresAuth: true }
        },
        {
            path: '/position/positionChoose',
            name: 'PositionChoose',
            component: PositionChoose,
            meta: { requiresAuth: true }
        },
        {
            path: '/position/positionParentChild',
            name: 'PositionParentChild',
            component: PositionParentChild,
            meta: { requiresAuth: true }
        },
        // 机构部分
        {
            path: '/mechanism/mechanismIndex',
            name: 'MechanismIndex',
            component: MechanismIndex,
        },
        {
            path: '/mechanism/mechanismParentChild',
            name: 'MechanismParentChild',
            component: MechanismParentChild,
        },
        // 部门部分
        {
            path: '/department',
            name: 'Department',
            component: Department,
            meta: { requiresAuth: true }
        },
        {
            path: '/departmentAdd',
            name: 'DepartmentAdd',
            component: DepartmentAdd,
            meta: { requiresAuth: true }
        },
        // 行业
        {
            path: '/industry',
            name: 'Industry',
            component: Industry,
            meta: { requiresAuth: true }
        },
        // 背景
        {
            path: '/background',
            name: 'Background',
            component: Background,
            meta: { requiresAuth: true }
        },
        {
            path: '/backgroundAdd',
            name: 'BackgroundAdd',
            component: BackgroundAdd,
            meta: { requiresAuth: true }
        },
        // 亲信
        {
            path: '/favorite',
            name: 'Favorite',
            component: Favorite,
            meta: { requiresAuth: true }
        },
        {
            path: '/favoriteAdd',
            name: 'FavoriteAdd',
            component: FavoriteAdd,
            meta: { requiresAuth: true }
        },
        // 联系人
        {
            path: '/telphone',
            name: 'Telphone',
            component: Telphone,
            meta: { requiresAuth: true }
        },
        // 行政范围
        {
            path: '/location',
            name: 'Location',
            component: Location,
            meta: { requiresAuth: true }
        },
        // 分析
        {
            path: '/analyse',
            name: 'Analyse',
            component: Analyse,
            meta: { requiresAuth: true }
        },
        // 具体分析
        {
            path: '/analyseDetail',
            name: 'AnalyseDetail',
            component: AnalyseDetail,
            meta: { requiresAuth: true }
        },
        // 关系图
        {
            path: '/relationship',
            name: 'Relationship',
            component: Relationship,
            meta: { requiresAuth: true }
        }
    ]
})