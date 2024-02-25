import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import CreateProfile from '../views/profile/CreateProfilePage.vue'
import GroupsPage from '../views/groups/GroupsPage.vue'
import BottomNavigation from '@/components/BottomNavigation.vue';
import ChatPage from '../views/chat/ChatPage.vue'
import NotificationPage from '../views/notification/NotificationPage.vue'
import AddGroup from '@/views/groups/AddGroupPage.vue';
import SearchPeopleAddPage from '@/views/groups/SearchPeopleAddPage.vue';
import SearchGroupsAddPageVue from '@/views/groups/SearchGroupsAddPage.vue';
import GroupMatchingPage from '@/views/matching/GroupMatchingPage.vue';
import UserMatchingPage from '@/views/matching/UserMatchingPage.vue';

import { routesNames } from './routesNames';

const routes: Array<RouteRecordRaw> = [

  // userID: string, useCase: string, workCases: string, sportCases: string
  {
    path: '/groupMatching/:group',
    name: routesNames.GroupMatching,
    component: GroupMatchingPage
  }, 
  {
    path: '/userMatching/:user',
    name: routesNames.UserMatching,
    component: UserMatchingPage
  }, 

  {
    path: '/addGroup',
    name: routesNames.AddGroup,
    component: AddGroup
  }, 
  {
    path: '/searchPeopleAdd',
    name: 'SearchPeopleAdd',
    component: SearchPeopleAddPage,
  },
  {
    path: '/searchGroupsAdd',
    name: 'SearchGroupsAdd',
    component: SearchGroupsAddPageVue,
  },
  {
    path: '/',
    redirect: '/createProfile'
  },
  {
    path: '/',
    component: BottomNavigation,
    children:[
      
      {
        path: '/createProfile',
        name: 'CreateProfile',
        component: CreateProfile
      }, 
      {
        path: '/groups',
        name: 'Groups',
        component: GroupsPage
      }, 
      {
        path: '/chat',
        name: 'Chat',
        component: ChatPage
      }, 
      {
        path: '/notification',
        name: 'Notification',
        component: NotificationPage
      }, 
    ]
  },

]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
