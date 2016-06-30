class BackendSlackbotService
  require 'slack-notifier'
  def initialize(channel = '#backend')
    @notifier = Slack::Notifier.new ENV['SLACK_WEBHOOK_URL'], channel: channel, username: 'notifier'
  end

  def send(message = "Hello default")
    @notifier.ping message
  end
end
