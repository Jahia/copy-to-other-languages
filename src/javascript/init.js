import {registry} from '@jahia/ui-extender';
import register from './CopyToOtherLanguages/register';

export default function () {
    registry.add('callback', 'copyToOtherLanguages', {
        targets: ['jahiaApp-init:50'],
        callback: register
    });
}
