describe('Registration', () => {
    it('When user did register and then did not complete creating profile', () => {
        cy.visit('/registration')
        cy.get('#registration_email_input').type("test@test.cz")
        cy.get('#registration_password_input').type("123456")
        cy.get('#registration_button').click()
        cy.wait(3000)
        cy.visit('/login')
        cy.get('#login_email_input').type("test@test.cz")
        cy.get('#login_password_input').type("123456")
        cy.get('#login_button').click()
        cy.wait(3000)
    })
})






