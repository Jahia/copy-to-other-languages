#!/bin/bash
version=$(node -p "require('./package.json').devDependencies['@jahia/cypress']")
echo Using @jahia/cypress@$version...
echo $NEXUS_USERNAME
npx --yes --package @jahia/cypress@$version ci.startup
