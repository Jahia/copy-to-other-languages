import gql from 'graphql-tag';

export function getQuery(allLanguages, path) {
    const locks = allLanguages.map(l => `lock_${l.language}:nodeByPath(path: "${path}/j:translation_${l.language}") {lockInfo {details {type}}}`);
    const perms = allLanguages.map(l => `perm_${l.language}:hasPermission(permissionName: "jcr:modifyProperties_default_${l.language}")`);

    return gql`query GetTranslationLocksAndPermissions($path:String!) {
        jcr {
            nodeByPath(path: $path) {
                uuid
                workspace
                path
                lockInfo {
                    details {
                        language
                        owner
                        type
                    }
                }
                ${perms}
            }
            ${locks}
        }
    }`;
}
