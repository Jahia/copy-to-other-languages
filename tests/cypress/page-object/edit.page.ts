import { BaseComponent, BasePage, Button, getComponentByRole, getComponentBySelector } from '@jahia/cypress'

class EditPage extends BasePage {
    goTo(uuid) {
        cy.visit(`/jahia/content-editor/en/edit/${uuid}`)
        return this
    }

    save() {
        const parent = getComponentBySelector(BaseComponent, '.moonstone-header')
        getComponentByRole(Button, 'submitSave', parent).click()
        cy.get('#message-id', { timeout: 5000 }).should('be.visible')
    }
}

export const editPage = new EditPage()
