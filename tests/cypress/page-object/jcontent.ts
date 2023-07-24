import {
    BasePage,
    getComponent,
    getElement,
    Table,
    TableRow,
} from '@jahia/cypress'
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
}
