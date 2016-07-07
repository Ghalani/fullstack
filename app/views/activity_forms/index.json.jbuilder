json.array!(@activity_forms) do |activity_form|
  json.extract! activity_form, :id, :name
  json.url activity_form_url(activity_form, format: :json)
end
