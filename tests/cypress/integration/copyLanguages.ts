import {
    BaseComponent,
    Button,
    getComponent,
    getComponentByAttr,
    getComponentByRole,
    getComponentBySelector,
    Menu
} from '@jahia/cypress'

function setLanguages(values: string[]) {
    cy.apollo({
        mutationFile: 'graphql/jcr/mutateNode.graphql',
        variables: {
            pathOrId: "/sites/copyToOtherSite",
            properties: [
                {name: "j:languages", values: values}
            ]
        }
    })
}

describe('Test copy to other languages', () => {
    before(function () {
        cy.executeGroovy('groovy/admin/deleteSite.groovy', {SITEKEY: 'copyToOtherSite'})
        cy.executeGroovy('groovy/admin/createSite.groovy', {SITEKEY: 'copyToOtherSite', TEMPLATES_SET: "dx-base-demo-templates"})

        cy.apollo({
            mutationFile: 'graphql/jcr/addNode.graphql',
            variables: {
                parentPathOrId: "/sites/copyToOtherSite/home", nodeName: "test", nodeType: "jnt:mainContent",
                properties: [
                    {name: "body", language: "en", value: "test"},
                    {name: "align", value: "left"}
                ]
            }
        }).then(({data}) => {
            return data.jcr.addNode.uuid
        }).as('uuid')

        cy.login() // edit in chief
        cy.log('before end')
    })

    after(function () {
        cy.log('after')
        cy.logout()
        cy.visit('/')
        cy.executeGroovy('groovy/admin/deleteSite.groovy', {SITEKEY: 'copyToOtherSite'})
        cy.log('after end')
    })

    beforeEach(() => {
        Cypress.Cookies.preserveOnce('JSESSIONID')
    })

    it('Should not have copyToOtherLanguages if site has a single language', function () {
        cy.visit(`/jahia/content-editor/en/edit/${this.uuid}`)

        const field = getComponentByAttr(BaseComponent, "data-sel-content-editor-field", "jnt:mainContent_body")
        const button = getComponentByRole(Button, "content-editor/field/3dots", field, s => { expect(s).to.not.exist });
        button.get()
    })

    it('Should not have copyToOtherLanguages if not i18n', function () {
        setLanguages(["en", "fr", "de"]);

        cy.visit(`/jahia/content-editor/en/edit/${this.uuid}`)

        const field = getComponentByAttr(BaseComponent, "data-sel-content-editor-field", "jnt:mainContent_align")
        const button = getComponentByRole(Button, "content-editor/field/3dots", field, s => { expect(s).to.not.exist });
        button.get()
    })

    it('Should open and close dialog', function () {
        setLanguages(["en", "fr", "de"]);

        cy.visit(`/jahia/content-editor/en/edit/${this.uuid}`)

        const field = getComponentByAttr(BaseComponent, "data-sel-content-editor-field", "jnt:mainContent_body")
        const button = getComponentByRole(Button, "content-editor/field/3dots", field);
        button.click()
        cy.wait(500)
        getComponent(Menu).selectByRole("copyToOtherLanguages");
        const dialog = getComponentByRole(BaseComponent, "copy-language-dialog")
        getComponentByRole(Button,  'cancel-button', dialog).click();
    })

    it('Should select/unselect all', function () {
        setLanguages(["en", "fr", "de"]);

        cy.visit(`/jahia/content-editor/en/edit/${this.uuid}`)

        const field = getComponentByAttr(BaseComponent, "data-sel-content-editor-field", "jnt:mainContent_body")
        const button = getComponentByRole(Button, "content-editor/field/3dots", field);
        button.click()
        cy.wait(500)
        getComponent(Menu).selectByRole("copyToOtherLanguages");

        const dialog = getComponentByRole(BaseComponent, "copy-language-dialog")
        const checkboxes = getComponentByRole(BaseComponent, "copy-language-button", dialog);
        const addAll = getComponentByRole(Button, 'add-all-button', dialog);
        const removeAll = getComponentByRole(Button, 'remove-all-button', dialog);

        checkboxes.should(e => {
            expect(e).have.lengthOf(2)
            expect(e).to.be.checked
        })

        addAll.should('be.disabled')
        removeAll.should('be.enabled')
        removeAll.click()
        addAll.should('be.enabled')
        removeAll.should('be.disabled')

        checkboxes.should(e => {
            expect(e).have.lengthOf(2)
            expect(e).not.to.be.checked
        })

        addAll.click()
        addAll.get().should('be.disabled', dialog)
        removeAll.get().should('be.enabled', dialog)

        checkboxes.should(e => {
            expect(e).have.lengthOf(2)
            expect(e).to.be.checked
        })

    })

    it('Should filter', function () {
        setLanguages(["en", "fr", "de"]);

        cy.visit(`/jahia/content-editor/en/edit/${this.uuid}`)

        const field = getComponentByAttr(BaseComponent, "data-sel-content-editor-field", "jnt:mainContent_body")
        const button = getComponentByRole(Button, "content-editor/field/3dots", field);
        button.click()
        // cy.wait(500)
        getComponent(Menu,null, (e) => {expect(e).to.be.visible}).selectByRole("copyToOtherLanguages");

        const dialog = getComponentByRole(BaseComponent, "copy-language-dialog")
        const checkboxes = getComponentByRole(BaseComponent, "copy-language-button");
        const filter = getComponentByRole(BaseComponent, 'language-filter', dialog);

        // cy.get('[data-sel-role="copy-language-button"]').should('have.length',2)
        checkboxes.should('have.length',2)
        filter.get().type("fr")
        checkboxes.should('have.length',1)
        filter.get().clear()
        checkboxes.should('have.length',2)
        filter.get().type("xx")
        checkboxes.should('have.length',0)
    })

})