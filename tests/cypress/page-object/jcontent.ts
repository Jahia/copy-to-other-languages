import {BasePage, Dropdown, getComponent, getComponentByRole, getElement, Table, TableRow, Accordion, SecondaryNav} from '@jahia/cypress';
import {ContentEditor} from './contentEditor';
import {CreateContent} from './createContent';

export class JContent extends BasePage {

    secondaryNav: SecondaryNav;
    accordion: Accordion;

    static visit(site: string, language: string, path: string): JContent {
        cy.visit(`/jahia/jcontent/${site}/${language}/${path}`);
        return new JContent();
    }

    editComponentByText(text: string) {
        const row = new TableRow(getElement(TableRow.defaultSelector, this.getTable()).contains(text));
        row.contextMenu().select('Edit');
        return new ContentEditor();
    }

    getTable(): Table {
        return getComponent(Table, null, el => expect(el).to.be.visible);
    }

    switchToMode(name: string): JContent {
        const dropdown = getComponentByRole(Dropdown, 'sel-view-mode-dropdown');
        // Wait for dropdown to be available
        dropdown.get().find('[role=dropdown]:not(.moonstone-disabled)');
        dropdown.select(name).get().should('contain', name);
        return this;
    }

    switchToListMode(): JContent {
        this.switchToMode('List');
        cy.get('.moonstone-loader', {timeout: 5000}).should('not.exist');
        return this;
    }

    selectAccordion(accordion: string): JContent {
        this.getSecondaryNavAccordion().click(accordion);
        return this;
    }

    getSecondaryNavAccordion(): Accordion {
        if (!this.accordion) {
            this.accordion = getComponent(Accordion, this.getSecondaryNav());
        }

        return this.accordion;
    }

    getSecondaryNav(): SecondaryNav {
        if (!this.secondaryNav) {
            this.secondaryNav = getComponent(SecondaryNav);
        }

        return this.secondaryNav;
    }

    getCreateContent(): CreateContent {
        return new CreateContent(this);
    }
}
