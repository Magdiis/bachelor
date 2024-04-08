import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import CreateProfile from '../views/profile/CreateProfilePage.vue'
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

import { routesNames } from './routesNames';
import authentication from "@/composables/authentication/authentication";
import CreateProfilePage from "@/views/profile/CreateProfilePage.vue";

const routes: Array<RouteRecordRaw> = [


  {
    path: '/login',
    name: routesNames.Login,
    component: LoginPage
  },
  {
    path: '/registration',
    name: routesNames.Registration,
    component: RegistrationPage
  },
  {
    path: '/groupMatching/:groupsFilter',
    name: routesNames.GroupMatching,
    component: GroupMatchingPage,
    meta: {
      requiresAuth: true
    }
  }, 
  {
    path: '/userMatching/:groupsFilter',
    name: routesNames.UserMatching,
    component: UserMatchingPage,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/chat/:chatParams',
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
    // meta: {
    //   requiresAuth: true
    // }
  },
  {
    path: '/editProfile',
    name: routesNames.EditProfile,
    component: EditProfile,
    // meta: {
    //   requiresAuth: true
    // }
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
    path: '/',
    redirect: '/groups'
  },
  {
    path: '/',
    component: BottomNavigation,
    children:[
      {
        path: '/profile',
        name: routesNames.Profile,
        component: ProfilePage,
        meta: {
          requiresAuth: true
        }
      },
      {
        path: '/groups',
        name: routesNames.Groups,
        component: GroupsPage,
        meta: {
          requiresAuth: true
        }
      }, 
      {
        path: '/groupChats',
        name: routesNames.GroupChats,
        component: GroupChatsPage,
        meta: {
          requiresAuth: true
        }
      }, 
      {
        path: '/notification',
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


  if (isAuthRequired && !authentication().isUserLoggedIn()) {
    next({ name: routesNames.Login })
  // } else if (isGuestRequired && authStore.isUserLoggedIn) {
  //   next({ name: "books"})
  } else {
    next()
  }
})

export default router
