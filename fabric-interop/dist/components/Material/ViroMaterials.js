"use strict";
/**
 * ViroMaterials
 *
 * A utility for creating and managing materials.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerMaterials = registerMaterials;
exports.getMaterial = getMaterial;
exports.getAllMaterials = getAllMaterials;
exports.updateMaterial = updateMaterial;
// Material registry
const materials = {};
/**
 * Register materials with the Viro system.
 * @param materialMap A map of material names to material definitions.
 */
function registerMaterials(materialMap) {
    // Add materials to the registry
    Object.entries(materialMap).forEach(([name, definition]) => {
        materials[name] = definition;
        // Register with native code if available
        if (global.NativeViro) {
            global.NativeViro.createViroMaterial(name, definition);
        }
    });
}
/**
 * Get a material by name.
 * @param name The name of the material.
 * @returns The material definition, or undefined if not found.
 */
function getMaterial(name) {
    return materials[name];
}
/**
 * Get all registered materials.
 * @returns A map of material names to material definitions.
 */
function getAllMaterials() {
    return { ...materials };
}
/**
 * Update a material.
 * @param name The name of the material to update.
 * @param definition The new material definition.
 */
function updateMaterial(name, definition) {
    // Update the registry
    materials[name] = { ...materials[name], ...definition };
    // Update native code if available
    if (global.NativeViro) {
        global.NativeViro.updateViroMaterial(name, definition);
    }
}
// Export the materials object as the default export
const ViroMaterials = {
    registerMaterials,
    getMaterial,
    getAllMaterials,
    updateMaterial,
};
exports.default = ViroMaterials;
//# sourceMappingURL=ViroMaterials.js.map