import {
    addNode,
    BaseComponent,
    Button,
    createSite,
    createUser,
    deleteSite,
    deleteUser,
    disableModule,
    enableModule,
    getComponent,
    getComponentByRole,
    grantRoles,
    Menu
} from '@jahia/cypress';
import {threeDotsButton} from '../page-object/threeDots.button';
import {JContent} from '../page-object/jcontent';
import {ContentEditor} from '../page-object/contentEditor';
import {SmallTextField} from '../page-object/fields/smallTextField';
import {setLanguages, lockNode, unlockNode} from '../fixtures/utils';

describe('Test copy to other languages', () => {
    const siteKey = 'copyToOtherSite';

    function checkValue(value: string, field: any) {
        if (value) {
            expect(field).not.to.be.null;
            expect(field.value).to.equal(value);
        } else {
            expect(field).to.be.null;
        }
    }

    function checkValues(uuid: string, en: string, fr: string, de: string) {
        cy.apollo({
            queryFile: 'graphql/jcr/checkPropertyValues.graphql',
            variables: {uuid}
        }).should(({data}) => {
            checkValue(en, data.jcr.nodeById.body_en);
            checkValue(fr, data.jcr.nodeById.body_fr);
            checkValue(de, data.jcr.nodeById.body_de);
        });
    }

    before(function () {
        deleteSite(siteKey);
        createSite(siteKey);

        createUser('myUser', 'password', [{name: 'preferredLanguage', value: 'en'}]);
        grantRoles(`/sites/${siteKey}`, ['editor'], 'myUser', 'USER');

        // Need to wait explicitly for the bundle listener to process event
        const fileName = 'modules/ctol-definitions-1.0.0-SNAPSHOT.jar';
        // eslint-disable-next-line
        cy.runProvisioningScript({ fileContent: '- installAndStartBundle: "' + fileName + '"', type: 'application/yaml' },
            [{fileName: fileName, type: 'application/java-archive'}]
        )
            .then(res => {
                expect(res.length).to.equal(1);
                expect(res[0].start[0].message).to.equal('Operation successful');
            })
            .wait(3000);

        addNode({
            parentPathOrId: `/sites/${siteKey}/home`,
            name: 'test',
            primaryNodeType: 'jnt:mainContent',
            properties: [
                {name: 'body', language: 'en', value: 'test'},
                {name: 'align', value: 'left'}
            ]
        }).then(res => res.data.jcr.addNode.uuid).as('uuid');
    });

    beforeEach(() => {
        enableModule('ctol-definitions', siteKey);
        enableModule('copy-to-other-languages', siteKey);
        cy.loginAndStoreSession();
    });

    after(function () {
        deleteUser('myUser');
        deleteSite(siteKey);
    });

    afterEach(() => {
        cy.logout();
    });

    it('Should not have copyToOtherLanguages if site has a single language', function () {
        const jcontent = JContent.visit(siteKey, 'en', 'pages/home').switchToListMode();
        jcontent.editComponentByText('test').switchToAdvancedMode();
        threeDotsButton.forField('jnt:mainContent_body', 'not.exist');
    });

    it('Should not have copyToOtherLanguages if module is not deployed', function () {
        setLanguages(siteKey, ['en', 'fr', 'de']);
        disableModule('copy-to-other-languages', siteKey);

        const jcontent = JContent.visit(siteKey, 'en', 'pages/home').switchToListMode();
        jcontent.editComponentByText('test').switchToAdvancedMode();
        threeDotsButton.forField('jnt:mainContent_body', 'not.exist');
    });

    it('Should not have copyToOtherLanguages if not i18n', function () {
        setLanguages(siteKey, ['en', 'fr', 'de']);

        const jcontent = JContent.visit(siteKey, 'en', 'pages/home').switchToListMode();
        jcontent.editComponentByText('test');
        threeDotsButton.forField('jnt:mainContent_align', 'not.exist');
    });

    it('Should not have copyToOtherLanguages if node is locked', function () {
        setLanguages(siteKey, ['en', 'fr', 'de']);
        lockNode(this.uuid);

        cy.login('myUser', 'password');
        const jcontent = JContent.visit(siteKey, 'en', 'pages/home').switchToListMode();
        jcontent.editComponentByText('test');
        threeDotsButton.forField('jnt:mainContent_body').click();
        getComponent(Menu).get()
            .find('.moonstone-menuItem[data-sel-role="copyToOtherLanguages"]')
            .should('have.class', 'moonstone-disabled');
    });

    it('Should have copyToOtherLanguages if node is unlocked', function () {
        setLanguages(siteKey, ['en', 'fr', 'de']);
        unlockNode(this.uuid);

        const jcontent = JContent.visit(siteKey, 'en', 'pages/home').switchToListMode();
        jcontent.editComponentByText('test');
        threeDotsButton.forField('jnt:mainContent_body').click();
        getComponent(Menu).get()
            .find('.moonstone-menuItem[data-sel-role="copyToOtherLanguages"]')
            .should('not.have.class', 'moonstone-disabled');
    });

    it('Should open and close dialog', function () {
        setLanguages(siteKey, ['en', 'fr', 'de']);

        const jcontent = JContent.visit(siteKey, 'en', 'pages/home').switchToListMode();
        jcontent.editComponentByText('test');
        threeDotsButton.forField('jnt:mainContent_body').click();
        getComponent(Menu).selectByRole('copyToOtherLanguages');
        const dialog = getComponentByRole(BaseComponent, 'copy-language-dialog');
        getComponentByRole(Button, 'cancel-button', dialog).click();
    });

    it('Should select/unselect all', function () {
        setLanguages(siteKey, ['en', 'fr', 'de']);

        const jcontent = JContent.visit(siteKey, 'en', 'pages/home').switchToListMode();
        jcontent.editComponentByText('test');
        threeDotsButton.forField('jnt:mainContent_body').click();
        getComponent(Menu).selectByRole('copyToOtherLanguages');

        const dialog = getComponentByRole(BaseComponent, 'copy-language-dialog');
        const checkboxes = getComponentByRole(BaseComponent, 'copy-language-button', dialog);
        const addAll = getComponentByRole(Button, 'add-all-button', dialog);
        const removeAll = getComponentByRole(Button, 'remove-all-button', dialog);

        checkboxes.should(e => {
            expect(e).have.lengthOf(2);
            expect(e).to.be.checked;
        });

        addAll.should('be.disabled');
        removeAll.should('be.enabled');
        removeAll.click();
        addAll.should('be.enabled');
        removeAll.should('be.disabled');

        checkboxes.should(e => {
            expect(e).have.lengthOf(2);
            expect(e).not.to.be.checked;
        });

        addAll.click();
        addAll.get().should('be.disabled', dialog);
        removeAll.get().should('be.enabled', dialog);

        checkboxes.should(e => {
            expect(e).have.lengthOf(2);
            expect(e).to.be.checked;
        });
    });

    it('Should filter', function () {
        setLanguages(siteKey, ['en', 'fr', 'de']);

        const jcontent = JContent.visit(siteKey, 'en', 'pages/home').switchToListMode();
        jcontent.editComponentByText('test');
        threeDotsButton.forField('jnt:mainContent_body').click();

        getComponent(Menu, null, e => {
            expect(e).to.be.visible;
        }).selectByRole('copyToOtherLanguages');

        const dialog = getComponentByRole(BaseComponent, 'copy-language-dialog');
        const checkboxes = getComponentByRole(BaseComponent, 'copy-language-button');
        const filter = getComponentByRole(BaseComponent, 'language-filter', dialog);

        // Cy.get('[data-sel-role="copy-language-button"]').should('have.length',2)
        checkboxes.should('have.length', 2);
        filter.get().type('fr');
        checkboxes.should('have.length', 1);
        filter.get().clear();
        checkboxes.should('have.length', 2);
        filter.get().type('xx');
        checkboxes.should('have.length', 0);
    });

    it('Should not copy to other languages without save', function () {
        setLanguages(siteKey, ['en', 'fr', 'de']);
        checkValues(this.uuid, 'test', null, null);

        const jcontent = JContent.visit(siteKey, 'en', 'pages/home').switchToListMode();
        jcontent.editComponentByText('test');
        threeDotsButton.forField('jnt:mainContent_body').click();
        getComponent(Menu).selectByRole('copyToOtherLanguages');
        const dialog = getComponentByRole(BaseComponent, 'copy-language-dialog');

        // Click on copy to language without saving; make sure values are still the same
        getComponentByRole(Button, 'copy-button', dialog).click();
        checkValues(this.uuid, 'test', null, null);
    });

    it('Should copy to other languages after save', function () {
        setLanguages(siteKey, ['en', 'fr', 'de']);
        checkValues(this.uuid, 'test', null, null);

        const jcontent = JContent.visit(siteKey, 'en', 'pages/home').switchToListMode();
        const contentEditor = jcontent.editComponentByText('test');
        threeDotsButton.forField('jnt:mainContent_body').click();
        getComponent(Menu).selectByRole('copyToOtherLanguages');
        const dialog = getComponentByRole(BaseComponent, 'copy-language-dialog');
        getComponentByRole(Button, 'copy-button', dialog).click();
        contentEditor.save();
        checkValues(this.uuid, 'test', 'test', 'test');
    });

    it('Should not save when mandatory fields have not been filled', function () {
        setLanguages(siteKey, ['en', 'fr', 'de']);

        JContent.visit(siteKey, 'en', 'content-folders/contents');
        const jcontent = new JContent();
        jcontent.selectAccordion('content-folders');
        jcontent
            .getCreateContent()
            .open()
            .getContentTypeSelector()
            .selectContentType('Content:Basic')
            .selectContentType('testCopy')
            .create();

        const contentEditor = ContentEditor.getContentEditor();
        let field = contentEditor.getField(SmallTextField, 'jnt:testCopy_text1', false);
        field.get().type('Test value');
        field = contentEditor.getField(SmallTextField, 'jnt:testCopy_text2', false);
        field.get().type('Test value');
        threeDotsButton.forField('jnt:testCopy_text1').click();
        getComponent(Menu).selectByRole('copyToOtherLanguages');
        const dialog = getComponentByRole(BaseComponent, 'copy-language-dialog');
        getComponentByRole(Button, 'copy-button', dialog).click();
        contentEditor.saveUnchecked();

        cy.get('p').contains('Invalid form').should('exist');
    });
});
