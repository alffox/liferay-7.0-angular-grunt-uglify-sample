# Liferay 7.0 angular grunt-uglify sample

A sample repo made to illustrate how to apply grunt-uglify task to a Liferay 7.0 Angular sample portlet.

## Why is the grunt-uglify process necessary ?

The grunt-uglify process on the Liferay 7.0 Angular blade sample is a workaround to prevent an issue with the Liferay minifier from happening, making the portlet not usable.

Currently, Liferay 7.0 ships a version of the [Google Closure Compiler](https://developers.google.com/closure/compiler/) that will not be able to minify certain parts of JSDOC included by Angular, throwing this error in the server console:

```
ERROR [http-nio-8080-exec-7] [ComboServlet:89] [UserId test] [Issue ] java.lang.RuntimeException: java.lang.RuntimeException: Can't attach jsdoc to unknown node: 124
java.lang.RuntimeException: java.lang.RuntimeException: Can't attach jsdoc to unknown node: 124
    at com.google.javascript.jscomp.Compiler.runInCompilerThread(Compiler.java:720)
    at com.google.javascript.jscomp.Compiler.compile(Compiler.java:647)
    at com.google.javascript.jscomp.Compiler.compile(Compiler.java:603)
    at com.google.javascript.jscomp.Compiler.compile(Compiler.java:553)
    at com.liferay.portal.minifier.GoogleJavaScriptMinifier.compress(GoogleJavaScriptMinifier.java:64)
    at com.liferay.portal.minifier.MinifierUtil._minifyJavaScript(MinifierUtil.java:93)
    at com.liferay.portal.minifier.MinifierUtil.minifyJavaScript(MinifierUtil.java:48)
    at com.liferay.portal.servlet.ComboServlet.getResourceContent(ComboServlet.java:373)
    at com.liferay.portal.servlet.ComboServlet.doService(ComboServlet.java:250)
    at com.liferay.portal.servlet.ComboServlet.service(ComboServlet.java:86)
    at javax.servlet.http.HttpServlet.service(HttpServlet.java:729)
    at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:292)
    at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:207)
...
Caused by: java.lang.RuntimeException: Can't attach jsdoc to unknown node: 124
    at com.google.javascript.rhino.head.AttachJsDocs.attachComment(AttachJsDocs.java:561)
    at com.google.javascript.rhino.head.AttachJsDocs.attachComments(AttachJsDocs.java:138)
    at com.google.javascript.rhino.head.Parser.parse(Parser.java:471)
    at com.google.javascript.jscomp.parsing.ParserRunner.parse(ParserRunner.java:133)
    at com.google.javascript.jscomp.JsAst.parse(JsAst.java:84)
    at com.google.javascript.jscomp.JsAst.getAstRoot(JsAst.java:50)
    at com.google.javascript.jscomp.CompilerInput.getAstRoot(CompilerInput.java:117)
    at com.google.javascript.jscomp.Compiler.hoistExterns(Compiler.java:1440)
    at com.google.javascript.jscomp.Compiler.parseInputs(Compiler.java:1344)
    at com.google.javascript.jscomp.Compiler.parse(Compiler.java:769)
    at com.google.javascript.jscomp.Compiler.compileInternal(Compiler.java:728)
    at com.google.javascript.jscomp.Compiler.access$000(Compiler.java:83)
    at com.google.javascript.jscomp.Compiler$2.call(Compiler.java:650)
    at com.google.javascript.jscomp.Compiler$2.call(Compiler.java:647)
    at com.google.javascript.jscomp.Compiler.runInCompilerThread(Compiler.java:710)
    ... 106 more
```

This problem has been solved by upgrading the Google Closure Compiler that Liferay ships on its [7.1 version](https://dev.liferay.com/develop/tutorials/-/knowledge_base/7-1/introduction-to-liferay-development). The Google Closure Compiler that Liferay has on 7.0 will not be upgraded to prevent the risk of introducing breaking-changes and unforeseen regressions.

## How to run this project ?

The project is created to show in a Github-fashion way the necessary changes to be applied by developers on their projects.

1) Get your local copy of Liferay 7.0 Angular sample: https://dev.liferay.com/develop/reference/-/knowledge_base/7-0/npm-angular-portlet-template

2) Run the following commands from the portlet root:

```
npm install grunt --save-dev
npm install grunt-contrib-uglify --save-dev
```

3) Add a new file called **Gruntfile.js** to the root of the portlet. The content:

```
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
```

4) Add the _uglify_ task into the of **package.json** scripts through `&& grunt uglify`, for example:

```
"scripts": {
		"build": "tsc && liferay-npm-bundler && grunt uglify"
	},
```

5) From the portlet's root, run ./gradlew build

6) Deploy the .jar module created at ../build/libs into your Liferay 7.0 and add it to a page, the portlet should render and properly work
