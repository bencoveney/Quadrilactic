module.exports = function(grunt) {

	grunt.initConfig({
		typescript: {
			base: {
				src: ['typescript/**/*.ts'],
				dest: 'generated/source.js',
				options: {
					module: 'amd', //or commonjs 
					target: 'es5', //or es3 
					sourceMap: true,
					declaration: true
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
					'generated/style.css': 'sass/**/*.scss'
				}
			},
		},
		watch: {
			typescript: {
				files: 'typescript/**/*.ts',
				tasks: ['typescript']
			},
			css: {
				files: 'sass/**/*.scss',
				tasks: ['sass:dev']
			}
		}
	});

	grunt.loadNpmTasks('grunt-typescript');
	grunt.loadNpmTasks('grunt-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');
	
	grunt.registerTask('default', ['watch']);
};