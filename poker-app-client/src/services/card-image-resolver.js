import { resolveResource } from './resource-resolver';

function resolveCardImage(suit, value) {
    const cardPath = suit && value && `cards/${value}${suit.toUpperCase().charAt(0)}.png`
    return resolveResource(cardPath);
}


export { resolveCardImage };