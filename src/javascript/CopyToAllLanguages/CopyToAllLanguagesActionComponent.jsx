import React, {useContext} from 'react';
import PropTypes from 'prop-types';
import {useTranslation} from 'react-i18next';
import {ComponentRendererContext} from '@jahia/ui-extender';
import {CopyToAllLanguages} from './CopyToAllLanguages';

export const CopyToAllLanguagesActionComponent = ({formik, editorContext, field, render: Render, loading: Loading, ...others}) => {
    const componentRenderer = useContext(ComponentRendererContext);

    if (!field.i18n || editorContext.mode === "create") {
        return false;
    }

    const enabled = !formik.dirty

    // Load namespace
    useTranslation('copy-to-all-languages');

    return (
        <Render
            {...others}
            isVisible
            enabled={enabled}
            onClick={() => {
                componentRenderer.render('copyToAllLanguages', CopyToAllLanguages, {
                    path : editorContext.nodeData.path,
                        field: field,
                        isOpen: true,
                        onClose: () => {
                            componentRenderer.setProperties('copyToAllLanguages', {isOpen: false});
                        },
                        onExited: () => {
                            componentRenderer.destroy('copyToAllLanguages');
                        }
                    }
                );
            }}
        />
    );
};

CopyToAllLanguagesActionComponent.propTypes = {
    path: PropTypes.string,

    render: PropTypes.func.isRequired,

    loading: PropTypes.func
};
