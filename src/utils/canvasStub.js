module.exports = {
    createCanvas: () => ({ getContext: () => null }),
    loadImage: () => Promise.resolve(null),
};
