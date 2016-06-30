require 'faker'

# User.create({
#   	email: Faker::Internet.email,
#     password: 'password',
#     phone: Faker::PhoneNumber.phone_number,
#     username: Faker::Internet.user_name,
#     role: 'ap'
#     })
#
# 10.times do
#   User.create({
#   	email: Faker::Internet.email,
#     password: 'password',
#     phone: Faker::PhoneNumber.phone_number,
#     username: Faker::Internet.user_name,
#     role: 'sp'
#     })
# end
#
# activities = ["harvesting", "pruning", "weeding", "ploughing", "Spraying pesticide"]
# activities.each do |name|
# 	Activity.create({
# 		name: name,
# 		description: Faker::Lorem.paragraph
# 	})
# end

# 2.times do
#   Farm.create({
#     name: Faker::Internet.user_name,
#     lon: Faker::Number.decimal(1, 6)
#     lat: Faker::Number.decimal(1, 6),
#     area: 'password'
#   })
# end

#Region.new(country_id: 81, name: "Tamale1", state: "Northern region")
# r_a = Region.first.id
# r_b = Region.last.id
# 12.times do
#   ServiceProvider.create(
#     region_id: rand(r_a..r_b),
#     phone: Faker::PhoneNumber.phone_number,
#     name: Faker::Internet.user_name
#     )
  User.create!(fname:  "Example",
              lname:  "User",
              username:  "ExUser",
             email: "example@railstutorial.org",
             password:              "foobar",
             #password_confirmation: "foobar",
             #admin:     true,
             activated: true,
             activated_at: Time.zone.now)

  # 99.times do |n|
  # name  = Faker::Name.name
  # email = "example-#{n+1}@railstutorial.org"
  # password = "password"
  # User.create!(name:  name,
  #             email: email,
  #             password:              password,
  #             password_confirmation: password,
  #             activated: true,
  #             activated_at: Time.zone.now)
  # end
#end
