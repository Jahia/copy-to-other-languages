import React from 'react';
import {registry} from '@jahia/ui-extender';
import {Lock} from '@jahia/moonstone';
import {CopyToAllLanguagesActionComponent} from './CopyToAllLanguagesActionComponent';

export default () => {
    registry.add('action', 'copyToAllLanguages', {
        buttonIcon: <Lock/>,
        buttonLabel: 'copy-to-all-languages:label.action',
        targets: ['content-editor/field/3dots:5.5'],
        component: CopyToAllLanguagesActionComponent
    });
};
