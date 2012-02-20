# encoding: UTF-8

require_relative "shotgun"

# Load static files in development.
# Ngninx takes care of this in production.
Cuba.use Rack::Static, urls: ["/images", "/css", "/js"]

# We use haml for rendering templates.
Cuba.plugin Cuba::Rendering
Cuba.set :template_engine, "haml"

# Routes are defined here:
Cuba.define do
  on get, "" do
    res.write view("home")
  end

  on get, "3d" do
    res.write view("3d")
  end
end
