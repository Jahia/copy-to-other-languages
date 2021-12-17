import React, {useContext} from 'react';
import PropTypes from 'prop-types';
import {useTranslation} from 'react-i18next';
import {ComponentRendererContext} from '@jahia/ui-extender';
import {CopyToAllLanguages} from './CopyToAllLanguages';

export const CopyToAllLanguagesActionComponent = ({
    formik,
    editorContext,
    field,
    render: Render,
    loading: Loading,
    ...others
}) => {
    const componentRenderer = useContext(ComponentRendererContext);

    // Load namespace
    useTranslation('copy-to-all-languages');

    if (!field.i18n || editorContext.mode === 'create' || editorContext.siteInfo.languages.length === 1 || !formik.values[field.name]) {
        return false;
    }

    const enabled = !formik.dirty;

    return (
        <Render
            {...others}
            isVisible
            enabled={enabled}
            onClick={() => {
                componentRenderer.render('copyToAllLanguages', CopyToAllLanguages, {
                    path: editorContext.nodeData.path,
                    field: field,
                    language: editorContext.lang,
                    siteLanguages: editorContext.siteInfo.languages,
                    isOpen: true,
                    onClose: () => {
                        componentRenderer.setProperties('copyToAllLanguages', {isOpen: false});
                    },
                    onExited: () => {
                        componentRenderer.destroy('copyToAllLanguages');
                    }
                });
            }}
        />
    );
};

CopyToAllLanguagesActionComponent.propTypes = {
    formik: PropTypes.object.isRequired,

    editorContext: PropTypes.object.isRequired,

    field: PropTypes.object.isRequired,

    render: PropTypes.func.isRequired,

    loading: PropTypes.func
};
