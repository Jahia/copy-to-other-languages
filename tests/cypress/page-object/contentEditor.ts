import {
    BasePage,
    Button,
    ComponentType,
    getComponentByAttr,
    getComponentByRole,
    getComponentBySelector
} from '@jahia/cypress';
import {Field} from './fields/field';

export class ContentEditor extends BasePage {
    static defaultSelector = '[aria-labelledby="dialog-content-editor"]';

    static getContentEditor() : ContentEditor {
        return getComponentBySelector(ContentEditor, ContentEditor.defaultSelector);
    }

    save() {
        getComponentByRole(Button, 'submitSave').click();
        cy.get('#dialog-errorBeforeSave', {timeout: 1000}).should('not.exist');
        cy.get('[role="alertdialog"]').should('be.visible').should('contain', 'Content successfully saved');
    }

    switchToAdvancedMode() {
        getComponentByRole(Button, 'advancedMode').should('be.visible').click();
    }

    getField<FieldType extends Field>(FieldComponent: ComponentType<FieldType>, fieldName: string,
        multiple?: boolean): FieldType {
        const r = getComponentByAttr(FieldComponent, 'data-sel-content-editor-field', fieldName);
        r.fieldName = fieldName;
        r.multiple = multiple;
        return r;
    }

    saveUnchecked() {
        getComponentByRole(Button, 'createButton').click();
    }
}
