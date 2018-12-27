import { resolveResource } from './resource-resolver';

function resolveIcon(iconName = "") {
    return resolveResource(`icons/${iconName}`);
}

export { resolveIcon };