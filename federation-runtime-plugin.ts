import type { ModuleFederationRuntimePlugin } from '@module-federation/enhanced/runtime';

export default function (): ModuleFederationRuntimePlugin {
  return {
    name: 'window-remote-plugin',
    async loadEntry({ remoteInfo }) {
      if (remoteInfo.type !== 'window') return;
      const { pathname } = new URL(remoteInfo.entry);
      let mod: any = window;
      for (const segment of pathname.split('.')) mod = mod[segment];
      return mod;
    },
  };
}
