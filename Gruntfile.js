module.exports = function(grunt) {

	// Display stats
	require('time-grunt')(grunt);

	grunt.initConfig({
		typescript: {
			base: {
				src: ['src/**/*.ts'],
				dest: 'dist/source.js',
				options: {
					module: 'amd', //or commonjs 
					target: 'es5', //or es3 
					sourceMap: true,
					declaration: true,
					generateTsConfig: true
				}
			}
		},
		sass: {
			options: {
				sourceMap: true,
				outputStyle: 'compressed'
			},
			dev: {
				files: {
					'dist/style.css': 'css/**/*.scss'
				}
			},
		},
		watch: {
			grunt: {
				files: [
					'Gruntfile.js'
				],
				options: {
					reload: true
				}
			},
			typescript: {
				files: 'src/**/*.ts',
				tasks: ['typescript']
			},
			css: {
				files: 'css/**/*.scss',
				tasks: ['sass:dev']
			}
		}
	});

	grunt.loadNpmTasks('grunt-typescript');
	grunt.loadNpmTasks('grunt-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');
	
	grunt.registerTask('build', ['typescript', 'sass']);
	grunt.registerTask('default', ['build', 'watch']);
};