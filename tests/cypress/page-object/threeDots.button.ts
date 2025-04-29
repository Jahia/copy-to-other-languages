import { BaseComponent, Button, getComponentByAttr, getComponentByRole } from '@jahia/cypress'

class ThreeDotsButton {
    static roleName = '3dotsMenuAction'

    forField(fieldName, assertion?) {
        const field = getComponentByAttr(BaseComponent, 'data-sel-content-editor-field', fieldName)
        return getComponentByRole(Button, ThreeDotsButton.roleName, field, assertion)
    }

    forForm() {
        const form = getComponentByAttr(BaseComponent, 'role', 'dialog');
        return getComponentByRole(Button, ThreeDotsButton.roleName, form);
    }
}

export const threeDotsButton = new ThreeDotsButton()
