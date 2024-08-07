import fs from 'fs/promises'

async function updateDependencies() {
  try {
    // Read the package.json file
    const packageJson = JSON.parse(await fs.readFile('package.json', 'utf8'))

    // Get the current version
    const currentVersion = packageJson.version

    // Update dependencies
    if (packageJson.dependencies) {
      for (const [dep, version] of Object.entries(packageJson.dependencies)) {
        if (dep.startsWith('@equistamp/')) {
          packageJson.dependencies[dep] = `^${currentVersion}`
        }
      }
    }

    // Write the updated package.json back to the file
    await fs.writeFile('package.json', JSON.stringify(packageJson, null, 2))

    console.log('Dependencies updated successfully.')
  } catch (error) {
    console.error('Error updating dependencies:', error)
  }
}

updateDependencies()
