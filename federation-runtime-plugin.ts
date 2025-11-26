import type { ModuleFederationRuntimePlugin } from '@module-federation/enhanced/runtime';

export default function (): ModuleFederationRuntimePlugin {
  return {
    name: 'jahia-appshell-remote-plugin',
    async loadEntry({ remoteInfo }) {
      console.trace('loadEntry:', remoteInfo);
      if (remoteInfo.type !== 'appshell') return;
      const { pathname } = new URL(remoteInfo.entry);
      let mod: any = globalThis;
      for (const segment of pathname.split('.')) mod = mod[segment];
      console.log('appshell remote entry loaded:', remoteInfo.entry, mod);
      return mod;
    },
  };
}
