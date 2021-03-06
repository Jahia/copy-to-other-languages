import { BaseComponent, Button, getComponent, getComponentByRole, Menu } from '@jahia/cypress'
import { editPage } from '../page-object/edit.page'
import { threeDotsButton } from '../page-object/threeDots.button'

function setLanguages(values: string[]) {
    cy.apollo({
        mutationFile: 'graphql/jcr/mutateNode.graphql',
        variables: {
            pathOrId: '/sites/copyToOtherSite',
            properties: [{ name: 'j:languages', values: values }],
        },
    })
}

function checkValue(value: string, field: any) {
    if (value) {
        expect(field).not.to.be.null
        expect(field.value).to.equal(value)
    } else {
        expect(field).to.be.null
    }
}

function checkValues(uuid: string, en: string, fr: string, de: string) {
    cy.apollo({
        queryFile: 'graphql/jcr/checkPropertyValues.graphql',
        variables: {
            uuid: uuid,
        },
    }).should(({ data }) => {
        checkValue(en, data.jcr.nodeById.body_en)
        checkValue(fr, data.jcr.nodeById.body_fr)
        checkValue(de, data.jcr.nodeById.body_de)
    })
}

describe('Test copy to other languages', () => {
    before(function () {
        cy.executeGroovy('groovy/admin/deleteSite.groovy', { SITEKEY: 'copyToOtherSite' })
        cy.executeGroovy('groovy/admin/createSite.groovy', {
            SITEKEY: 'copyToOtherSite',
            TEMPLATES_SET: 'dx-base-demo-templates',
        })

        cy.apollo({
            mutationFile: 'graphql/jcr/addNode.graphql',
            variables: {
                parentPathOrId: '/sites/copyToOtherSite/home',
                nodeName: 'test',
                nodeType: 'jnt:mainContent',
                properties: [
                    { name: 'body', language: 'en', value: 'test' },
                    { name: 'align', value: 'left' },
                ],
            },
        })
            .then(({ data }) => {
                return data.jcr.addNode.uuid
            })
            .as('uuid')

        cy.login() // edit in chief
    })

    after(function () {
        cy.logout()
        cy.visit('/')
        cy.executeGroovy('groovy/admin/deleteSite.groovy', { SITEKEY: 'copyToOtherSite' })
    })

    beforeEach(() => {
        Cypress.Cookies.preserveOnce('JSESSIONID')
    })

    it('Should not have copyToOtherLanguages if site has a single language', function () {
        editPage.goTo(this.uuid)
        threeDotsButton.forField('jnt:mainContent_body', (s) => expect(s).to.not.exist).get()
    })

    it('Should not have copyToOtherLanguages if not i18n', function () {
        setLanguages(['en', 'fr', 'de'])

        editPage.goTo(this.uuid)
        threeDotsButton.forField('jnt:mainContent_align', (s) => expect(s).to.not.exist).get()
    })

    it('Should open and close dialog', function () {
        setLanguages(['en', 'fr', 'de'])

        cy.visit(`/jahia/content-editor/en/edit/${this.uuid}`)
        threeDotsButton.forField('jnt:mainContent_body').click()
        getComponent(Menu).selectByRole('copyToOtherLanguages')
        const dialog = getComponentByRole(BaseComponent, 'copy-language-dialog')
        getComponentByRole(Button, 'cancel-button', dialog).click()
    })

    it('Should select/unselect all', function () {
        setLanguages(['en', 'fr', 'de'])

        editPage.goTo(this.uuid)
        threeDotsButton.forField('jnt:mainContent_body').click()
        getComponent(Menu).selectByRole('copyToOtherLanguages')

        const dialog = getComponentByRole(BaseComponent, 'copy-language-dialog')
        const checkboxes = getComponentByRole(BaseComponent, 'copy-language-button', dialog)
        const addAll = getComponentByRole(Button, 'add-all-button', dialog)
        const removeAll = getComponentByRole(Button, 'remove-all-button', dialog)

        checkboxes.should((e) => {
            expect(e).have.lengthOf(2)
            expect(e).to.be.checked
        })

        addAll.should('be.disabled')
        removeAll.should('be.enabled')
        removeAll.click()
        addAll.should('be.enabled')
        removeAll.should('be.disabled')

        checkboxes.should((e) => {
            expect(e).have.lengthOf(2)
            expect(e).not.to.be.checked
        })

        addAll.click()
        addAll.get().should('be.disabled', dialog)
        removeAll.get().should('be.enabled', dialog)

        checkboxes.should((e) => {
            expect(e).have.lengthOf(2)
            expect(e).to.be.checked
        })
    })

    it('Should filter', function () {
        setLanguages(['en', 'fr', 'de'])

        editPage.goTo(this.uuid)
        threeDotsButton.forField('jnt:mainContent_body').click()

        getComponent(Menu, null, (e) => {
            expect(e).to.be.visible
        }).selectByRole('copyToOtherLanguages')

        const dialog = getComponentByRole(BaseComponent, 'copy-language-dialog')
        const checkboxes = getComponentByRole(BaseComponent, 'copy-language-button')
        const filter = getComponentByRole(BaseComponent, 'language-filter', dialog)

        // cy.get('[data-sel-role="copy-language-button"]').should('have.length',2)
        checkboxes.should('have.length', 2)
        filter.get().type('fr')
        checkboxes.should('have.length', 1)
        filter.get().clear()
        checkboxes.should('have.length', 2)
        filter.get().type('xx')
        checkboxes.should('have.length', 0)
    })

    it('Should not copy to other languages without save', function () {
        setLanguages(['en', 'fr', 'de'])
        checkValues(this.uuid, 'test', null, null)

        editPage.goTo(this.uuid)
        threeDotsButton.forField('jnt:mainContent_body').click()
        getComponent(Menu).selectByRole('copyToOtherLanguages')
        const dialog = getComponentByRole(BaseComponent, 'copy-language-dialog')

        // click on copy to language without saving; make sure values are still the same
        getComponentByRole(Button, 'copy-button', dialog).click()
        checkValues(this.uuid, 'test', null, null)
    })

    it('Should copy to other languages after save', function () {
        setLanguages(['en', 'fr', 'de'])
        checkValues(this.uuid, 'test', null, null)

        editPage.goTo(this.uuid)
        threeDotsButton.forField('jnt:mainContent_body').click()
        getComponent(Menu).selectByRole('copyToOtherLanguages')
        const dialog = getComponentByRole(BaseComponent, 'copy-language-dialog')
        getComponentByRole(Button, 'copy-button', dialog).click()
        editPage.save()
        checkValues(this.uuid, 'test', 'test', 'test')
    })
})
