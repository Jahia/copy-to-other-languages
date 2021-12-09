import {registry} from '@jahia/ui-extender';
import register from './CopyToAllLanguages/register';

export default function () {
    registry.add('callback', 'copyToAllLanguages', {
        targets: ['jahiaApp-init:50'],
        callback: register
    });
}
