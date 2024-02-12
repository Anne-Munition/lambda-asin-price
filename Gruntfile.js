const fs = require('fs');
const path = require('path');

const buildDir = path.join(process.cwd(), 'build');

module.exports = function (grunt) {
  grunt.initConfig({
    run: {
      install: {
        options: { cwd: 'build' },
        exec: 'yarn install',
      },
      prettier: {
        exec: 'yarn prettier',
      },
      lint: {
        exec: 'yarn lint',
      },
    },
    compress: {
      main: {
        options: {
          archive: 'dist/lambda-asin-price.zip',
          mode: 'zip',
        },
        files: [
          {
            expand: true,
            cwd: 'build/',
            src: ['node_modules/**'],
            dest: '/',
          },
          {
            expand: true,
            cwd: 'src/',
            src: ['*'],
            dest: '/',
          },
        ],
      },
    },
  });

  grunt.loadNpmTasks('grunt-run');
  grunt.loadNpmTasks('grunt-contrib-compress');

  grunt.registerTask('remove build folder', () => {
    if (fs.existsSync(buildDir)) fs.rmdirSync(buildDir, { recursive: true });
  });

  grunt.registerTask('create build folder', () => {
    fs.mkdirSync(buildDir);
  });

  grunt.registerTask('copy package.json', () => {
    fs.copyFileSync('./package.json', path.join(buildDir, 'package.json'));
  });

  grunt.registerTask('copy yarn.lock', () => {
    fs.copyFileSync('./yarn.lock', path.join(buildDir, 'yarn.lock'));
  });

  grunt.registerTask('default', [
    'run:prettier',
    'run:lint',
    'remove build folder',
    'create build folder',
    'copy package.json',
    'copy yarn.lock',
    'run:install',
    'compress',
    'remove build folder',
  ]);
};
