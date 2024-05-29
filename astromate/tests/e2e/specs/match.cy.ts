
describe('Registration', () => {
    it('Delete collections', () => {
        const opts = { recursive: true };
        cy.callFirestore("delete", "chat", opts);
        cy.callFirestore("delete", "groupChat", opts);
        cy.callFirestore("delete", "groups", opts);
        cy.callFirestore("delete", "users", opts);
        cy.callFirestore("delete", "notifications", opts);
    })
})

describe('Groups', () => {
    it('Create group and searched group. Check that while matching I do not see myself', () => {
        cy.visit('/login')
        // login
        cy.get('#login_email_input').type("test@test.cz")
        cy.get('#login_password_input').type("123456")
        cy.get('#login_button').click()
        cy.wait(3000)
        // create group
        cy.get('#noGroups-add-group-button').click()
        cy.get('#add-group-selection-button').click()
        cy.get('#add-group-name-input').type("test group")
        cy.get('#add-group-description-textarea').type("test description")
        cy.get('#add-group-save-button').click()
        cy.wait(3000)
        // check if group is created
        // cy.get('#groups-group-item')
        // create searched group
        cy.get('#navigate-to-create-group-button').click()
        cy.get('#add-searched-group-selection-button').click()
        cy.get('#add-searched-group-save-button').click()
        // cy.wait(3000)
        // // navigate to matching group
        // cy.get('#groups-searched-group-item-created').click()
        // cy.wait(3000)
        // // check placeholder
        // cy.get('#goup-matching-no-available-placeholder')
    })
})

describe('Matching', () => {
    it('invite user to own group', () => {
        cy.visit('/login')
        // login
        cy.get('#login_email_input').type("test2@test2.cz")
        cy.get('#login_password_input').type("123456")
        cy.get('#login_button').click()
        cy.wait(3000)
        //create own group
        cy.get('#noGroups-add-group-button').click()
        cy.get('#add-group-selection-button').click()
        cy.get('#add-group-name-input').type("test group 2")
        cy.get('#add-group-description-textarea').type("test description 2")
        cy.get('#add-group-save-button').click()
        cy.wait(3000)
        // create searched group
        cy.get('#navigate-to-create-group-button').click()
        cy.get('#add-searched-group-selection-button').click()
        cy.get('#add-searched-group-save-button').click()
        cy.wait(3000)
        // navigate to user matching screen
        cy.get('#groups-group-item').click()
        // check if 'fake' profile is shown
        cy.wait(3000)
        cy.get('#user-matching-profile-card').contains('fake')
        // send invitation
        cy.get('#user-matching-like-button').click()
        cy.wait(4000)
    })
})

describe('accept invitation', () => {
    it('in notification accept, then check placeholder', () => {
        cy.visit('/login')
        // login
        cy.get('#login_email_input').type("test@test.cz")
        cy.get('#login_password_input').type("123456")
        cy.get('#login_button').click()
        cy.wait(3000)
        // check if notification exists
        cy.get('#bottom-navigation-button-notification').click()
        cy.wait(500)
        cy.get('#notification-item').contains('fake2')
        cy.get('#notification-item-accept-button').click()
        cy.wait(700)
        cy.get('.bottom-navigation-button-discover').click()
        // check if text group 2 exist and check placeholder
        cy.contains('test group 2').click()
        cy.contains('Skupina nalezena')
        cy.wait(2000)
    })
})

describe('join group', () => {
    it('ask user for join to group', () => {
        cy.visit('/login')
        // login
        cy.get('#login_email_input').type("test2@test2.cz")
        cy.get('#login_password_input').type("123456")
        cy.get('#login_button').click()
        cy.wait(3000)
        // navigate to group matching screen
        cy.get('#groups-searched-group-item-created').click()
        cy.wait(3000)
        cy.contains('test group')
        cy.contains('fake')
        cy.get('#group-matching-like-button').click()
        cy.wait(3000)
        cy.get('#group-matching-navigate-back-button').click()
    })
})

describe('accept request', () => {
    it('accept request and check done placeholder', () => {
        cy.visit('/login')
        // login
        cy.get('#login_email_input').type("test@test.cz")
        cy.get('#login_password_input').type("123456")
        cy.get('#login_button').click()
        cy.wait(500)
        // notification
        cy.get('#bottom-navigation-button-notification').click()
        cy.wait(500)
        cy.get('#notification-item').contains('fake2')
        cy.get('#notification-item-accept-button').click()
        cy.wait(1000)
        // groups
        cy.get('.bottom-navigation-button-discover').click()
        cy.wait(3000)
        cy.contains('test group').click()
        cy.contains('Skupina naplněna')
        cy.wait(1000)
    })
})

describe('chat', () => {
    it('Make conversation. Then leave group in one chat and remove user. Then check notifications.', () => {
        cy.visit('/login')
        // login
        cy.get('#login_email_input').type("test@test.cz")
        cy.get('#login_password_input').type("123456")
        cy.get('#login_button').click()
        cy.wait(500)
        // chat
        cy.get('#bottom-navigation-button-chat').click()
        cy.wait(2000)
        // check if both chats exist
        cy.get('#group-chats-other-chat-group-item')
        cy.get('#group-chats-own-chat-group-item').click()
        // write message
        cy.get('#chat-conversation-textarea-input').type('hello, this is fake')
        cy.get('#chat-conversation-send-message-button').click()
        cy.wait(3000)
        // login for another profile
        cy.visit('/login')
        cy.get('#login_email_input').type("test2@test2.cz")
        cy.get('#login_password_input').type("123456")
        cy.get('#login_button').click()
        cy.wait(500)
        cy.get('#bottom-navigation-button-chat').click()
        // check if both chats exist
        cy.get('#group-chats-own-chat-group-item')
        cy.get('#group-chats-other-chat-group-item').click()
        // check if message exist
        cy.contains('hello, this is fake')
        cy.wait(1000)
        // leave group
        cy.get('#trigger-popover-edit-users').click()
        cy.wait(500)
        cy.get('#present-alert-delete-chat').click()
        cy.wait(500)
        cy.contains('Opustit').click()
        cy.wait(4000)
        // check that conversation does not exist
        cy.get('#group-chats-other-chat-group-item').should('not.exist');
        // check notification
        cy.visit('/login')
        cy.get('#login_email_input').type("test@test.cz")
        cy.get('#login_password_input').type("123456")
        cy.get('#login_button').click()
        cy.get('#bottom-navigation-button-notification').click()
        cy.wait(500)
        cy.contains('Uživatel fake2 opustil vaší skupinu test group')
        cy.wait(500)
        // remove user
        cy.visit('/login')
        cy.get('#login_email_input').type("test2@test2.cz")
        cy.get('#login_password_input').type("123456")
        cy.get('#login_button').click()
        cy.get('#bottom-navigation-button-chat').click()
        // go to second conversation and remove user
        cy.get('#group-chats-own-chat-group-item').click()
        cy.wait(500)
        cy.get('#trigger-popover-edit-users').click({force: true})
        cy.wait(500)
        cy.get('#chat-conversation-show-members-item').click()
        cy.wait(500)
        cy.get('#chat-page-members-modal')
        cy.get('.chat-page-member-item').last()
            .should('contain', 'fake')
        cy.get('.chat-page-member-item').last().click()
        cy.wait(500)
        cy.get('#chat-page-action-sheet')
        cy.contains('Odebrat uživatele').click({force:true})
        cy.wait(4000)
        // check notifications
        cy.visit('/login')
        cy.get('#login_email_input').type("test@test.cz")
        cy.get('#login_password_input').type("123456")
        cy.get('#login_button').click()
        cy.get('#bottom-navigation-button-notification').click()
        cy.contains('fake2 vás odebral ze skupiny test group 2')
    })
})

describe('delete', () => {
    it('Delete own and searched groups', () => {
        cy.visit('/login')
        cy.get('#login_email_input').type("test@test.cz")
        cy.get('#login_password_input').type("123456")
        cy.get('#login_button').click()
        cy.wait(3000)
        cy.get('#groups-group-item').click()
        cy.get('#popover-edit-group').click()
        cy.get('#present-alert-delete-group').click()
        cy.contains('Smazat').click()
        cy.wait(3000)
        cy.get('#groups-searched-group-item-created').click()
        cy.get('#popover-edit-searched-group').click()
        cy.get('#present-alert-delete-searched-group').click()
        cy.contains('Smazat').click()
        cy.wait(3000)
        cy.get('#noGroups-add-group-button')
    })
})



