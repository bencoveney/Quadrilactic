module.exports = function(grunt) {

	grunt.initConfig({
		typescript: {
			base: {
				src: ['src/**/*.ts'],
				dest: 'dist/source.js',
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
					'dist/style.css': 'css/**/*.scss'
				}
			},
		},
		watch: {
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
	grunt.registerTask('default', ['watch']);
};