import React, {useContext} from 'react';
import PropTypes from 'prop-types';
import {useTranslation} from 'react-i18next';
import {ComponentRendererContext} from '@jahia/ui-extender';
import {CopyToOtherLanguages} from './CopyToOtherLanguages';
import {useContentEditorContext} from '@jahia/jcontent';
import {useNodeChecks} from '@jahia/data-helper';
import {useFormikContext} from 'formik';

export const CopyAllToOtherLanguagesActionComponent = ({
    render: Render,
    loading: Loading,
    ...others
}) => {
    const editorContext = useContentEditorContext();
    const formikContext = useFormikContext();
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

    if (!res.checksResult || editorContext.siteInfo.languages.length <= 1) {
        return false;
    }

    const enabled = !editorContext.nodeData?.lockedAndCannotBeEdited;

    return (
        <Render
            {...others}
            isVisible
            enabled={enabled}
            onClick={() => {
                componentRenderer.render('copyAllToOtherLanguages', CopyToOtherLanguages, {
                    path: editorContext.nodeData.path,
                    language: editorContext.lang,
                    siteLanguages: editorContext.siteInfo.languages,
                    isOpen: true,
                    isNew: editorContext?.nodeData?.newName !== undefined,
                    setI18nContext: editorContext.setI18nContext,
                    fields: formikContext.values,
                    onClose: () => {
                        componentRenderer.setProperties('copyAllToOtherLanguages', {isOpen: false});
                    },
                    onExited: () => {
                        componentRenderer.destroy('copyAllToOtherLanguages');
                    }
                });
            }}
        />
    );
};

CopyAllToOtherLanguagesActionComponent.propTypes = {
    formik: PropTypes.object.isRequired,
    editorContext: PropTypes.object.isRequired,
    render: PropTypes.func.isRequired,
    loading: PropTypes.func
};
