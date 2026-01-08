module.exports = {
  assets: ["./assets/fonts"],
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module:react-native-dotenv',
      {
        moduleName: '@env',
        path: '.env',
        allowUndefined: true,
      },
    ],
    'react-native-reanimated/plugin',
  ],
};
