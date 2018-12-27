function resolveResource(resourceRelativePath = "") {
    return require(`@resources/${resourceRelativePath}`);
}

export { resolveResource };


