module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'], // ou ['module:metro-react-native-babel-preset'] dependendo do seu projeto
    plugins: [
      ['@babel/plugin-transform-private-methods', { loose: true }],
      ['@babel/plugin-transform-class-properties', { loose: true }],
      ['@babel/plugin-transform-private-property-in-object', { loose: true }],
    ],
  };
};