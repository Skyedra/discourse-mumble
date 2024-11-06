module Jobs
  class MumbleJob < Jobs::Scheduled
    sidekiq_options retry: false
    #every 1.minutes
	every 20.seconds

    def execute(_args)

      MessageBus.publish("/mumble", {data: Mumble.fetch_data})

    end
  end
end