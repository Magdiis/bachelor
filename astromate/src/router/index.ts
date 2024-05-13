import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import GroupsPage from '../views/groups/GroupsPage.vue'
import BottomNavigation from '@/components/BottomNavigation.vue';
import GroupChatsPage from '../views/chat/GroupChatsPage.vue'
import NotificationPage from '../views/notification/NotificationPage.vue'
import AddGroup from '@/views/groups/AddGroupPage.vue';
import SearchPeopleAddPage from '@/views/groups/SearchPeopleAddPage.vue';
import SearchGroupsAddPageVue from '@/views/groups/SearchGroupsAddPage.vue';
import GroupMatchingPage from '@/views/matching/GroupMatchingPage.vue';
import UserMatchingPage from '@/views/matching/UserMatchingPage.vue';
import LoginPage from "@/views/auth/LoginPage.vue";
import RegistrationPage from "@/views/auth/RegistrationPage.vue";
import ProfilePage from "@/views/profile/ProfilePage.vue";
import ChatPage from "@/views/chat/ChatPage.vue";
import EditProfile from "@/views/profile/EditProfilePage.vue";
import SearchPeopleEditPage from "@/views/groups/SearchPeopleEditPage.vue";
import SearchGroupsEditPage from "@/views/groups/SearchGroupsEditPage.vue";

import { routesNames } from './routesNames';
import authentication from "@/composables/authentication/authentication";
import CreateProfilePage from "@/views/profile/CreateProfilePage.vue";
import {getAuth, onAuthStateChanged} from "firebase/auth";

const routes: Array<RouteRecordRaw> = [


  {
    path: '/login',
    name: routesNames.Login,
    component: LoginPage
  },
  {
    path: '/registration',
    name: routesNames.Registration,
    component: RegistrationPage,

  },
  {
    path: '/groupMatching',
    name: routesNames.GroupMatching,
    component: GroupMatchingPage,
    meta: {
      requiresAuth: true
    }
  }, 
  {
    path: '/userMatching',
    name: routesNames.UserMatching,
    component: UserMatchingPage,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/chat',
    name: routesNames.ChatPage,
    component: ChatPage,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/createProfile',
    name: routesNames.CreateProfile,
    component: CreateProfilePage,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/editProfile',
    name: routesNames.EditProfile,
    component: EditProfile,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/addGroup',
    name: routesNames.AddGroup,
    component: AddGroup,
    meta: {
      requiresAuth: true
    }
  }, 
  {
    path: '/searchPeopleAdd',
    name: routesNames.SearchPeopleAdd,
    component: SearchPeopleAddPage,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/searchGroupsAdd',
    name: routesNames.SearchGroupsAdd,
    component: SearchGroupsAddPageVue,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/searchPeopleEdit',
    name: routesNames.SearchPeopleEdit,
    component: SearchPeopleEditPage,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/searchGroupsEdit',
    name: routesNames.SearchGroupsEdit,
    component: SearchGroupsEditPage,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/tabs/',
    component: BottomNavigation,
    children:[
      {
        path:'',
        redirect: '/tabs/groups'
      },
      {
        path: 'groups',
        name: routesNames.Groups,
        component: GroupsPage,
        meta: {
          requiresAuth: true
        }
      },
      {
        path: 'profile',
        name: routesNames.Profile,
        component: ProfilePage,
        meta: {
          requiresAuth: true
        }
      },
      {
        path: 'groupChats',
        name: routesNames.GroupChats,
        component: GroupChatsPage,
        meta: {
          requiresAuth: true
        }
      }, 
      {
        path: 'notification',
        name: routesNames.Notification,
        component: NotificationPage,
        meta: {
          requiresAuth: true
        }
      }, 
    ]
  },

]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const isAuthRequired = to.matched.some((record) => record.meta.requiresAuth)
  const auth = getAuth()
 if(isAuthRequired && auth.currentUser === null){
   next({ name: routesNames.Login })
 } else {
   next()
 }


})

export default router
