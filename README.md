# README #

### iOS fix for image load... ###

Xcode 12 builds seems to have issue, to fix i go to

    node_modules > react-native > Libraries > Images > RCTUIImageViewAnimated.m

And search for if (_currentFrame)

add else block to the if block as seen below code

if (_currentFrame) {
    layer.contentsScale = self.animatedImageScale;
    layer.contents = (__bridge id)_currentFrame.CGImage;
  } else {
    [super displayLayer:layer];
  }

## ############################# ##


This README would normally document whatever steps are necessary to get your application up and running.

### What is this repository for? ###

* Quick summary
* Version
* [Learn Markdown](https://bitbucket.org/tutorials/markdowndemo)

### How do I get set up? ###

* Summary of set up
* Configuration
* Dependencies
* Database configuration
* How to run tests
* Deployment instructions

### Contribution guidelines ###

* Writing tests
* Code review
* Other guidelines

### Who do I talk to? ###

* Repo owner or admin
* Other community or team contact