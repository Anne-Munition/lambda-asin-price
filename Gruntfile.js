const fs = require('fs');
const path = require('path');

const buildDir = path.join(process.cwd(), 'build');

module.exports = function (grunt) {
  grunt.initConfig({
    run: {
      install: {
        options: { cwd: 'build' },
        exec: 'npm install --omit=dev',
      },
      prettier: {
        exec: 'npm run prettier',
      },
      lint: {
        exec: 'npm run lint',
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

  grunt.registerTask('copy package.lock', () => {
    fs.copyFileSync(
      './package-lock.json',
      path.join(buildDir, 'package-lock.json'),
    );
  });

  grunt.registerTask('default', [
    'run:prettier',
    'run:lint',
    'remove build folder',
    'create build folder',
    'copy package.json',
    'copy package.lock',
    'run:install',
    'compress',
    'remove build folder',
  ]);
};
