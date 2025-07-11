import React from 'react';
import {registry} from '@jahia/ui-extender';
import {Copy, Lock} from '@jahia/moonstone';
import {CopyToOtherLanguagesActionComponent} from './CopyToOtherLanguagesActionComponent';
import {CopyAllToOtherLanguagesActionComponent} from './CopyAllToOtherLanguagesActionComponent';

export default () => {
    registry.add('action', 'copyToOtherLanguages', {
        buttonIcon: <Lock/>,
        buttonLabel: 'copy-to-other-languages:label.action',
        targets: ['content-editor/field/3dots:5.5'],
        component: CopyToOtherLanguagesActionComponent
    });
    registry.add('action', 'copyAllToOtherLanguages', {
        buttonIcon: <Copy/>,
        buttonLabel: 'copy-to-other-languages:label.actionAllProperties',
        targets: ['content-editor/header/3dots:5.5'],
        component: CopyAllToOtherLanguagesActionComponent
    });
};
