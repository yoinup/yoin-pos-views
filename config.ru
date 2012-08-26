
require 'rake-pipeline'
require 'rake-pipeline/middleware'

#require 'rack/rewrite'

#use Rack::Rewrite do
#  rewrite '/', '/index.html'
#end

use Rake::Pipeline::Middleware, "Assetfile"
run Rack::Directory.new('.')
