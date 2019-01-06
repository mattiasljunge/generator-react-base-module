let Generator = require('yeoman-generator');
let mkdirp = require('mkdirp');
let path = require('path');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
  }

  prompting() {
    return this.prompt([
      {
        type: 'input',
        name: 'packageName',
        message: 'Package name',
        default: this.appname.replace(/ /g, '-'),
      },
      {
        type: 'input',
        name: 'authorName',
        message: 'Author name',
        default: 'Mattias Ljunge',
      },
      {
        type: 'input',
        name: 'authorEmail',
        message: 'Author email',
        default: 'mattias.ljunge@gmail.com',
      },
      {
        type: 'input',
        name: 'githubPath',
        message: 'Github path',
        default: 'mattiasljunge',
      },
      {
        type: 'input',
        name: 'useGit',
        message: 'Do you want to initialize git repo? (y/n)',
        default: 'y',
      },
    ]).then(answers => {
      this.answers = answers;
    });
  }

  writing() {
    this._copy('./src', './src');
    this._copy('./docs', './docs');
    this._copyFile('.editorconfig');
    this._copyFile('.eslintrc.json');
    this._copyFile('.gitattributes');
    this._copyFile('.gitignore');
    this._copyFile('.nontemplates');
    this._copyFile('README.md');
    this._copyFile('test-setup.js');
    this._copyFile('wallaby.config.js');
    this._copyFile('webpack.config.js');

    this.fs.copyTpl(this.templatePath('package.json'), this.destinationPath('package.json'), {
      packageName: this.answers.packageName,
      authorName: this.answers.authorName,
      authorEmail: this.answers.authorEmail,
    });

    this.fs.copyTpl(this.templatePath('LICENSE'), this.destinationPath('LICENSE'), {
      authorName: this.answers.authorName,
      authorEmail: this.answers.authorEmail,
      githubPath: this.answers.githubPath,
    });
  }

  end() {
    this._createGitRepo();
  }

  installDependencies() {
    this.npmInstall();
  }

  _createSrcFolder() {
    mkdirp('src');
  }

  _copyFile(filename) {
    this._copy(filename, filename);
  }

  _copy(from = '', to = '') {
    this.fs.copy(path.join(this.sourceRoot(), from), to);
  }

  _createGitRepo() {
    if (this.answers.useGit === 'y') {
      let done = this.async();
      let async = require('async');
      let chalk = require('chalk');
      let exec = require('child_process').exec;

      this.log(
        '\n\nInitializing Git repository. If this fail, try running ' +
          chalk.yellow.bold('git init') +
          ' and make a first commit manually',
      );
      async.series(
        [
          function(taskDone) {
            exec('git init', taskDone);
          },
          function(taskDone) {
            exec('git add . --all', taskDone);
          },
          function(taskDone) {
            exec('git commit -m "Initial commit"', taskDone);
          },
        ],
        function(err) {
          if (err === 127) {
            this.log(
              'Could not find the ' +
                chalk.yellow.bold('git') +
                ' command. Make sure Git is installed.',
            );
            return;
          }

          this.log(chalk.green('complete') + ' Git repository has been setup');
          done();
        }.bind(this),
      );
    } else {
    }
  }
};
