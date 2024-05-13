#!/bin/bash
version=$(node -p "require('./package.json').devDependencies['@jahia/cypress']")
echo Using @jahia/cypress@$version...
echo "NEXUS_USERNAME: "
echo $NEXUS_USERNAME | sed 's/./& /g'
npx --yes --package @jahia/cypress@$version env.run
