module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {

      },
      build: {
        files: [{
            expand: true,
            src: ['build/resources/main/META-INF/resources/**/*.js',
                '!build/**/*.es5.js',
                '!build/**/*.es6.js',
                '!build/**/index.js',
                '!build/**/lodash.js',
                '!build/**/loading.component.js',
                '!build/**/esm2015/**/*.js',
                '!build/**/_esm2015/**/*.js',
                '!build/**/locales/**/*.js',
                '!build/**/src/**/*.js',
                '!build/**/esm5/**/*.js',
                '!build/**/es/**/*.js',
                '!build/**/_esm5/**/*.js',
                '!build/**/@ngx-translate/**/core.js'],
            dest: 'build/resources/main/META-INF/resources/',
            cwd: '.',
            rename: function (dst, src) {
                // To keep src js files and make new files as *.min.js :
                // return dst + '/' + src.replace('.js', '.min.js');
                // Or to override to src :
                return src;
            }
        }]
    }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Default task(s).
  grunt.registerTask('default', ['uglify']);

};