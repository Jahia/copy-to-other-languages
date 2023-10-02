import {BasePage, Button, getComponentByRole} from '@jahia/cypress';

export class ContentEditor extends BasePage {
    save() {
        getComponentByRole(Button, 'submitSave').click();
        cy.get('#dialog-errorBeforeSave', {timeout: 1000}).should('not.exist');
        cy.get('[role="alertdialog"]').should('be.visible').should('contain', 'Content successfully saved');
    }

    switchToAdvancedMode() {
        getComponentByRole(Button, 'advancedMode').should('be.visible').click();
    }
}
