# encoding: UTF-8

require "cuba"
require "cuba/render"
require "haml"

# Load static files in development.
# Ngninx takes care of this in production.
Cuba.use Rack::Static, urls: ["/images", "/css", "/js"]

Cuba.plugin Cuba::Render
Cuba.settings[:template_engine] = "haml"
Cuba.settings[:layout] = "layout"

# Routes are defined here:
Cuba.define do
  on get, root do
    res.write view("home")
  end
  on "google86d3858c50127ce4.html" do
    res.write view("google_analytics")
  end
end
