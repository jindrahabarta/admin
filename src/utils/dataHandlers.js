import fs from 'fs'
import path from 'path'

/**
 * @param {string} fileName - Searched filename
 * @returns {data} returns JSON format data
 */

export const readData = async (fileName) => {
    const resolvedPath = path.resolve(`src/database/${fileName}.json`)
    const data = await fs.promises.readFile(resolvedPath)
    return JSON.parse(data)
}

/**
 * @param {string} fileName - Name of file to write
 */

export const writeData = async (fileName, data) => {
    const resolvedPath = path.resolve(`src/database/${fileName}.json`)

    await fs.promises.writeFile(resolvedPath, JSON.stringify(data, null, 2))
}
