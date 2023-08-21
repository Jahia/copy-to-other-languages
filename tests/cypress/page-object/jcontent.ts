import { BasePage, Dropdown, getComponent, getComponentByRole, getElement, Table, TableRow } from '@jahia/cypress'
import { ContentEditor } from './contentEditor'

export class JContent extends BasePage {
    static visit(site: string, language: string, path: string): JContent {
        cy.visit(`/jahia/jcontent/${site}/${language}/${path}`)
        return new JContent()
    }

    editComponentByText(text: string) {
        const row = new TableRow(getElement(TableRow.defaultSelector, this.getTable()).contains(text))
        row.contextMenu().select('Edit')
        return new ContentEditor()
    }

    getTable(): Table {
        return getComponent(Table, null, (el) => expect(el).to.be.visible)
    }

    switchToMode(name: string): JContent {
        const dropdown = getComponentByRole(Dropdown, 'sel-view-mode-dropdown')
        // Wait for dropdown to be available
        dropdown.get().find('[role=dropdown]:not(.moonstone-disabled)')
        dropdown.select(name).get().should('contain', name)
        return this
    }

    switchToListMode(): JContent {
        this.switchToMode('List')
        cy.get('.moonstone-loader', { timeout: 5000 }).should('not.exist')
        return this
    }
}
