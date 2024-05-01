import {reactive, ref} from "vue";

export const globalNotifications = reactive({
    isNotificationEmpty: false
})

export const isNotificationEmpty = ref(false)