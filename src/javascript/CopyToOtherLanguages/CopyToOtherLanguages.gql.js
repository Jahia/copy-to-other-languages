import gql from 'graphql-tag';

/**
 * A language can receive the copy only if the current user can modify its properties,
 * its translation node is not locked and the node is not locked by someone else.
 * @param data result of the query returned by getQuery
 * @param language language code to check
 * @returns {boolean} true if the values can be copied to this language
 */
export function isLanguageAvailable(data, language) {
    const node = data?.jcr?.nodeByPath;
    if (!node || node.lockedAndCannotBeEdited) {
        return false;
    }

    const translationLockDetails = data.jcr[`lock_${language}`]?.lockInfo?.details ?? [];
    return Boolean(node[`perm_${language}`]) && translationLockDetails.length === 0;
}

export function getQuery(allLanguages, path) {
    const locks = allLanguages.map(l => `lock_${l.language}:nodeByPath(path: "${path}/j:translation_${l.language}") {lockInfo {details {type}}}`);
    const perms = allLanguages.map(l => `perm_${l.language}:hasPermission(permissionName: "jcr:modifyProperties_default_${l.language}")`);

    return gql`query GetTranslationLocksAndPermissions($path:String!) {
        jcr {
            nodeByPath(path: $path) {
                uuid
                workspace
                path
                lockedAndCannotBeEdited
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
