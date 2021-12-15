import gql from 'graphql-tag';

export function getQuery(allLanguages, path) {
    const locks = allLanguages.map(l => `lock_${l.language}:nodeByPath(path: "${path}/j:translation_${l.language}") {lockInfo {details {type}}}`);
    const perms = allLanguages.map(l => `perm_${l.language}:hasPermission(permissionName: "jcr:modifyProperties_default_${l.language}")`);

    return gql`query($path:String!, $language: String, $property: String!) {
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
                property(name: $property, language: $language) {
                    value
                    values
                }
            }
            ${locks}
        }
    }`;
}

export function getMutation(allLanguages) {
    const setValue = allLanguages.map(l => `value_${l.language}:setValue(language: "${l.language}", value: $value) @include(if: $include_value_${l.language})`);
    const setValues = allLanguages.map(l => `values_${l.language}:setValues(language: "${l.language}", values: $values) @include(if: $include_values_${l.language})`);
    const varsDeclaration = allLanguages.map(l => `$include_value_${l.language}: Boolean!, $include_values_${l.language}: Boolean!`).join(',');

    return gql`mutation ($path:String!, $property: String!, $value: String!, $values: [String!], ${varsDeclaration}) {
        jcr {
            mutateNode(pathOrId: $path) {
                mutateProperty(name: $property) {
                    ${setValue}
                    ${setValues}
                }
            }
        }
    }`;
}
