require 'faker'

User.create({
  	email: Faker::Internet.email,
    password: 'password',
    phone: Faker::PhoneNumber.phone_number,
    username: Faker::Internet.user_name,
    role: 'ap'
    })

10.times do
  User.create({
  	email: Faker::Internet.email,
    password: 'password',
    phone: Faker::PhoneNumber.phone_number,
    username: Faker::Internet.user_name,
    role: 'sp'
    })
end

activities = ["harvesting", "pruning", "weeding", "ploughing", "Spraying pesticide"]
activities.each do |name|
	Activity.create({
		name: name,
		description: Faker::Lorem.paragraph
	})
end

2.times do
  Farm.create({
    name: Faker::Internet.user_name,
    coord: [Faker::Number.decimal(1, 6), Faker::Number.decimal(1, 6)],
    area: 'password'
  })
end