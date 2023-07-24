import React, {useContext} from 'react';
import PropTypes from 'prop-types';
import {useTranslation} from 'react-i18next';
import {ComponentRendererContext} from '@jahia/ui-extender';
import {CopyToOtherLanguages} from './CopyToOtherLanguages';
import {useFormikContext} from 'formik';
import {useContentEditorContext} from '@jahia/content-editor';

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

    if (!field.i18n || editorContext.siteInfo.languages.length <= 1) {
        return false;
    }

    const enabled = Boolean(formik.values[field.name]);

    return (
        <Render
            {...others}
            isVisible
            enabled={enabled}
            onClick={() => {
                componentRenderer.render('copyToOtherLanguages', CopyToOtherLanguages, {
                    path: editorContext.nodeData.path,
                    field: field,
                    fieldValue: formik.values[field.name],
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
