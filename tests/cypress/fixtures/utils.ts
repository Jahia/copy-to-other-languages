import gql from 'graphql-tag';

export function setLanguages(siteKey: string, values: string[]) {
    cy.apollo({
        mutationFile: 'graphql/jcr/mutation/mutateNode.graphql',
        variables: {
            pathOrId: `/sites/${siteKey}`,
            properties: [{name: 'j:languages', values: values}]
        }
    });
}

export function lockNode(uuid: string) {
    cy.apollo({
        mutation: gql`mutation lockNode {
            jcr {
                mutateNode(pathOrId: "${uuid}") {
                    lock
                }
            }
        }`,
        variables: {uuid}
    });
}

export function unlockNode(uuid: string) {
    cy.apollo({
        mutation: gql`mutation unlockNode {
            jcr {
                mutateNode(pathOrId: "${uuid}") {
                    unlock
                }
            }
        }`,
        variables: {uuid}
    });
}
