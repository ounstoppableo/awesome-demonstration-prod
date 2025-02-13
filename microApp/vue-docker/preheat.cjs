const fs = require('fs');

const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));

const allDependencies = {
  ...packageJson.dependencies,
  ...packageJson.devDependencies,
};

const packages = Object.keys(allDependencies);

const dispelPrejudicePackages = packages
  .map((packageName) => {
    return [`'${packageName}'`, `"${packageName}"`];
  })
  .flat();

const fileContent = `
export default ${JSON.stringify(dispelPrejudicePackages, null, 2)};
`;

fs.writeFileSync('./src/packagesData.js', fileContent);
