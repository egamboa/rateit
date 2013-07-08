module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    // Compile compass.
    compass: {
        dev: {
            options: {
              config: 'public/sass/config.rb', 
              cssDir: 'public/css',
              sassDir: 'public/sass'
            }
        },
        dist: {                   // Target
			options: {              // Target options
				config: 'public/sass/config.rb', 
              	cssDir: 'public/css',
              	sassDir: 'public/sass',
				environment: 'production'
			}
	    }
    },
    watch: {
      options: {
        livereload: true
      },
      files: ['public/sass/*.scss'],
      tasks: ['compass']
    }

  });

  // https://github.com/gruntjs/grunt-contrib-compass
  grunt.loadNpmTasks('grunt-contrib-compass');
  // https://github.com/gruntjs/grunt-contrib-watch
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('compile', ['compass']);

  grunt.registerTask('default', ['watch']);

};