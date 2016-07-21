class TwilioSmsService
  require 'twilio-ruby' # put your own credentials here

  def initialize()
  end

  def send(to, body)
    account_sid = 'ACd465a5815f757e065acac227d423f14a'
    auth_token = '4b059bf957212d154d6b63d453ce65e3'
    from = '+12562977245'
    client = Twilio::REST::Client.new account_sid, auth_token
    client.account.messages.create({
        :to => to,
        :from => from,
        :body => body,
    })
  end
end
