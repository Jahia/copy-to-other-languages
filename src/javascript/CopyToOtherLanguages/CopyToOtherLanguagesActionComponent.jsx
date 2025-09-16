import React, {useContext} from 'react';
import PropTypes from 'prop-types';
import {useTranslation} from 'react-i18next';
import {ComponentRendererContext} from '@jahia/ui-extender';
import {CopyToOtherLanguages} from './CopyToOtherLanguages';
import {useFormikContext} from 'formik';
import {useContentEditorContext} from '@jahia/content-editor';
import {useNodeChecks} from '@jahia/data-helper';

export const CopyToOtherLanguagesActionComponent = ({
    field,
    render: Render,
    loading: Loading,
    ...others
}) => {
    const formik = useFormikContext();
    const editorContext = useContentEditorContext();
    const componentRenderer = useContext(ComponentRendererContext);

    // Load namespace
    useTranslation('copy-to-other-languages');

    const res = useNodeChecks(
        {path: editorContext.nodeData.path},
        {
            requireModuleInstalledOnSite: ['copy-to-other-languages']
        }
    );

    if (res.loading) {
        return (Loading && <Loading {...others}/>) || false;
    }

    const enabled = !editorContext.nodeData?.lockedAndCannotBeEdited;

    const fieldValue = formik.values[field.name] ?? '';

    return (
        <Render
            {...others}
            isVisible={field.i18n && editorContext.siteInfo.languages.length > 1 && res.checksResult}
            enabled={enabled}
            onClick={() => {
                componentRenderer.render('copyToOtherLanguages', CopyToOtherLanguages, {
                    path: editorContext.nodeData.path,
                    field: field,
                    fieldValue: fieldValue,
                    language: editorContext.lang,
                    siteLanguages: editorContext.siteInfo.languages,
                    isOpen: true,
                    setI18nContext: editorContext.setI18nContext,
                    onClose: () => {
                        componentRenderer.setProperties('copyToOtherLanguages', {isOpen: false});
                    },
                    onExited: () => {
                        componentRenderer.destroy('copyToOtherLanguages');
                    }
                });
            }}
        />
    );
};

CopyToOtherLanguagesActionComponent.propTypes = {
    formik: PropTypes.object.isRequired,

    editorContext: PropTypes.object.isRequired,

    field: PropTypes.object.isRequired,

    render: PropTypes.func.isRequired,

    loading: PropTypes.func
};
