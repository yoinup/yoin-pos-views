abort "Please use Ruby 1.9 to build Ember.js!" if RUBY_VERSION !~ /^1\.9/

require "bundler/setup"
require "erb"
require 'rake-pipeline'
require "colored"

def pipeline
  Rake::Pipeline::Project.new("Assetfile")
end



desc "Build ember.js"
task :dist do
  puts "Building Ember..."
  pipeline.invoke
  puts "Done"
end

desc "Clean build artifacts from previous builds"
task :clean do
  puts "Cleaning build..."
  pipeline.clean
  puts "Done"
end


task :default => :dist

require "jshintrb/jshinttask"
Jshintrb::JshintTask.new :jshint do |t|
  t.pattern = '{app/app/lib/**/*.js,app/submodules/yoin-ember/lib/**/*.js}'
  t.options = {
    :predef => [
        "jQuery",
        "Cordova",
        "device",
        "DeviceInfo",
        "InfoBubble",
        "moment",
        "iScroll",
        "$",
        "Mk",
        "$",
        "google",
        "I18n",
        "Yn",
        "App",
        "console",
        "Em",
        "Ember",
        "DS",
        "Handlebars",
        "Metamorph",
        "require",
        "equal",
        "test",
        "testBoth",
        "testWithDefault",
        "raises",
        "deepEqual",
        "start",
        "stop",
        "ok",
        "strictEqual",
        "module",
        "expect",
        "minispade"
      ],

    :node => false,
    :browser => true,

    :boss => true,
    :curly=> false,
    :debug=> false,
    :devel=> false,
    :eqeqeq=> true,
    :evil=> true,
    :forin=> false,
    :immed=> false,
    :laxbreak=> false,
    :newcap=> true,
    :noarg=> true,
    :noempty=> false,
    :nonew=> false,
    :nomen=> false,
    :onevar=> false,
    :plusplus=> false,
    :undef=> true,
    :regexp=> false,
    :sub=> true,
    :strict=> false,
    :white=> false,
    :eqnull=> true

  }
    
end
