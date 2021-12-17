import React from 'react';
import {registry} from '@jahia/ui-extender';
import {Lock} from '@jahia/moonstone';
import {CopyToOtherLanguagesActionComponent} from './CopyToOtherLanguagesActionComponent';

export default () => {
    registry.add('action', 'copyToOtherLanguages', {
        buttonIcon: <Lock/>,
        buttonLabel: 'copy-to-other-languages:label.action',
        targets: ['content-editor/field/3dots:5.5'],
        component: CopyToOtherLanguagesActionComponent
    });
};
